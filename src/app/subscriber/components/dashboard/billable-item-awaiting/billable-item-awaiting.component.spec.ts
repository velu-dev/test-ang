import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableItemAwaitingComponent } from './billable-item-awaiting.component';

describe('BillableItemAwaitingComponent', () => {
  let component: BillableItemAwaitingComponent;
  let fixture: ComponentFixture<BillableItemAwaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillableItemAwaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableItemAwaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
