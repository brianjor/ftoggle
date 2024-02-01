import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  constructor(private apiService: ApiService) {}

  async createEnvironment(projectId: string, environment: { name: string }) {
    try {
      await this.apiService.api.projects[projectId].environments.post({
        $query: { projectId },
        environmentName: environment.name,
      });
    } catch (err) {
      console.error('Error creating feature', err);
    }
  }

  async deleteEnvironment(projectId: string, environmentId: number) {
    try {
      await this.apiService.api.projects[projectId].environments[
        environmentId
      ].delete();
    } catch (err) {
      console.error('Error deleting environment', err);
    }
  }
}
