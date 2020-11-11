import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAlertComponent } from './billing-alert.component';

describe('BillingAlertComponent', () => {
  let component: BillingAlertComponent;
  let fixture: ComponentFixture<BillingAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BillingAlertComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
