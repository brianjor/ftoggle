import { Injectable } from '@angular/core';
import { ConditionsTableItem } from '@ftoggle/api/types/conditionsTypes';
import { SingleValueOperatorsValues } from '@ftoggle/common/enums/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ConditionsService {
  constructor(private apiService: ApiService) {}

  async createConditions(
    projectId: string,
    featureName: string,
    environmentName: string,
    conditions: {
      contextName: string;
      operator: string;
      description?: string;
      values: string[];
      value: string;
    }[],
  ) {
    return await this.apiService.api
      .projects({ projectId })
      .features({ featureName })
      .environments({ environmentName })
      .conditions.post({
        conditions,
      });
  }

  async getConditions(
    projectId: string,
    featureName: string,
    environmentName: string,
  ) {
    const res = await this.apiService.api
      .projects({ projectId })
      .features({ featureName })
      .environments({ environmentName })
      .conditions.get();
    return res.data?.conditions ?? [];
  }

  async editCondition(
    conditionToEdit: ConditionsTableItem,
    projectId: string,
    featureName: string,
    environmentName: string,
    changes: { operator: string; value: string; values: string[] },
  ) {
    await this.apiService.api.projects[projectId].features[
      featureName
    ].environments[environmentName].conditions[conditionToEdit.id].patch({
      operator: changes.operator,
      ...(SingleValueOperatorsValues.includes(changes.operator)
        ? { value: changes.value }
        : { values: changes.values }),
    });
  }

  async deleteCondition(
    condition: ConditionsTableItem,
    featureName: string,
    environmentName: string,
  ) {
    await this.apiService.api
      .projects({ projectId: condition.projectId })
      .features({ featureName })
      .environments({ environmentName })
      .conditions({ conditionId: condition.id })
      .delete();
  }
}
