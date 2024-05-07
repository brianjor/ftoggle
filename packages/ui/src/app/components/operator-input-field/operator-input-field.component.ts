import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  Operators,
  SingleValueOperatorsValues,
} from '@ftoggle/common/enums/operators';
import { isDateValidator } from '../../validators/isDateValidator';

@Component({
  selector: 'app-operator-input-field',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './operator-input-field.component.html',
  styleUrl: './operator-input-field.component.scss',
})
export class OperatorInputFieldComponent {
  @Input() operator!: Operators;
  @Input() value!: FormControl<string>;
  @Input() values!: FormControl<string[]>;

  singleValueOperators = SingleValueOperatorsValues;

  /** Operators that hold numeric type values */
  private numericOperators = [
    Operators.LESS_THAN,
    Operators.GREATER_THAN,
    Operators.LESS_OR_EQUAL_TO,
    Operators.GREATER_OR_EQUAL_TO,
    Operators.EQUAL_TO,
    Operators.NOT_EQUAL_TO,
  ];

  /** Operators that holds any string type values */
  private stringOperators = [
    Operators.STARTS_WITH,
    Operators.ENDS_WITH,
    Operators.CONTAINS,
    Operators.IN,
    Operators.NOT_IN,
  ];

  /** Operators that hold date type values */
  private dateOperators = [Operators.DATE_AFTER, Operators.DATE_BEFORE];

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes:', changes);
    if ('operator' in changes) {
      console.log(changes.operator);
      this.handleOperatorChanges(changes.operator);
    }
  }

  handleOperatorChanges(change: SimpleChange) {
    // Don't need to make any changes to "values" since it takes in any string values
    if (this.numericOperators.includes(change.currentValue)) {
      this.value.setValidators([
        Validators.required,
        Validators.pattern(/^\d$/),
      ]);
    } else if (this.dateOperators.includes(change.currentValue)) {
      this.value.setValidators([Validators.required, isDateValidator]);
    } else {
      // strings
      this.value.setValidators([Validators.required]);
    }
    this.value.updateValueAndValidity();
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
}
