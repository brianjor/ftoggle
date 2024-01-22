import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  projectIdReqs,
  projectNameReqs,
} from '@ftoggle/common/validations/projectsValidations';
import { ProjectsService } from '../../services/projects.service';
import { createNoExtraWhitespaceValidator } from '../../validators/noExtraWhitespaceValidator';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
})
export class CreateProjectDialogComponent {
  name = new FormControl('', [
    Validators.required,
    Validators.maxLength(projectNameReqs.maxLength),
    Validators.minLength(projectNameReqs.minLength),
    createNoExtraWhitespaceValidator({ noBlank: true }),
  ]);
  id = new FormControl('', [
    Validators.required,
    Validators.maxLength(projectIdReqs.maxLength),
    Validators.minLength(projectIdReqs.minLength),
    Validators.pattern(projectIdReqs.pattern),
  ]);
  createProjectForm = this.formBuilder.group({
    id: this.id,
    name: this.name,
  });
  inFlight = signal(false);

  constructor(
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  createProject() {
    if (!this.createProjectForm.valid || this.inFlight()) return;
    const id = this.id.value as string;
    const name = this.name.value as string;
    this.inFlight.set(true);
    this.projectService
      .createProject({ id, name })
      .then(() => this.closeDialog())
      .catch((err) => console.error('Error creating project', err))
      .finally(() => this.inFlight.set(false));
  }
}
