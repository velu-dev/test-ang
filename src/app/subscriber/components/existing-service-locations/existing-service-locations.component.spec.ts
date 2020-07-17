import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingServiceLocationsComponent } from './existing-service-locations.component';

describe('ExistingServiceLocationsComponent', () => {
  let component: ExistingServiceLocationsComponent;
  let fixture: ComponentFixture<ExistingServiceLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingServiceLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingServiceLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
