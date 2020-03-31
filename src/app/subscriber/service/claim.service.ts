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
  getClaims(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaims)
  }
  getClaim(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaim + "/" + id)
  }
  searchClaimant(claimant): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.searchClaimant, claimant)
  }
  createClaim(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaim, data)
  }
  createClaimant(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaimant, data)
  }

  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }
  getCallerAffliation(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.callerAffliation)
  }
}
