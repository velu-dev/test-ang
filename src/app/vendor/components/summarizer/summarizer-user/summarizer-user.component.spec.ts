import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizerUserComponent } from './summarizer-user.component';

describe('SummarizerUserComponent', () => {
  let component: SummarizerUserComponent;
  let fixture: ComponentFixture<SummarizerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarizerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarizerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
