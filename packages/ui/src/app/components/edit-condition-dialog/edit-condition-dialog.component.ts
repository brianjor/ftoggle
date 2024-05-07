import { Component, Inject } from '@angular/core';
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
import { ConditionsTableItem } from '@ftoggle/api/types/conditionsTypes';
import {
  MultiValueOperatorsValues,
  Operators,
  OperatorsValues,
  SingleValueOperatorsValues,
} from '@ftoggle/common/enums/operators';
import { ConditionsService } from '../../services/conditions.service';
import { OperatorInputFieldComponent } from '../operator-input-field/operator-input-field.component';

export interface EditConditionDialogData {
  condition: ConditionsTableItem;
  projectId: string;
  featureName: string;
  environmentName: string;
}

@Component({
  selector: 'app-edit-condition-dialog',
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
    OperatorInputFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-condition-dialog.component.html',
  styleUrl: './edit-condition-dialog.component.scss',
})
export class EditConditionDialogComponent {
  operator = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  value = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  values = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });
  editConditionForm = this.formBuilder.group({
    operator: this.operator,
    value: this.value,
    values: this.values,
  });
  inFlight = false;
  Operators = Operators;
  operators = OperatorsValues;
  multiValueOperators = MultiValueOperatorsValues;
  singleValueOperators = SingleValueOperatorsValues;

  constructor(
    private conditionService: ConditionsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditConditionDialogData,
  ) {
    this.operator.setValue(this.data.condition.operator);
    this.value.setValue(this.data.condition.value ?? '');
    this.values.setValue(this.data.condition.values);
  }

  addValue(event: MatChipInputEvent) {
    const newValue = event.value;
    if (newValue) {
      this.values.setValue([...this.values.value, newValue]);
    }
    event.chipInput.clear();
  }

  removeValue(value: string) {
    this.values.setValue(this.values.value.filter((v) => v !== value));
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isFormValid() {
    let valid = true;
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
    return valid;
  }

  editCondition() {
    if (!this.isFormValid() || this.inFlight) return;
    const operator = this.operator.value;
    const values = this.values.value;
    const value = this.value.value;
    this.inFlight = true;
    this.conditionService
      .editCondition(
        this.data.condition,
        this.data.projectId,
        this.data.featureName,
        this.data.environmentName,
        {
          operator,
          value,
          values,
        },
      )
      .then(() => this.closeDialog())
      .finally(() => (this.inFlight = false));
  }
}
