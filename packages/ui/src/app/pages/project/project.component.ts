import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import {
  EnvironmentsTableItem,
  FeatureWithEnvironments,
} from '@ftoggle/api/types';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  private api = edenTreaty<App>(environment.apiBaseUrl);
  private projectId = '';
  features = signal<FeatureWithEnvironments[]>([]);
  environments = signal<EnvironmentsTableItem[]>([]);
  displayedColumns = ['name', 'created'];

  constructor(
    private route: ActivatedRoute,
    private local: LocalStorageService,
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId === null) {
      console.error(
        `${this.constructor.name} requires a ":projectId" url parameter`,
      );
    } else {
      this.projectId = projectId;
      this.getProject();
    }
  }

  getProject() {
    this.api.projects[this.projectId]
      .get({
        $headers: {
          Authorization: `Bearer ${this.local.getApiToken()}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          this.features.set(res.data?.data.project.features ?? []);
          this.environments.set(res.data?.data.project.environments ?? []);
          this.displayedColumns.push(...this.environments().map((e) => e.name));
        }
      });
  }

  findEnvironment(
    feature: FeatureWithEnvironments,
    env: EnvironmentsTableItem,
  ) {
    return feature.environments.find((e) => e.environmentId === env.id);
  }
}
