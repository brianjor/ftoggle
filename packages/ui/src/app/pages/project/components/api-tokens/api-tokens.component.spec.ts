import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectApiTokensComponent } from './api-tokens.component';

describe('ApiTokensComponent', () => {
  let component: ProjectApiTokensComponent;
  let fixture: ComponentFixture<ProjectApiTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectApiTokensComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectApiTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
