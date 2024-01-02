import { TestBed } from '@angular/core/testing';

import { TipoSaneoService } from './tipo-saneo.service';

describe('TipoSaneoService', () => {
  let service: TipoSaneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSaneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
