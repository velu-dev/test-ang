import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorianSettingsComponent } from './historian-settings.component';

describe('HistorianSettingsComponent', () => {
  let component: HistorianSettingsComponent;
  let fixture: ComponentFixture<HistorianSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorianSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorianSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
