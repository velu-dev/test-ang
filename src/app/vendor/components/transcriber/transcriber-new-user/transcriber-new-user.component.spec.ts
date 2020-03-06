import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriberNewUserComponent } from './transcriber-new-user.component';

describe('TranscriberNewUserComponent', () => {
  let component: TranscriberNewUserComponent;
  let fixture: ComponentFixture<TranscriberNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriberNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriberNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
