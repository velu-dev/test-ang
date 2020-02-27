import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { CommonLayoutComponent } from './layout/common-layout/common-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaFormsModule, RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { NgxSpinnerModule } from "ngx-spinner";
import { _LayoutModule } from './shared/components/_layouts/_layout.module';
import { TokenInterceptorService } from './shared/interceptors/token-interceptor.service';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { DashboardComponent } from './vendor/components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    CommonLayoutComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    // RecaptchaV3Module,
    NgxSpinnerModule,
    _LayoutModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    })
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    // {
    //   provide: RECAPTCHA_V3_SITE_KEY,
    //   useValue: '6LcKp9oUAAAAAPA16aG4vWRMkKCIkTMr8xKLKiu5'
    // },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6Lfz6doUAAAAANgvOxZA8lZmFEK0vm0v1lWkveLq',
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
