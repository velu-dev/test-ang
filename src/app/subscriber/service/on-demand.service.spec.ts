import { TestBed } from '@angular/core/testing';

import { OnDemandService } from './on-demand.service';

describe('OnDemandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnDemandService = TestBed.get(OnDemandService);
    expect(service).toBeTruthy();
  });
});
