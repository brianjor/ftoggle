import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContextFieldDialogComponent } from './create-context-field-dialog.component';

describe('CreateContextFieldDialogComponent', () => {
  let component: CreateContextFieldDialogComponent;
  let fixture: ComponentFixture<CreateContextFieldDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContextFieldDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateContextFieldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
