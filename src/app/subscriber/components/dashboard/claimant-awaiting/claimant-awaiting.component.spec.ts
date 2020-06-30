import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimantAwaitingComponent } from './claimant-awaiting.component';

describe('ClaimantAwaitingComponent', () => {
  let component: ClaimantAwaitingComponent;
  let fixture: ComponentFixture<ClaimantAwaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimantAwaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimantAwaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
