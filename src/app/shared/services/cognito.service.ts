import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

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

}
