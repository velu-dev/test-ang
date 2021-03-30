import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateResponseComponent } from './late-response.component';

describe('LateResponseComponent', () => {
  let component: LateResponseComponent;
  let fixture: ComponentFixture<LateResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
