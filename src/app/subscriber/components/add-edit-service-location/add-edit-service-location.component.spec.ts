import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServiceLocationComponent } from './add-edit-service-location.component';

describe('AddEditServiceLocationComponent', () => {
  let component: AddEditServiceLocationComponent;
  let fixture: ComponentFixture<AddEditServiceLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditServiceLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditServiceLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
