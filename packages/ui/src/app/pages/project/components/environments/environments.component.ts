import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EnvironmentsTableItem } from '@ftoggle/api/types';
import { CreateEnvironmentDialogComponent } from '../../../../components/create-environment-dialog/create-environment-dialog.component';
import { EnvironmentsService } from '../../../../services/environments.service';

@Component({
  selector: 'app-project-environments',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './environments.component.html',
  styleUrl: './environments.component.scss',
})
export class ProjectEnvironmentsComponent {
  @Input({ required: true }) projectId = '';
  @Input({ required: true }) environments: EnvironmentsTableItem[] = [];
  @Output() getEnvironmentsEvent = new EventEmitter();
  envColumns = ['name', 'createdAt', 'delete'];
  deleteEnvironmentInFlight = false;

  constructor(
    private environmentsService: EnvironmentsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getEnvironments();
  }

  getEnvironments() {
    this.getEnvironmentsEvent.emit();
  }

  openCreateEnvironmentDialog() {
    const createEnvironmentDialogRef = this.dialog.open(
      CreateEnvironmentDialogComponent,
      { data: { projectId: this.projectId } },
    );
    createEnvironmentDialogRef
      .afterClosed()
      .subscribe(() => this.getEnvironments());
  }

  deleteEnvironment(environment: EnvironmentsTableItem) {
    if (this.deleteEnvironmentInFlight) return;
    this.deleteEnvironmentInFlight = true;
    this.environmentsService
      .deleteEnvironment(this.projectId, environment.id)
      .then(() => this.getEnvironments())
      .finally(() => (this.deleteEnvironmentInFlight = false));
  }
}
