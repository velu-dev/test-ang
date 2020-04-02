import { TestBed } from '@angular/core/testing';

import { ExaminerService } from './examiner.service';

describe('ExaminerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExaminerService = TestBed.get(ExaminerService);
    expect(service).toBeTruthy();
  });
});
