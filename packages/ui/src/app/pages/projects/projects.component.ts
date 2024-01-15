import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { paths } from '../../app.routes';
import { CreateProjectDialogComponent } from '../../components/create-project-dialog/create-project-dialog.component';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CreateProjectDialogComponent,
    RouterLink,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  protected projects = this.projectsService.projects;
  protected paths = paths;

  constructor(
    protected projectsService: ProjectsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectsService.getProjects();
  }

  openCreateProjectDialog() {
    const createProjectDialogRef = this.dialog.open(
      CreateProjectDialogComponent,
    );
    createProjectDialogRef.afterClosed().subscribe(() => this.getProjects());
  }
}
