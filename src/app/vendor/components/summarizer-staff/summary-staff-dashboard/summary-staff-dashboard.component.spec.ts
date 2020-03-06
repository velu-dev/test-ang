import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryStaffDashboardComponent } from './summary-staff-dashboard.component';

describe('SummaryStaffDashboardComponent', () => {
  let component: SummaryStaffDashboardComponent;
  let fixture: ComponentFixture<SummaryStaffDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryStaffDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryStaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
