import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClaimantComponent } from './new-claimant.component';

describe('NewClaimantComponent', () => {
  let component: NewClaimantComponent;
  let fixture: ComponentFixture<NewClaimantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewClaimantComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClaimantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
