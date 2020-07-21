import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BilllableBillingComponent } from './billing.component';

describe('BilllableBillingComponent', () => {
  let component: BilllableBillingComponent;
  let fixture: ComponentFixture<BilllableBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilllableBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BilllableBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
