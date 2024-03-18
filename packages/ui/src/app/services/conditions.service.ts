import { Injectable } from '@angular/core';
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
}
