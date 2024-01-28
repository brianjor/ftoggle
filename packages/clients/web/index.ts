type Event = 'changed';
type VoidFunction = () => void;

interface IConfig {
  /** Your frontend API token */
  apiToken: string;
  /** Base API URL to your FToggle api */
  baseUrl: string;
  /** How often should the client check for feature changes. In seconds. */
  refreshInterval?: number;
}

interface Config extends IConfig {
  refreshInterval: number;
}

export class FToggle {
  private features: Map<string, boolean> = new Map();
  private events: { [key: string]: { listeners: VoidFunction[] } } = {};
  private _config: Config;

  constructor(config: IConfig) {
    // Supply defaults to optional fields
    this._config = {
      refreshInterval: 30,
      ...config,
    };
    this.getFeatures();
  }

  public isEnabled(featureName: string): boolean {
    return this.features.get(featureName) ?? false;
  }

  public on(event: Event, listener: VoidFunction) {
    if (this.events[event] === undefined) {
      this.events[event] = { listeners: [] };
    }
    this.events[event].listeners.push(listener);
  }

  private emit(name: Event) {
    this.events[name].listeners.forEach((listener) => listener());
  }

  private waitToPoll() {
    setTimeout(() => {
      this.getFeatures();
    }, this._config.refreshInterval * 1000);
  }

  private async getFeatures() {
    const res = await fetch(this._config.baseUrl + '/api/client/features', {
      method: 'GET',
      headers: {
        Authorization: this._config.apiToken,
      },
    });
    const body = (await res.json()) as {
      features: { name: string; isEnabled: boolean }[];
    };

    let hasProblem = false;
    if (res.status !== 200) {
      hasProblem = true;
      console.error('FToggleClient: Bad response.', body);
    }
    if (body === undefined) {
      hasProblem = true;
      console.error('FToggleClient: No data in response.');
    }

    if (!hasProblem) {
      this.features.clear();
      body.features.forEach((f) => {
        this.features.set(f.name, f.isEnabled);
      });
      this.emit('changed');
    }
    this.waitToPoll();
  }
}
