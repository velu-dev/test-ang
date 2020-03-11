import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';

@Injectable({
  providedIn: 'root'
})
export class StaffManagerService {

  constructor(private http: HttpClient) {

  }
  
  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createSubscriberUser, data)
  }

  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberRole)
  }

  getUsers(roles): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSubscriberUsers, { role_filter: roles })
  }
}
