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
import { OperatorInputFieldComponent } from '../operator-input-field/operator-input-field.component';

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
    OperatorInputFieldComponent,
  ],
  templateUrl: './create-condition-dialog.component.html',
  styleUrl: './create-condition-dialog.component.scss',
})
export class CreateConditionDialogComponent {
  contextName = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  operator = new FormControl<Operators>(Operators.LESS_THAN, {
    nonNullable: true,
    validators: [Validators.required],
  });
  values = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });
  value = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  description = new FormControl<string>('', { nonNullable: true });
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
    const contextName = this.contextName.value;
    const operator = this.operator.value;
    const values = this.values.value;
    const value = this.value.value;
    const description = this.description.value;
    this.inFlight.set(true);
    console.log('Creating condition with:', {
      contextName,
      operator,
      values,
      value,
      description,
    });
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
