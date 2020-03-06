import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorianUserComponent } from './historian-user.component';

describe('HistorianUserComponent', () => {
  let component: HistorianUserComponent;
  let fixture: ComponentFixture<HistorianUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistorianUserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorianUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
