import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNewUserComponent } from './manage-new-user.component';

describe('ManageNewUserComponent', () => {
  let component: ManageNewUserComponent;
  let fixture: ComponentFixture<ManageNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
