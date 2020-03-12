import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClaimentComponent } from './new-claiment.component';

describe('NewClaimentComponent', () => {
  let component: NewClaimentComponent;
  let fixture: ComponentFixture<NewClaimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewClaimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClaimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
