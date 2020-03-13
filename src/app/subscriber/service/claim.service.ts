import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private http: HttpClient) { }
  getClaimant(): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getClaimantDetails, {})
  }
  createClaim(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaim, data)
  }
}
