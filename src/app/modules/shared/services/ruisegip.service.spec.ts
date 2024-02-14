import { TestBed } from '@angular/core/testing';

import { RuisegipService } from './ruisegip.service';

describe('RuisegipService', () => {
  let service: RuisegipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuisegipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
