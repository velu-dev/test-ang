import { TestBed } from '@angular/core/testing';

import { IntercomService } from './intercom.service';

describe('IntercomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntercomService = TestBed.get(IntercomService);
    expect(service).toBeTruthy();
  });
});
