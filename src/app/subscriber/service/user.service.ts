import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getUsers(roles): Observable<any> {
    return this.http.post(environment.baseUrl + "admin-api/subscriber/users", { role_filter: roles })
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/subscriber/roles")
  }
  getUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + "admin-api/subscriber/user/" + id)
  }
  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + "admin-api/subscriber/create", data)
  }
  updateUser(data): Observable<any> {
    return this.http.put(environment.baseUrl + "admin-api/subscriber/profile-update/" + data.id, data)
  }
  getProfile(): Observable<any>{
    return this.http.get(environment.baseUrl + "admin-api/subscriber/profile");
  }
}