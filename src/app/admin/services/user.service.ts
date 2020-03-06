import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getUsers(roles): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getAdminUser, { role_filter: roles })
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getAdminRoles)
  }
  getUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getUser + id)
  }
  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createUser, data)
  }
  updateUser(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateUser + data.id, data)
  }
  getSubscriberRole(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscribersRole)
  }
  getVendorRole(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getVendorRole)
  }
  getSubscribers(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscribers)
  }
  getVendors(roles): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getvendors, { role_filter: roles })
  }
  uploadUserCsv(data) {
    return this.http.post(environment.baseUrl + api_endpoint.userCsvUpload, data)
  }
}
