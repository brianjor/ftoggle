import { Component, Inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ConditionsService } from '../../services/conditions.service';
import { createNoExtraWhitespaceValidator } from '../../validators/noExtraWhitespaceValidator';

export interface CreateConditionDialogData {
  projectId: string;
  featureName: string;
  environmentId: number;
}

@Component({
  selector: 'app-create-condition-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-condition-dialog.component.html',
  styleUrl: './create-condition-dialog.component.scss',
})
export class CreateConditionDialogComponent {
  contextName = new FormControl<string>('', [
    Validators.required,
    createNoExtraWhitespaceValidator({
      noAny: true,
    }),
  ]);
  operator = new FormControl<string>('', [Validators.required]);
  values = new FormControl<string[]>([], [Validators.required]);
  description = new FormControl<string>('');
  createConditionForm = this.formBuilder.group({
    contextField: this.contextName,
    operator: this.operator,
    values: this.values,
    description: this.description,
  });
  inFlight = signal(false);
  operators = [
    'LESS_THAN',
    'GREATER_THAN',
    'LESS_OR_EQUAL_TO',
    'GREATER_OR_EQUAL_TO',
    'EQUAL_TO',
    'NOT_EQUAL_TO',
    'STARTS_WITH',
    'ENDS_WITH',
    'CONTAINS',
    'IN',
    'NOT_IN',
    'DATE_BEFORE',
    'DATE_AFTER',
  ];

  constructor(
    private conditionsService: ConditionsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateConditionDialogData,
  ) {}

  addValue(event: MatChipInputEvent) {
    const newValue = event.value;
    console.log(`adding value ${newValue} to values ${this.values.value}`);
    if (newValue) {
      this.values.setValue([...(this.values.value as string[]), newValue]);
    }
    event.chipInput!.clear();
  }

  removeValue(value: string) {
    this.values.setValue(
      (this.values.value as string[]).filter((v) => v !== value),
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createCondition() {
    if (!this.createConditionForm.valid || this.inFlight()) return;
    const contextName = this.contextName.value as string;
    const operator = this.operator.value as string;
    const values = this.values.value as string[];
    const description = this.description.value as string;
    this.inFlight.set(true);
    this.conditionsService
      .createConditions(
        this.data.projectId,
        this.data.featureName,
        this.data.environmentId,
        [
          {
            contextName,
            operator,
            values,
            description,
          },
        ],
      )
      .then(() => this.closeDialog())
      .finally(() => this.inFlight.set(false));
  }
}
