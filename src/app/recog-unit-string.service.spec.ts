import { TestBed } from '@angular/core/testing';

import { RecogUnitStringService } from './recog-unit-string.service';

describe('RecogUnitStringService', () => {
  let service: RecogUnitStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecogUnitStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
