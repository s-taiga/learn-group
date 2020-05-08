import { TestBed } from '@angular/core/testing';

import { CalcChangeService } from './calc-change.service';

describe('CalcChangeService', () => {
  let service: CalcChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
