import { Injectable, signal } from '@angular/core';
import { EnvironmentsTableItem } from '@ftoggle/api/types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  private _environments = signal<EnvironmentsTableItem[]>([]);
  public environments = this._environments.asReadonly();

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

  async getEnvironments(projectId: string) {
    try {
      const response =
        await this.apiService.api.projects[projectId].environments.get();

      this._environments.set(response.data?.data.environments ?? []);
    } catch (err) {
      console.error('Error getting enviroments', err);
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
