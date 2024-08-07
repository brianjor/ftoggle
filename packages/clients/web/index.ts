type Event = 'changed';
type VoidFunction = () => void;
type Context = Record<string, string[]>;

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
  value: string;
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

  public set context(ctx: Context) {
    this._config.context = ctx;
  }

  public get context() {
    return this._config.context;
  }

  public isEnabled(featureName: string): boolean {
    const feature = this.features.get(featureName);
    return (feature?.isEnabled ?? false) && this.checkConditions(feature!);
  }

  private checkConditions(feature: { conditions: Condition[] }): boolean {
    const conditions = feature.conditions;
    const context = this._config.context;
    const passes = conditions.every((condition) => {
      if (!(condition.field in context) && condition.field !== 'currentTime') {
        console.error(`FToggle: Context missing field: "${condition.field}"`);
        return false;
      }
      const fieldValues = context[condition.field];
      const curTime = new Date();
      switch (condition.operator) {
        case 'LESS_THAN':
          return fieldValues.some(
            (fieldValue) => +fieldValue < +condition.value,
          );
        case 'GREATER_THAN':
          return fieldValues.some(
            (fieldValue) => +fieldValue > +condition.value,
          );
        case 'LESS_OR_EQUAL_TO':
          return fieldValues.some(
            (fieldValue) => +fieldValue <= +condition.value,
          );
        case 'GREATER_OR_EQUAL_TO':
          return fieldValues.some(
            (fieldValue) => +fieldValue >= +condition.value,
          );
        case 'EQUAL_TO':
          return fieldValues.some(
            (fieldValue) => +fieldValue === +condition.value,
          );
        case 'NOT_EQUAL_TO':
          return fieldValues.some(
            (fieldValue) => +fieldValue !== +condition.value,
          );
        case 'STARTS_WITH':
          return fieldValues.some((fieldValue) =>
            fieldValue.startsWith(condition.value),
          );
        case 'ENDS_WITH':
          return fieldValues.some((fieldValue) =>
            fieldValue.endsWith(condition.value),
          );
        case 'CONTAINS': {
          return condition.values.every((value) =>
            fieldValues.some((fieldValue) => fieldValue.includes(value)),
          );
        }
        case 'IN':
          return condition.values.some((value) => fieldValues.includes(value));
        case 'NOT_IN':
          return !condition.values.some((value) => fieldValues.includes(value));
        case 'DATE_BEFORE':
          return curTime < new Date(condition.value);
        case 'DATE_AFTER':
          return curTime > new Date(condition.value);
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
