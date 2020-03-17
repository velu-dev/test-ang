import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableItemComponent } from './billable-item.component';

describe('BillableItemComponent', () => {
  let component: BillableItemComponent;
  let fixture: ComponentFixture<BillableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
