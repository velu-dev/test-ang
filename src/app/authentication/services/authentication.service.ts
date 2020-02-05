import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  logIn(auth): Observable<any> {
    return from(Auth.signIn(auth.username, auth.password))
  }

  signUp(userData): Observable<any> {
    return from(Auth.signUp(userData))
  }
  signUpVerification(userName, code): Observable<any> {
    return from(Auth.confirmSignUp(userName, code, { forceAliasCreation: true }))
  }
}
