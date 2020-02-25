import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Observable, from } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor(private spinnerService: NgxSpinnerService) { 
    // this.spinnerService.show();
  }

  logIn(auth): Observable<any> {
    return from(Auth.signIn(auth.name, auth.password))
  }

  signUp(userData): Observable<any> {
    return from(Auth.signUp(userData))
  }

  signUpVerification(userName, code): Observable<any> {
    return from(Auth.confirmSignUp(userName, code, { forceAliasCreation: true }))
  }

  logOut(): Observable<any> {
    return from(Auth.signOut())
  }

  getCurrentUser(): Observable<any> {
    return from(Auth.currentAuthenticatedUser())
  }

  currentSession() {
    return from(Auth.currentSession());
  }

  currentUserInfo() {
    return from(Auth.currentUserInfo());
  }

  updateUserAttribute(user, data): Observable<any> {
    return from(Auth.updateUserAttributes(user, data))
  }

  userAttributes(user) {
    return from(Auth.userAttributes(user))
  }

  verifyUserAttribute(code) {
    return from(Auth.verifyCurrentUserAttributeSubmit('email',code))
  }

  resentSignupCode(email): Observable<any> {
    return from(Auth.resendSignUp(email))
  }

  changePassword(user, oldPassword, newPassword): Observable<any> {
    return from(Auth.changePassword(user, oldPassword, newPassword));
  }

  completeNewPassword(user,newPassword,data){
    return from(Auth.completeNewPassword(user,newPassword,data));
  }

  userDetails(){
    return from(Auth.currentUserInfo());
  }

}
