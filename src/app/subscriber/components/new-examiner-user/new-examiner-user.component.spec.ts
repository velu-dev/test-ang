import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExaminerUserComponent } from './new-examiner-user.component';

describe('NewExaminerUserComponent', () => {
  let component: NewExaminerUserComponent;
  let fixture: ComponentFixture<NewExaminerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExaminerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExaminerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
