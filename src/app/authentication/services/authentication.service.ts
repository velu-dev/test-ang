import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  signUp(signUpDetails): Observable<any> {
    return this.http.post(environment.baseUrl + environment.signUp,signUpDetails);
  }
}
