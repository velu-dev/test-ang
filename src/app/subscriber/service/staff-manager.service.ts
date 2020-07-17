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
    return this.http.post(environment.baseUrl + api_endpoint.createSubscriberManageUser, data)
  }

  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberManageRole)
  }

  getUsers(roles, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSubscriberManageUsers, { role_filter: roles, status: status })
  }

  disableUser(id, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.subscriberManageDisableUser + id, { status: status })
  }

  postUninvite(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postUninvite + data, '')
  }
}
