import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizerDashboardComponent } from './summarizer-dashboard.component';

describe('SummarizerDashboardComponent', () => {
  let component: SummarizerDashboardComponent;
  let fixture: ComponentFixture<SummarizerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarizerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarizerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
