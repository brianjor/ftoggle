import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConditionDialogComponent } from './create-condition-dialog.component';

describe('CreateConditionDialogComponent', () => {
  let component: CreateConditionDialogComponent;
  let fixture: ComponentFixture<CreateConditionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateConditionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateConditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
