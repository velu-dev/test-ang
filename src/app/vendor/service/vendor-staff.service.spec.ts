import { TestBed } from '@angular/core/testing';

import { VendorStaffService } from './vendor-staff.service';

describe('VendorStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorStaffService = TestBed.get(VendorStaffService);
    expect(service).toBeTruthy();
  });
});
