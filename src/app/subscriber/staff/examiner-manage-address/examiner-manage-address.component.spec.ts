import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerManageAddressComponent } from './examiner-manage-address.component';

describe('ExaminerManageAddressComponent', () => {
  let component: ExaminerManageAddressComponent;
  let fixture: ComponentFixture<ExaminerManageAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminerManageAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminerManageAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
