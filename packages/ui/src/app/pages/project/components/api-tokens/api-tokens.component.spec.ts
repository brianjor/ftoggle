import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTokensComponent } from './api-tokens.component';

describe('ApiTokensComponent', () => {
  let component: ApiTokensComponent;
  let fixture: ComponentFixture<ApiTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTokensComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
