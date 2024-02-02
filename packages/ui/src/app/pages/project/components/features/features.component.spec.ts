import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeaturesComponent } from './features.component';

describe('FeaturesComponent', () => {
  let component: ProjectFeaturesComponent;
  let fixture: ComponentFixture<ProjectFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFeaturesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
