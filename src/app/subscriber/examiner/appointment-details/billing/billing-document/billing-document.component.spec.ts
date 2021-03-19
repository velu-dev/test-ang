import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingDocumentComponent } from './billing-document.component';

describe('BillingDocumentComponent', () => {
  let component: BillingDocumentComponent;
  let fixture: ComponentFixture<BillingDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
