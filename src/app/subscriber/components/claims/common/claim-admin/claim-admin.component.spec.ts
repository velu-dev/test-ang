import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAdminComponent } from './claim-admin.component';

describe('ClaimAdminComponent', () => {
  let component: ClaimAdminComponent;
  let fixture: ComponentFixture<ClaimAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
