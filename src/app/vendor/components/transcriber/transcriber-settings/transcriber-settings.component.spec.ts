import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriberSettingsComponent } from './transcriber-settings.component';

describe('TranscriberSettingsComponent', () => {
  let component: TranscriberSettingsComponent;
  let fixture: ComponentFixture<TranscriberSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriberSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriberSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
