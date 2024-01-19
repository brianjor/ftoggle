import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  constructor(private apiService: ApiService) {}

  async createEnvironment(projectId: number, environment: { name: string }) {
    try {
      await this.apiService.api.projects[projectId].environments.post({
        $query: {
          projectId: String(projectId),
        },
        environmentName: environment.name,
      });
    } catch (err) {
      console.error('Error creating feature', err);
    }
  }
}
