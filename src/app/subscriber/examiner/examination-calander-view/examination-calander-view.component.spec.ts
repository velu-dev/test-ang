import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationCalanderViewComponent } from './examination-calander-view.component';

describe('ExaminationCalanderViewComponent', () => {
  let component: ExaminationCalanderViewComponent;
  let fixture: ComponentFixture<ExaminationCalanderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminationCalanderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationCalanderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
