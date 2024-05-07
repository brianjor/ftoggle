import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorInputFieldComponent } from './operator-input-field.component';

describe('OperatorInputFieldComponent', () => {
  let component: OperatorInputFieldComponent;
  let fixture: ComponentFixture<OperatorInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorInputFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
