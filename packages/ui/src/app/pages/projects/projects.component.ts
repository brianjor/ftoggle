import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { paths } from '../../app.routes';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  protected projects = this.projectsService.projects;
  protected paths = paths;

  constructor(protected projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.getProjects();
  }
}
