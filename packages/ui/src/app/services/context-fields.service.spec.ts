import { TestBed } from '@angular/core/testing';

import { ContextFieldsService } from './context-fields.service';

describe('ContextFieldsService', () => {
  let service: ContextFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
