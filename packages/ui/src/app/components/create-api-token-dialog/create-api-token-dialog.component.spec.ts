import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApiTokenDialogComponent } from './create-api-token-dialog.component';

describe('CreateApiTokenDialogComponent', () => {
  let component: CreateApiTokenDialogComponent;
  let fixture: ComponentFixture<CreateApiTokenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApiTokenDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateApiTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
