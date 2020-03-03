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
    return this.http.post(environment.baseUrl + "admin-api/admin/users", { role_filter: roles })
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/admin/roles")
  }
  getUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/admin/user/" + id)
  }
  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + "admin-api/admin/create", data)
  }
  updateUser(data): Observable<any> {
    return this.http.put(environment.baseUrl + "admin-api/admin/update-user/" + data.id, data)
  }
  getSubscriberRole(): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/subscriber/roles")
  }
  getVendorRole(): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/vendor/roles")
  }
  getSubscribers(): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/admin/subscribers")
  }
  getVendors(): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/admin/vendors")
  }
  uploadUserCsv(data) {
    return this.http.post(environment.baseUrl + api_endpoint.userCsvUpload, data)
  }
}
