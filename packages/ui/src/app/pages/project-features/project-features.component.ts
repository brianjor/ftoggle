import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { type GetFeaturesItem } from '@ftoggle/api/types';
import { environment } from '../../../environments/environment';

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
  protected features = signal<GetFeaturesItem[]>([]);

  constructor(private route: ActivatedRoute) {}

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
    this.api.projects[this.projectId].features
      .get({
        $headers: {
          Authorization: `Bearer ${localStorage.getItem('apiToken')}`,
        },
      })
      .then((res) => this.features.set(res.data?.data.features ?? []))
      .catch((err) => console.log('Error getting project features', err));
  }
}
