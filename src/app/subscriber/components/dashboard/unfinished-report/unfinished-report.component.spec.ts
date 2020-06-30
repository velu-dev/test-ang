import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedReportComponent } from './unfinished-report.component';

describe('UnfinishedReportComponent', () => {
  let component: UnfinishedReportComponent;
  let fixture: ComponentFixture<UnfinishedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
