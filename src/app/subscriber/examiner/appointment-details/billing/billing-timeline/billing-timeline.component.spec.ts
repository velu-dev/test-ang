import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTimelineComponent } from './billing-timeline.component';

describe('BillingTimelineComponent', () => {
  let component: BillingTimelineComponent;
  let fixture: ComponentFixture<BillingTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BillingTimelineComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
