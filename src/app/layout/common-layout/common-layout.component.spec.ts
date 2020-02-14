import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLayoutComponent } from './common-layout.component';
import {RouterTestingModule} from '@angular/router/testing'

describe('CommonLayoutComponent', () => {
  let component: CommonLayoutComponent;
  let fixture: ComponentFixture<CommonLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ CommonLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
