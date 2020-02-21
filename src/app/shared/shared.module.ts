import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AlertComponent } from './components/alert/alert.component';
import { MaterialModule } from './material.module';
import { CognitoService } from './services/cognito.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertService } from './services/alert.service';
import { StoreModule } from '@ngrx/store';
import { breadcrumbreducer } from './store/breadcrumb.reducer';
import { ExportService } from './services/export.service';

@NgModule({
  declarations: [
    NotFoundComponent,
    AlertComponent
  ],
  entryComponents: [
    AlertComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedRoutingModule,
    StoreModule.forFeature("breadcrumb", breadcrumbreducer)
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RecaptchaModule,
    RecaptchaV3Module,
    RecaptchaFormsModule,
    NotFoundComponent,
    AlertComponent
  ],
  providers: [
    CognitoService,
    AlertService,
    ExportService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }, {
      provide: MatSnackBarRef,
      useValue: {}
    }, {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {} // Add any data you wish to test if it is passed/used correctly
    },
    // { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcKp9oUAAAAAPA16aG4vWRMkKCIkTMr8xKLKiu5' },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6Lfz6doUAAAAANgvOxZA8lZmFEK0vm0v1lWkveLq',
      } as RecaptchaSettings,
    }
  ]
})
export class SharedModule { }
