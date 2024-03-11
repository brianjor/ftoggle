import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextFieldsComponent } from './context-fields.component';

describe('ContextFieldsComponent', () => {
  let component: ProjectContextFieldsComponent;
  let fixture: ComponentFixture<ProjectContextFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContextFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectContextFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
