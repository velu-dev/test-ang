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
    console.log(claimant)
    return this.http.post(environment.baseUrl + api_endpoint.searchClaimant, claimant)
  }
  createClaim(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaim, data)
  }
  createClaimant(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaimant, data)
  }
  createBillableItem(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.create_billable_item, data)
  }
  listExaminar(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.examinar_type)
  }
  seedData(data): Observable<any> {
    console.log(data)
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }
  // getCallerAffliation(): Observable<any> {
  //   return this.http.get(environment.baseUrl + api_endpoint.callerAffliation)
  // }
  getExaminar(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.get_examinar_address, data)
  }
  searchbyEams(eams_number): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.searchEams + eams_number)
  }
}
