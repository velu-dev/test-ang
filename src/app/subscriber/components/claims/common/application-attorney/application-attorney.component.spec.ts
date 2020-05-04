import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAttorneyComponent } from './application-attorney.component';

describe('ApplicationAttorneyComponent', () => {
  let component: ApplicationAttorneyComponent;
  let fixture: ComponentFixture<ApplicationAttorneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAttorneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAttorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
