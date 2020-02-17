import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AlertComponent } from './components/alert/alert.component';
import { MaterialModule } from './material.module';
import { CognitoService } from './services/cognito.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';

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
    SharedRoutingModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    NotFoundComponent,
    AlertComponent
  ],
  providers: [
    CognitoService, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      } as RecaptchaSettings,
    }
  ]
})
export class SharedModule { }
