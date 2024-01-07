import { Component } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  protected projects = this.projectsService.projects;
  constructor(protected projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.getProjects();
  }
}
