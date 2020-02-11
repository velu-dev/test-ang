import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MaterialModule } from './material.module';
import { CognitoService } from './services/cognito.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings ,RecaptchaFormsModule} from 'ng-recaptcha';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RecaptchaFormsModule,
    RecaptchaModule
  ],
  providers: [
    CognitoService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      } as RecaptchaSettings,
    }
  ]
})
export class SharedModule { }
