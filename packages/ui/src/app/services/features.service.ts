import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  constructor(private apiService: ApiService) {}

  async createFeature(projectId: string, feature: { name: string }) {
    try {
      await this.apiService.api.projects[projectId].features.post({
        $query: { projectId },
        name: feature.name,
      });
    } catch (err) {
      console.error('Error creating feature', err);
    }
  }

  async toggleFeature(
    projectId: string,
    featureId: number,
    environmentId: number,
  ) {
    try {
      await this.apiService.api.projects[projectId].features[
        featureId
      ].environments[environmentId].put({
        $query: {
          projectId,
          featureId: String(featureId),
          environmentId: String(environmentId),
        },
      });
    } catch (err) {
      console.error('Error toggling feature', err);
    }
  }
}
