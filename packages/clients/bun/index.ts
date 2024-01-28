interface Config {
  /** Your frontend API token */
  apiToken: string;
  /** Base API URL to your FToggle api */
  baseUrl: string;
  /** How often should the client check for feature changes. In seconds. */
  refreshInterval?: number;
}

interface _Config extends Config {
  refreshInterval: number;
}

export class FToggle {
  private features: Map<string, boolean> = new Map();
  private _config: _Config;

  constructor(
    config: Config = {
      apiToken: '',
      baseUrl: '',
      refreshInterval: 30,
    },
  ) {
    // Supply any fields that were optional for the user to supply
    // but let them be overrided if the user did supply any
    this._config = {
      refreshInterval: 30,
      ...config,
    };
    this.getFeatures();
  }

  public isEnabled(featureName: string): boolean {
    return this.features.get(featureName) ?? false;
  }

  private setTimeout() {
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
    if (res.status !== 200) {
      console.error('FToggleClient: Bad response.', body);
      this.setTimeout();
      return;
    }
    if (body === undefined) {
      console.error('FToggleClient: No data in response.');
      this.setTimeout();
      return;
    }

    this.features.clear();
    body.features.forEach((f) => {
      this.features.set(f.name, f.isEnabled);
    });
    this.setTimeout();
  }
}
