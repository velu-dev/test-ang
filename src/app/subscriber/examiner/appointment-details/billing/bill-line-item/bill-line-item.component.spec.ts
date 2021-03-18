import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLineItemComponent } from './bill-line-item.component';

describe('BillLineItemComponent', () => {
  let component: BillLineItemComponent;
  let fixture: ComponentFixture<BillLineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillLineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
