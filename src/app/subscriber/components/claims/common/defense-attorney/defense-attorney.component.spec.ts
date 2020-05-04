import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseAttorneyComponent } from './defense-attorney.component';

describe('DefenseAttorneyComponent', () => {
  let component: DefenseAttorneyComponent;
  let fixture: ComponentFixture<DefenseAttorneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefenseAttorneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefenseAttorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
