import { Injectable } from '@angular/core';
import { edenFetch } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  api = edenFetch<App>(environment.apiBaseUrl);

  constructor(private local: LocalStorageService) {}

  async createFeature(projectId: number, feature: { name: string }) {
    try {
      await this.api('/api/projects/:projectId/features', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.local.getApiToken()}`,
        },
        params: {
          projectId,
        },
        body: {
          name: feature.name,
        },
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
      await this.api(
        '/api/projects/:projectId/features/:featureId/environments/:environmentId',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.local.getApiToken()}`,
          },
          params: {
            projectId: +projectId,
            featureId,
            environmentId,
          },
        },
      );
    } catch (err) {
      console.error('Error toggling feature', err);
    }
  }
}
