type Context = Record<string, string[]>;

interface Config {
  /** Your frontend API token */
  apiToken: string;
  /** Base API URL to your FToggle api */
  baseUrl: string;
  /** How often should the client check for feature changes. In seconds. */
  refreshInterval?: number;
  context?: Context;
}

interface _Config extends Config {
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
      const curTime = new Date();
      const fieldValues = context[condition.field];
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
      features: { name: string; isEnabled: boolean; conditions: Condition[] }[];
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
      this.features.set(f.name, {
        isEnabled: f.isEnabled,
        conditions: f.conditions,
      });
    });
    this.setTimeout();
  }
}
