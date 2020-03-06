import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriberUserComponent } from './transcriber-user.component';

describe('TranscriberUserComponent', () => {
  let component: TranscriberUserComponent;
  let fixture: ComponentFixture<TranscriberUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriberUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriberUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
