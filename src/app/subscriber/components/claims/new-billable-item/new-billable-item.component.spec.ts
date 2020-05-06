import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBillableItemComponent } from './new-billable-item.component';

describe('NewBillableItemComponent', () => {
  let component: NewBillableItemComponent;
  let fixture: ComponentFixture<NewBillableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBillableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBillableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
