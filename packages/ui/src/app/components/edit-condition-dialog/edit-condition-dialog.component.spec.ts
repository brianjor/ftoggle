import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConditionDialogComponent } from './edit-condition-dialog.component';

describe('EditConditionDialogComponent', () => {
  let component: EditConditionDialogComponent;
  let fixture: ComponentFixture<EditConditionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConditionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditConditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
