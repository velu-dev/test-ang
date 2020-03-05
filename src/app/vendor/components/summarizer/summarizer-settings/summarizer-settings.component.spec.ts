import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizerSettingsComponent } from './summarizer-settings.component';

describe('SummarizerSettingsComponent', () => {
  let component: SummarizerSettingsComponent;
  let fixture: ComponentFixture<SummarizerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarizerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarizerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
