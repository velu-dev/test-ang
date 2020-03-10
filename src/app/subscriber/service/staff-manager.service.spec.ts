import { TestBed } from '@angular/core/testing';

import { StaffManagerService } from './staff-manager.service';

describe('StaffManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaffManagerService = TestBed.get(StaffManagerService);
    expect(service).toBeTruthy();
  });
});
