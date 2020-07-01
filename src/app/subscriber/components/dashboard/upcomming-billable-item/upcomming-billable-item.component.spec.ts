import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcommingBillableItemComponent } from './upcomming-billable-item.component';

describe('UpcommingBillableItemComponent', () => {
  let component: UpcommingBillableItemComponent;
  let fixture: ComponentFixture<UpcommingBillableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcommingBillableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcommingBillableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
