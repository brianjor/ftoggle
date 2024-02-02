import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private _projects = signal<{ id: string; name: string }[]>([]);
  public projects = this._projects.asReadonly();

  constructor(private apiService: ApiService) {}

  async getProjects() {
    try {
      const response = await this.apiService.api.projects.get();
      this._projects.set(response.data?.data.projects ?? []);
    } catch (err) {
      console.log('Error getting projects', err);
    }
  }

  async createProject(project: { id: string; name: string }) {
    try {
      await this.apiService.api.projects.post({
        projectId: project.id,
        projectName: project.name,
      });
    } catch (err) {
      console.error('Error creating project', err);
    }
  }

  async deleteProject(projectId: string) {
    try {
      await this.apiService.api.projects[projectId].delete();
    } catch (err) {
      console.error('Error deleting project', err);
    }
  }
}
