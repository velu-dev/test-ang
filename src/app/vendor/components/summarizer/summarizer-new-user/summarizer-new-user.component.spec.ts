import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizerNewUserComponent } from './summarizer-new-user.component';

describe('SummarizerNewUserComponent', () => {
  let component: SummarizerNewUserComponent;
  let fixture: ComponentFixture<SummarizerNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarizerNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarizerNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
