import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAwaitingComponent } from './claim-awaiting.component';

describe('ClaimAwaitingComponent', () => {
  let component: ClaimAwaitingComponent;
  let fixture: ComponentFixture<ClaimAwaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimAwaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAwaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
