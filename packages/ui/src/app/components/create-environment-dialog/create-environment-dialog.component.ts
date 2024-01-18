import { Component, Inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EnvironmentsService } from '../../services/environments.service';
import { createNoExtraWhitespaceValidator } from '../../validators/noExtraWhitespaceValidator';

export interface CreateEnvironmentDialogData {
  projectId: number;
}

@Component({
  selector: 'app-create-environment-dialog',
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
  templateUrl: './create-environment-dialog.component.html',
  styleUrl: './create-environment-dialog.component.scss',
})
export class CreateEnvironmentDialogComponent {
  name = new FormControl('', [
    Validators.required,
    createNoExtraWhitespaceValidator({
      noLeading: true,
      noTrailing: true,
      noBlank: true,
    }),
  ]);
  createEnvironmentForm = this.formBuilder.group({
    name: this.name,
  });
  inFlight = signal(false);

  constructor(
    private environmentsService: EnvironmentsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateEnvironmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateEnvironmentDialogData,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  createEnvironment() {
    if (!this.createEnvironmentForm.valid || this.inFlight()) return;
    const name = this.name.value as string;
    this.inFlight.set(true);
    this.environmentsService
      .createEnvironment(this.data.projectId, { name })
      .then(() => this.closeDialog())
      .catch((err) => console.error('Error creating environment', err))
      .finally(() => this.inFlight.set(false));
  }
}
