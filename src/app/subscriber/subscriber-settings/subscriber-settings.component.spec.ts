import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberSettingsComponent } from './subscriber-settings.component';

describe('SubscriberSettingsComponent', () => {
  let component: SubscriberSettingsComponent;
  let fixture: ComponentFixture<SubscriberSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriberSettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
