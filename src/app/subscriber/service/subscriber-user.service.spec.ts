import { TestBed } from '@angular/core/testing';

import { SubscriberUserService } from './subscriber-user.service';

describe('SubscriberUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriberUserService = TestBed.get(SubscriberUserService);
    expect(service).toBeTruthy();
  });
});
