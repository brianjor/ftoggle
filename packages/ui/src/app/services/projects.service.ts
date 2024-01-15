import { Injectable, signal } from '@angular/core';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  api = edenTreaty<App>(environment.apiBaseUrl);
  private _projects = signal<{ id: number; name: string }[]>([]);
  public projects = this._projects.asReadonly();

  constructor(private local: LocalStorageService) {}

  getProjects() {
    this.api.projects
      .get({
        $headers: {
          Authorization: `Bearer ${this.local.getApiToken()}`,
        },
      })
      .then((res) => this._projects.set(res.data?.data.projects ?? []))
      .catch((err) => console.log('Error getting projects', err));
  }
}
