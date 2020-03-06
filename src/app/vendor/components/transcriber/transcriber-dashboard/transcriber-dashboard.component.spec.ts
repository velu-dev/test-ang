import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriberDashboardComponent } from './transcriber-dashboard.component';

describe('TranscriberDashboardComponent', () => {
  let component: TranscriberDashboardComponent;
  let fixture: ComponentFixture<TranscriberDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriberDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriberDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
