import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryStaffDashboardComponent } from './history-staff-dashboard.component';

describe('HistoryStaffDashboardComponent', () => {
  let component: HistoryStaffDashboardComponent;
  let fixture: ComponentFixture<HistoryStaffDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryStaffDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryStaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
