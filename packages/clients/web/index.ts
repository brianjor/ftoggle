type Event = 'changed';
type VoidFunction = () => void;
type Context = Record<string, string | string[] | number | number[] | Date>;

interface IConfig {
  /** Your frontend API token */
  apiToken: string;
  /** Base API URL to your FToggle api */
  baseUrl: string;
  /** How often should the client check for feature changes. In seconds. */
  refreshInterval?: number;
  context?: Context;
}

interface Config extends IConfig {
  refreshInterval: number;
  context: Context;
}

interface Condition {
  field: string;
  operator: string;
  values: string[];
}

export class FToggle {
  private features: Map<
    string,
    { isEnabled: boolean; conditions: Condition[] }
  > = new Map();
  private events: { [key: string]: { listeners: VoidFunction[] } } = {};
  private _config: Config;

  constructor(config: IConfig) {
    // Supply defaults to optional fields
    this._config = {
      refreshInterval: 30,
      context: {},
      ...config,
    };
    this.getFeatures();
  }

  public isEnabled(featureName: string): boolean {
    const feature = this.features.get(featureName);
    return (feature?.isEnabled ?? false) && this.checkConditions(feature!);
  }

  private checkConditions(feature: { conditions: Condition[] }): boolean {
    const conditions = feature.conditions;
    const context = this._config.context;
    const passes = conditions.some((c) => {
      if (!(c.field in context)) {
        console.error(`FToggle: Context does not have the field: "${c.field}"`);
        return false;
      }
      switch (c.operator) {
        case 'LESS_THAN':
          return false;
        case 'GREATER_THAN':
          return false;
        case 'LESS_OR_EQUAL_TO':
          return false;
        case 'GREATER_OR_EQUAL_TO':
          return false;
        case 'EQUAL_TO':
          return false;
        case 'NOT_EQUAL_TO':
          return false;
        case 'STARTS_WITH':
          return false;
        case 'ENDS_WITH':
          return false;
        case 'CONTAINS': {
          const fieldValue = context[c.field];
          if (typeof fieldValue !== 'string') {
            console.error(
              `FToggle: Using "CONTAINS" against a non-string field "${c.field}"`,
            );
            return false;
          }
          return c.values.some((value) => value.includes(fieldValue));
        }
        case 'IN':
          return false;
        case 'NOT_IN':
          return false;
        case 'DATE_BEFORE':
          return false;
        case 'DATE_AFTER':
          return false;
        default:
          return false;
      }
    });
    return passes;
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
      features: {
        name: string;
        isEnabled: boolean;
        conditions: Condition[];
      }[];
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
        this.features.set(f.name, {
          isEnabled: f.isEnabled,
          conditions: f.conditions,
        });
      });
      this.emit('changed');
    }
    this.waitToPoll();
  }
}
