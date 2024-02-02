import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import {
  EnvironmentsTableItem,
  FeatureWithEnvironments,
} from '@ftoggle/api/types';
import { CreateFeatureDialogComponent } from '../../../../components/create-feature-dialog/create-feature-dialog.component';
import { FeaturesService } from '../../../../services/features.service';

@Component({
  selector: 'app-project-features',
  standalone: true,
  imports: [
    CreateFeatureDialogComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
  ],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class ProjectFeaturesComponent {
  @Input({ required: true }) projectId = '';
  @Input({ required: true }) features: FeatureWithEnvironments[] = [];
  @Input({ required: true }) environments: EnvironmentsTableItem[] = [];
  @Output() getFeaturesEvent = new EventEmitter();
  BASE_COLUMNS = ['name', 'created'];
  featureColumns = [...this.BASE_COLUMNS, 'delete'];
  toggleFeatureInFlight = false;
  deleteFeatureInFlight = false;

  constructor(
    private featuresService: FeaturesService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getFeatures();
  }

  ngOnChanges() {
    this.featureColumns = [
      ...this.BASE_COLUMNS,
      ...this.environments.map((e) => e.name),
      'delete',
    ];
  }

  getFeatures() {
    this.getFeaturesEvent.emit();
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
    createFeatureDialogRef.afterClosed().subscribe(() => this.getFeatures());
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
        const updatedEnv = this.findEnvironment(feature, env);
        if (updatedEnv) {
          updatedEnv.isEnabled = !updatedEnv.isEnabled;
        }
      })
      .catch((err) => console.error('Error toggling feature', err))
      .finally(() => (this.toggleFeatureInFlight = false));
  }

  deleteFeature(feature: FeatureWithEnvironments) {
    if (this.deleteFeatureInFlight) return;
    this.deleteFeatureInFlight = true;
    this.featuresService
      .deleteFeature(feature.id, this.projectId)
      .then(() => this.getFeatures())
      .finally(() => (this.deleteFeatureInFlight = false));
  }
}
