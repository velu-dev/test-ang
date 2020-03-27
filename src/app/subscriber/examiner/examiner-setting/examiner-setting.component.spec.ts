import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerSettingComponent } from './examiner-setting.component';

describe('ExaminerSettingComponent', () => {
  let component: ExaminerSettingComponent;
  let fixture: ComponentFixture<ExaminerSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminerSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
