import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ApiTokenService } from '../../services/api-token.service';
import { EnvironmentsService } from '../../services/environments.service';
import { FeaturesService } from '../../services/features.service';
import { ProjectApiTokensComponent } from './components/api-tokens/api-tokens.component';
import { ProjectEnvironmentsComponent } from './components/environments/environments.component';
import { ProjectFeaturesComponent } from './components/features/features.component';
import { ProjectSettingsComponent } from './components/settings/settings.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ProjectApiTokensComponent,
    ProjectEnvironmentsComponent,
    ProjectFeaturesComponent,
    ProjectSettingsComponent,
    MatTabsModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  projectId = '';
  features = this.featuresService.features;
  environments = this.environmentsService.environments;
  apiTokens = this.apiTokenService.apiTokens;

  constructor(
    private featuresService: FeaturesService,
    private environmentsService: EnvironmentsService,
    private apiTokenService: ApiTokenService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId === null) {
      console.error(
        `${this.constructor.name} requires a ":projectId" url parameter`,
      );
    } else {
      this.projectId = projectId;
    }
  }

  getFeatures() {
    this.featuresService.getFeatures(this.projectId);
  }

  getEnvironments() {
    this.environmentsService.getEnvironments(this.projectId);
  }

  getApiTokens() {
    this.apiTokenService.getApiTokens(this.projectId);
  }
}
