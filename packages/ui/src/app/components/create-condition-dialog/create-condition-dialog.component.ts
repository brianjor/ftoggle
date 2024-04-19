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
import { ContextFieldsTableItem } from '@ftoggle/api/types/contextFieldsTypes';
import {
  MultiValueOperatorsValues,
  Operators,
  OperatorsValues,
  SingleValueOperators,
  SingleValueOperatorsValues,
} from '@ftoggle/common/enums/operators';
import { ConditionsService } from '../../services/conditions.service';

export interface CreateConditionDialogData {
  contextFields: ContextFieldsTableItem[];
  projectId: string;
  featureName: string;
  environmentName: string;
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
  contextName = new FormControl<string>('', [Validators.required]);
  operator = new FormControl<Operators>(Operators.LESS_THAN, [
    Validators.required,
  ]);
  values = new FormControl<string[]>([], [Validators.required]);
  value = new FormControl<string>('', [Validators.required]);
  description = new FormControl<string>('');
  createConditionForm = this.formBuilder.group({
    contextField: this.contextName,
    operator: this.operator,
    values: this.values,
    value: this.value,
    description: this.description,
  });
  inFlight = signal(false);
  Operators = Operators;
  operators = OperatorsValues;
  multiValueOperators = MultiValueOperatorsValues;
  singleValueOperators: SingleValueOperators[] = SingleValueOperatorsValues;

  constructor(
    private conditionsService: ConditionsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateConditionDialogData,
  ) {}

  addValue(event: MatChipInputEvent) {
    const newValue = event.value;
    if (newValue) {
      this.values.setValue([...(this.values.value as string[]), newValue]);
    }
    event.chipInput.clear();
  }

  removeValue(value: string) {
    this.values.setValue(
      (this.values.value as string[]).filter((v) => v !== value),
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isFormValid() {
    let valid = true;
    if (!this.contextName.valid) valid = false;
    if (!this.operator.valid) valid = false;
    if (
      !(
        this.values.valid &&
        this.multiValueOperators.includes(this.operator.value ?? '')
      ) &&
      !(
        this.value.valid &&
        this.singleValueOperators.includes(this.operator.value ?? '')
      )
    ) {
      valid = false;
    }
    if (!this.description.valid) valid = false;
    return valid;
  }

  createCondition() {
    if (!this.isFormValid() || this.inFlight()) return;
    const contextName = this.contextName.value as string;
    const operator = this.operator.value as string;
    const values = this.values.value as string[];
    const value = this.value.value as string;
    const description = this.description.value as string;
    this.inFlight.set(true);
    this.conditionsService
      .createConditions(
        this.data.projectId,
        this.data.featureName,
        this.data.environmentName,
        [
          {
            contextName,
            operator,
            values,
            value,
            description,
          },
        ],
      )
      .then(() => this.closeDialog())
      .finally(() => this.inFlight.set(false));
  }
}
