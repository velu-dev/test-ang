import { Injectable } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { Observable, from } from 'rxjs';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor(private cookiesStorge: CookieService) {

  }

  logIn(auth): Observable<any> {
    return from(Auth.signIn(auth.name, auth.password))
  }

  signUp(userData): Observable<any> {
    return from(Auth.signUp(userData));
  }

  signUpVerification(userName, code): Observable<any> {
    return from(Auth.confirmSignUp(userName, code, { forceAliasCreation: true }))
  }

  logOut(): Observable<any> {
    this.cookiesStorge.deleteAll();
    return from(Auth.signOut());
  }

  getCurrentUser(): Observable<any> {
    return from(Auth.currentAuthenticatedUser())
  }

  currentSession() {
    return from(Auth.currentSession());
  }

  session() {
    const currentSession = Auth.currentSession();
    return currentSession;
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
    return from(Auth.verifyCurrentUserAttributeSubmit('email', code))
  }

  resentSignupCode(email): Observable<any> {
    return from(Auth.resendSignUp(email))
  }

  changePassword(user, oldPassword, newPassword): Observable<any> {
    return from(Auth.changePassword(user, oldPassword, newPassword));
  }

  userDetails() {
    return from(Auth.currentUserInfo());
  }

  forgotPassword(email): Observable<any> {
    return from(Auth.forgotPassword(email));
  }

  forgotPasswordSubmit(email, code, password): Observable<any> {
    return from(Auth.forgotPasswordSubmit(email, code, password));
  }

}
