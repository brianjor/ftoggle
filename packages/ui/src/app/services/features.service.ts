import { Injectable, signal } from '@angular/core';
import { FeatureWithEnvironments } from '@ftoggle/api/types/featuresTypes';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private _features = signal<FeatureWithEnvironments[]>([]);
  public features = this._features.asReadonly();

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

  async getFeatures(projectId: string) {
    try {
      const response =
        await this.apiService.api.projects[projectId].features.get();
      this._features.set(response.data?.features ?? []);
      return;
    } catch (error) {
      console.log('Error getting features');
    }
  }

  async toggleFeature(
    projectId: string,
    featureName: string,
    environmentId: number,
  ) {
    try {
      await this.apiService.api.projects[projectId].features[
        featureName
      ].environments[environmentId].put({
        $query: {
          projectId,
          featureName: featureName,
          environmentId: String(environmentId),
        },
      });
    } catch (err) {
      console.error('Error toggling feature', err);
    }
  }

  async deleteFeature(featureName: string, projectId: string) {
    try {
      await this.apiService.api.projects[projectId].features[
        featureName
      ].delete();
    } catch (error) {
      console.error('Error deleting feature', error);
    }
  }
}
