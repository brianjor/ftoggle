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
import { ContextFieldsService } from '../../services/context-fields.service';
import { createNoExtraWhitespaceValidator } from '../../validators/noExtraWhitespaceValidator';

interface CreateContextFieldDialogData {
  projectId: string;
}

@Component({
  selector: 'app-create-context-field-dialog',
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
    ReactiveFormsModule,
  ],
  templateUrl: './create-context-field-dialog.component.html',
  styleUrl: './create-context-field-dialog.component.scss',
})
export class CreateContextFieldDialogComponent {
  name = new FormControl('', [
    Validators.required,
    createNoExtraWhitespaceValidator({
      noAny: true,
    }),
  ]);
  description = new FormControl('');
  createContextFieldForm = this.formBuilder.group({
    name: this.name,
    description: this.description,
  });
  inFlight = signal(false);

  constructor(
    private contextFieldsService: ContextFieldsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateContextFieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateContextFieldDialogData,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  createContextField() {
    if (!this.createContextFieldForm.valid || this.inFlight()) return;
    const name = (this.name.value as string).trim();
    const description = (this.description.value as string).trim() || undefined;
    this.inFlight.set(true);
    this.contextFieldsService
      .createContextField(this.data.projectId, name, description)
      .then(() => this.closeDialog())
      .catch((err) => console.error('Error creating context field', err))
      .finally(() => this.inFlight.set(false));
  }
}
