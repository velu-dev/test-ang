import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorianDashboardComponent } from './historian-dashboard.component';

describe('DashboardComponent', () => {
  let component: HistorianDashboardComponent;
  let fixture: ComponentFixture<HistorianDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorianDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorianDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
