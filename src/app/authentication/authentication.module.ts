import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationService } from './services/authentication.service';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
import { LoginComponent, RegisterComponent } from "./components/index"
import { SharedModule } from '../shared/shared.module';
import { UserVerificationComponent } from './components/user-verification/user-verification.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserVerificationComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule
  ],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
