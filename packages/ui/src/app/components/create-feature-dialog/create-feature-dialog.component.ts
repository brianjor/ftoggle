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
import { FeaturesService } from '../../services/features.service';
import { createNoExtraWhitespaceValidator } from '../../validators/noExtraWhitespaceValidator';

export interface CreateFeatureDialogData {
  projectId: number;
}

@Component({
  selector: 'app-create-feature-dialog',
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
  templateUrl: './create-feature-dialog.component.html',
  styleUrl: './create-feature-dialog.component.scss',
})
export class CreateFeatureDialogComponent {
  name = new FormControl('', [
    Validators.required,
    createNoExtraWhitespaceValidator({
      noLeading: true,
      noTrailing: true,
      noBlank: true,
    }),
  ]);
  createFeatureForm = this.formBuilder.group({
    name: this.name,
  });
  inFlight = signal(false);

  constructor(
    private featuresService: FeaturesService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateFeatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateFeatureDialogData,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  createFeature() {
    if (!this.createFeatureForm.valid || this.inFlight()) return;
    const name = this.name.value as string;
    this.inFlight.set(true);
    this.featuresService
      .createFeature(this.data.projectId, { name })
      .then(() => this.closeDialog())
      .catch((err) => console.error('Error creating feature', err))
      .finally(() => this.inFlight.set(false));
  }
}
