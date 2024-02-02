import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEnvironmentsComponent } from './environments.component';

describe('EnvironmentsComponent', () => {
  let component: ProjectEnvironmentsComponent;
  let fixture: ComponentFixture<ProjectEnvironmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEnvironmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
