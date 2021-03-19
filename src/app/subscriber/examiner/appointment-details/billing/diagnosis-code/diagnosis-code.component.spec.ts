import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisCodeComponent } from './diagnosis-code.component';

describe('DiagnosisCodeComponent', () => {
  let component: DiagnosisCodeComponent;
  let fixture: ComponentFixture<DiagnosisCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosisCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
