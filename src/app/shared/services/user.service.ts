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
        return this.http.post(environment.baseUrl + "admin-api/admin/users", { role_filter: roles })
    }
    getUser(id): Observable<any> {
        return this.http.get(environment.baseUrl + "admin-api/admin/user/" + id)
    }
    getRoles(): Observable<any> {
        return this.http.get(environment.baseUrl + "admin-api/admin/roles")
    }
}