import { Injectable } from '@angular/core';
import { ConditionsTableItem } from '@ftoggle/api/types/conditionsTypes';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ConditionsService {
  constructor(private apiService: ApiService) {}

  async createConditions(
    projectId: string,
    featureId: number,
    environmentId: number,
    conditions: {
      contextName: string;
      operator: string;
      description?: string;
      values: string[];
    }[],
  ) {
    return await this.apiService.api.projects[projectId].features[
      featureId
    ].environments[environmentId].conditions.post({
      conditions,
    });
  }

  async getConditions(
    projectId: string,
    featureId: string,
    environmentId: number,
  ) {
    const res =
      await this.apiService.api.projects[projectId].features[
        featureId
      ].environments[environmentId].conditions.get();
    return res.data?.conditions ?? [];
  }

  async deleteCondition(condition: ConditionsTableItem) {
    await this.apiService.api.projects[condition.projectId].features[
      condition.featureId
    ].environments[condition.environmentId].conditions[condition.id].delete();
  }
}
