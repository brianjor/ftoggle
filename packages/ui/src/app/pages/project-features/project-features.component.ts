import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { FeatureWithEnvironments } from '@ftoggle/api/types';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-project-features',
  standalone: true,
  imports: [],
  templateUrl: './project-features.component.html',
  styleUrl: './project-features.component.scss',
})
export class ProjectFeaturesComponent {
  private api = edenTreaty<App>(environment.apiBaseUrl);
  private projectId = '';
  protected features = signal<FeatureWithEnvironments[]>([]);

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
      this.getFeatures();
    }
  }

  getFeatures() {
    this.api.api.projects[this.projectId].features
      .get({
        $headers: {
          Authorization: `Bearer ${this.local.getApiToken()}`,
        },
      })
      .then((res) => this.features.set(res.data?.features ?? []))
      .catch((err) => console.log('Error getting project features', err));
  }
}
