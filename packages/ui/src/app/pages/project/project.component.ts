import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import {
  ApiTokensTableItem,
  EnvironmentsTableItem,
  FeatureWithEnvironments,
  FeaturesTableItem,
} from '@ftoggle/api/types';
import { environment } from '../../../environments/environment';
import { paths } from '../../app.routes';
import { CreateApiTokenDialogComponent } from '../../components/create-api-token-dialog/create-api-token-dialog.component';
import { CreateEnvironmentDialogComponent } from '../../components/create-environment-dialog/create-environment-dialog.component';
import { CreateFeatureDialogComponent } from '../../components/create-feature-dialog/create-feature-dialog.component';
import { FeaturesService } from '../../services/features.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CreateFeatureDialogComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  private api = edenTreaty<App>(environment.apiBaseUrl);
  private projectId = '';
  features = signal<FeatureWithEnvironments[]>([]);
  environments = signal<EnvironmentsTableItem[]>([]);
  apiTokens = signal<ApiTokensTableItem[]>([]);
  apiTokenColumns = ['name', 'created', 'type', 'copy'];
  envColumns = ['name', 'createdAt'];
  BASE_COLUMNS = ['name', 'created'];
  featureColumns = [...this.BASE_COLUMNS];
  toggleFeatureInFlight = false;
  deleteProjectInFlight = false;
  deleteFeatureInFlight = false;

  constructor(
    private clipboard: Clipboard,
    private projectsService: ProjectsService,
    private featuresService: FeaturesService,
    private local: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
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
      this.getApiTokens();
    }
  }

  getProject() {
    this.featureColumns = [...this.BASE_COLUMNS];
    this.api.api.projects[this.projectId]
      .get({
        $headers: {
          Authorization: `Bearer ${this.local.getApiToken()}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          this.features.set(res.data?.project.features ?? []);
          this.environments.set(res.data?.project.environments ?? []);
          this.featureColumns.push(
            ...this.environments().map((e) => e.name),
            'delete',
          );
        }
      });
  }

  getApiTokens() {
    this.projectsService.getApiTokens(this.projectId).then((res) => {
      this.apiTokens.set(res?.tokens ?? []);
    });
  }

  copyApiToken(apiToken: ApiTokensTableItem) {
    const env = this.environments().find(
      (e) => e.id === apiToken.environmentId,
    );
    if (env === undefined) {
      console.error('Unable to find environment for the token');
    } else {
      this.clipboard.copy(`${this.projectId}:${env.name}:${apiToken.id}`);
    }
  }

  findEnvironment(
    feature: FeatureWithEnvironments,
    env: EnvironmentsTableItem,
  ) {
    return feature.environments.find((e) => e.environmentId === env.id);
  }

  openCreateFeatureDialog() {
    const createFeatureDialogRef = this.dialog.open(
      CreateFeatureDialogComponent,
      { data: { projectId: this.projectId } },
    );
    createFeatureDialogRef.afterClosed().subscribe(() => this.getProject());
  }

  openCreateApiTokenDialog() {
    const createApiTokenDialogRef = this.dialog.open(
      CreateApiTokenDialogComponent,
      {
        data: { projectId: this.projectId, environments: this.environments() },
      },
    );
    createApiTokenDialogRef.afterClosed().subscribe(() => this.getApiTokens());
  }

  openCreateEnvironmentDialog() {
    const createEnvironmentDialogRef = this.dialog.open(
      CreateEnvironmentDialogComponent,
      { data: { projectId: this.projectId } },
    );
    createEnvironmentDialogRef.afterClosed().subscribe(() => this.getProject());
  }

  async toggleFeature(
    feature: FeatureWithEnvironments,
    env: EnvironmentsTableItem,
  ) {
    if (this.toggleFeatureInFlight) return;
    this.toggleFeatureInFlight = true;
    this.featuresService
      .toggleFeature(this.projectId, feature.id, env.id)
      .then(() => {
        const updatedEnv = this.findEnvironment(feature, env)!;
        updatedEnv.isEnabled = !updatedEnv?.isEnabled;
      })
      .catch((err) => console.error('Error toggling feature', err))
      .finally(() => (this.toggleFeatureInFlight = false));
  }

  deleteProject() {
    if (this.deleteProjectInFlight) return;
    this.deleteFeatureInFlight = true;
    this.projectsService
      .deleteProject(this.projectId)
      .then(() => this.router.navigate([paths.projects]))
      .finally(() => (this.deleteProjectInFlight = false));
  }

  deleteFeature(feature: FeaturesTableItem) {
    if (this.deleteFeatureInFlight) return;
    this.deleteFeatureInFlight = true;
    this.featuresService
      .deleteFeature(feature.id, this.projectId)
      .then(() => this.getProject())
      .finally(() => (this.deleteFeatureInFlight = false));
  }
}
