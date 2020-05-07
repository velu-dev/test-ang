import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeoComponent } from './deo.component';

describe('DeoComponent', () => {
  let component: DeoComponent;
  let fixture: ComponentFixture<DeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
