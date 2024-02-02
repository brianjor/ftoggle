import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { paths } from '../../../../app.routes';
import { ProjectsService } from '../../../../services/projects.service';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class ProjectSettingsComponent {
  @Input({ required: true }) projectId = '';
  deleteProjectInFlight = false;
  constructor(
    private projectsService: ProjectsService,
    private router: Router,
  ) {}
  deleteProject() {
    if (this.deleteProjectInFlight) return;
    this.deleteProjectInFlight = true;
    this.projectsService
      .deleteProject(this.projectId)
      .then(() => this.router.navigate([paths.projects]))
      .finally(() => (this.deleteProjectInFlight = false));
  }
}
