import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import {
  EnvironmentsTableItem,
  FeatureWithEnvironments,
} from '@ftoggle/api/types';
import { environment } from '../../../environments/environment';
import { CreateFeatureDialogComponent } from '../../components/create-feature-dialog/create-feature-dialog.component';
import { FeaturesService } from '../../services/features.service';
import { LocalStorageService } from '../../services/local-storage.service';

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
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  private api = edenTreaty<App>(environment.apiBaseUrl);
  private projectId = '';
  features = signal<FeatureWithEnvironments[]>([]);
  environments = signal<EnvironmentsTableItem[]>([]);
  BASE_COLUMNS = ['name', 'created'];
  displayedColumns = [...this.BASE_COLUMNS];
  toggleFeatureInFlight = false;

  constructor(
    private featuresService: FeaturesService,
    private local: LocalStorageService,
    private route: ActivatedRoute,
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
    }
  }

  getProject() {
    this.displayedColumns = [...this.BASE_COLUMNS];
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

  openCreateFeatureDialog() {
    const createFeatureDialogRef = this.dialog.open(
      CreateFeatureDialogComponent,
      { data: { projectId: this.projectId } },
    );
    createFeatureDialogRef.afterClosed().subscribe(() => this.getProject());
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
}
