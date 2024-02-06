import { CommonModule } from '@angular/common';
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
import { MatSelectModule } from '@angular/material/select';
import { EnvironmentsTableItem } from '@ftoggle/api/types/environmentTypes';
import { ApiTokenType } from '@ftoggle/common/enums/apiTokens';
import { ApiTokenService } from '../../services/api-token.service';
import { createNoExtraWhitespaceValidator } from '../../validators/noExtraWhitespaceValidator';

export interface CreateApiTokenDialogData {
  projectId: string;
  environments: EnvironmentsTableItem[];
}

@Component({
  selector: 'app-create-api-token-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-api-token-dialog.component.html',
  styleUrl: './create-api-token-dialog.component.scss',
})
export class CreateApiTokenDialogComponent {
  environment = new FormControl('', [Validators.required]);
  type = new FormControl('', [Validators.required]);
  name = new FormControl('', [
    Validators.required,
    createNoExtraWhitespaceValidator({
      noBlank: true,
    }),
  ]);
  createApiTokenForm = this.formBuilder.group({
    environment: this.environment,
    type: this.type,
    name: this.name,
  });
  inFlight = signal(false);
  apiTypes = ['CLIENT', 'FRONTEND'];

  constructor(
    private apiTokenService: ApiTokenService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateApiTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateApiTokenDialogData,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  createApiToken() {
    if (!this.createApiTokenForm.valid || this.inFlight()) return;
    const name = this.name.value as string;
    const environmentId = Number(this.environment.value as string);
    const type = this.type.value as ApiTokenType;
    this.inFlight.set(true);
    this.apiTokenService
      .createApiToken({
        name,
        environmentId,
        type,
        projectId: this.data.projectId,
      })
      .then(() => this.closeDialog())
      .catch((err) => console.error('Error creating API token', err))
      .finally(() => this.inFlight.set(false));
  }
}
