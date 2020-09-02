import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogueComponent } from './alert-dialogue.component';

describe('AlertDialogueComponent', () => {
  let component: AlertDialogueComponent;
  let fixture: ComponentFixture<AlertDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
