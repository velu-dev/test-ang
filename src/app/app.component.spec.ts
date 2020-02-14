import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layout/common-layout/common-layout.component';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from "ngx-spinner";
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxSpinnerModule
      ],
      declarations: [
        AppComponent,
        FullLayoutComponent,
        CommonLayoutComponent
      ],
      providers: [
        NgxSpinnerService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FullLayoutComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CommonLayoutComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'lucyfrontend'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('lucyfrontend');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('lucyfrontend app is running!');
  // });
});
