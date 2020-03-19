import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { api_endpoint } from '../../../environments/api_endpoint';
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private headers = new HttpHeaders().set(InterceptorSkipHeader, '');
  constructor(private http: HttpClient) { }

  signIn(token) {
    return this.http.post(environment.baseUrl + api_endpoint.signIn, {});
  }

  signUp(signUpDetails): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.signUp, signUpDetails, { headers: this.headers });
  }

  signUpVerify(email): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.signupVerify, { sign_in_email_id: email }, { headers: this.headers });
  }

  setPassword(userData) {
    return this.http.post(environment.baseUrl + api_endpoint.resetPassword, userData, { headers: this.headers });
  }

  emailVerify(email){
    return this.http.post(environment.baseUrl + api_endpoint.emailVerify, {email_id : email}, { headers: this.headers });
  }

  passwordResend(email){
    return this.http.post(environment.baseUrl + api_endpoint.resendPassword, {email_id : email}, { headers: this.headers });
  }
}
