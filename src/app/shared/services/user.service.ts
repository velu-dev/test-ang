import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import * as  regulations from './regulations'
@Injectable({
    providedIn: 'root'
})
export class UserService {
    // regulations = regulations;
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
    changeRole(): Observable<any> {
        return this.http.get(environment.baseUrl + api_endpoint.changeRole)
    }

    getProfile(): Observable<any> {
        return this.http.get(environment.baseUrl + api_endpoint.subscriberProfile);
    }

    verifyUserRole(): Observable<any> {
        return this.http.get(environment.baseUrl + api_endpoint.verifyUserRole)
    }

    searchClaimant(data): Observable<any> {
        return this.http.post(environment.searchUrl, data)
    }
    getRegulation(codes) {
        console.log(codes, regulations, regulations.Regulations)
        let data = [];
        regulations.Regulations.map(res => {
            if (codes.includes(res.code)) {
                data.push(res)
            }
        });
        return data;
    }

}