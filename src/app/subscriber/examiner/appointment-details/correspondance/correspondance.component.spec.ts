import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCorrespondanceComponent } from './correspondance.component';

describe('BillingCorrespondanceComponent', () => {
  let component: BillingCorrespondanceComponent;
  let fixture: ComponentFixture<BillingCorrespondanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCorrespondanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCorrespondanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
