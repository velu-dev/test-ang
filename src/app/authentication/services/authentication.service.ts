import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private headers = new HttpHeaders().set(InterceptorSkipHeader, '');
  constructor(private http: HttpClient) { }

  signIn(token) {
    return this.http.post(environment.baseUrl + environment.signIn, {});
  }

  signUp(signUpDetails): Observable<any> {
    return this.http.post(environment.baseUrl + environment.signUp, signUpDetails, { headers: this.headers });
  }

  signUpVerify(email): Observable<any> {
    return this.http.post(environment.baseUrl + environment.signupVerify, { sign_in_email_id: email }, { headers: this.headers });
  }
}
