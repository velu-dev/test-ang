import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCollectionComponent } from './billing-collection.component';

describe('BillingCollectionComponent', () => {
  let component: BillingCollectionComponent;
  let fixture: ComponentFixture<BillingCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
