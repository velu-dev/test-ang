import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationService } from './services/authentication.service';
import { LoginComponent, RegisterComponent } from "./components/index"
import { SharedModule } from '../shared/shared.module';
import { UserVerificationComponent } from './components/user-verification/user-verification.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordVerifyComponent } from './components/forgot-password-verify/forgot-password-verify.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserVerificationComponent,
    PasswordChangeComponent,
    ForgotPasswordComponent,
    ForgotPasswordVerifyComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule
  ],
  providers: [AuthenticationService,
  ]
})
export class AuthenticationModule { }
