import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBillableItemComponent } from './update-billable-item.component';

describe('UpdateBillableItemComponent', () => {
  let component: UpdateBillableItemComponent;
  let fixture: ComponentFixture<UpdateBillableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBillableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBillableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
