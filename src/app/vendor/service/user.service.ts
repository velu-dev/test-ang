import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getUsers(roles): Observable<any> {
    return this.http.post(environment.baseUrl + "vendor/users", { role_filter: roles })
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + "vendor/roles")
  }
  getUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + "vendor/user/" + id)
  }
  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + "vendor/create", data)
  }
  updateUser(data): Observable<any> {
    return this.http.put(environment.baseUrl + "admin/update-user/" + data.id, data)
  }
  updateProfile(data): Observable<any> {
    return this.http.put(environment.baseUrl + "vendor/profile-update/" + data.id, data)
  }
  getProfile(): Observable<any> {
    return this.http.get(environment.baseUrl + "vendor/profile")
  }
}