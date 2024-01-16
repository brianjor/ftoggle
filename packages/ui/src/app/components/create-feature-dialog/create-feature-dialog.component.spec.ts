import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeatureDialogComponent } from './create-feature-dialog.component';

describe('CreateFeatureDialogComponent', () => {
  let component: CreateFeatureDialogComponent;
  let fixture: ComponentFixture<CreateFeatureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFeatureDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
