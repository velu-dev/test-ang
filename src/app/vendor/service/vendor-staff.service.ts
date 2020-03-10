import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';

@Injectable({
  providedIn: 'root'
})
export class VendorStaffService {

  constructor(private http: HttpClient) { }
  getProfile(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.manager_profile)
  }
  updateProfile(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.manager_profile_update + data.id, data)
  }
}
