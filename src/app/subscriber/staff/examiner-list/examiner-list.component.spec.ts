import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerListComponent } from './examiner-list.component';

describe('ExaminerListComponent', () => {
  let component: ExaminerListComponent;
  let fixture: ComponentFixture<ExaminerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
