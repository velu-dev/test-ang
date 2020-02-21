import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserVerificationComponent } from './components/user-verification/user-verification.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';


const routes: Routes = [{
  path: "login",
  component: LoginComponent
},
{
  path: "register",
  component: RegisterComponent
},
{
  path: "verification",
  component: UserVerificationComponent
},
{
  path: "changepassword",
  component: PasswordChangeComponent
},
{
  path: "",
  component: LoginComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
