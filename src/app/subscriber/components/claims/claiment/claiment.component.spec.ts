import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimentComponent } from './claiment.component';

describe('ClaimentComponent', () => {
  let component: ClaimentComponent;
  let fixture: ComponentFixture<ClaimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
