import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
@Injectable({
  providedIn: 'root'
})
export class SubscriberUserService {

  constructor(private http: HttpClient) { }
  getUsers(roles,status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSubscriberUsers, { role_filter: roles, status: status })
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberRole)
  }
  getUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberUser + id)
  }
  
  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createSubscriberUser, data)
  }
  updateUser(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.subscriberProfileUpdate + data.id, data)
  }
  getProfile(): Observable<any>{
    return this.http.get(environment.baseUrl + api_endpoint.subscriberProfile);
  }
  disableUser(id, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.subscriberDisableUser + id, { status: status })
  }

  getPrimarAddress(){
    return this.http.get(environment.baseUrl + api_endpoint.getPrimaryAddress);
  }
  updatePrimaryAddress(data){
    return this.http.put(environment.baseUrl + api_endpoint.updatePrimaryAddress + data.id, data)
  }
}