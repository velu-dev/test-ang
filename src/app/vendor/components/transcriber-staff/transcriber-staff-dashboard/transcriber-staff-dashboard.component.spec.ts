import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriberStaffDashboardComponent } from './transcriber-staff-dashboard.component';

describe('TranscriberStaffDashboardComponent', () => {
  let component: TranscriberStaffDashboardComponent;
  let fixture: ComponentFixture<TranscriberStaffDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriberStaffDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriberStaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
