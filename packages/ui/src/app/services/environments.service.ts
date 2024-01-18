import { Injectable } from '@angular/core';
import { edenFetch } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  api = edenFetch<App>(environment.apiBaseUrl);

  constructor(private local: LocalStorageService) {}

  async createEnvironment(projectId: number, environment: { name: string }) {
    try {
      await this.api('/api/projects/:projectId/environments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.local.getApiToken()}`,
        },
        params: {
          projectId,
        },
        body: {
          environmentName: environment.name,
        },
      });
    } catch (err) {
      console.error('Error creating feature', err);
    }
  }
}
