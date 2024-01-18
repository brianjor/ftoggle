import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEnvironmentDialogComponent } from './create-environment-dialog.component';

describe('CreateEnvironmentDialogComponent', () => {
  let component: CreateEnvironmentDialogComponent;
  let fixture: ComponentFixture<CreateEnvironmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEnvironmentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEnvironmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
