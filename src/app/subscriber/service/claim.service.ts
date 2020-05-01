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
    return this.http.get(environment.baseUrl + api_endpoint.getClaimantDetails, {})
  }
  getClaims(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaims)
  }
  getClaim(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaim + "/" + id)
  }
  searchClaimant(claimant): Observable<any> {
    if (claimant.basic_search != "")
      return this.http.post(environment.baseUrl + api_endpoint.searchClaimant, claimant)
  }
  createClaim(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaim, data)
  }
  updateClaim(data, id): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateClaim + id, data)
  }
  createClaimant(data): Observable<any> {
    console.log("service console", data);
    return this.http.post(environment.baseUrl + api_endpoint.createClaimant, data)
  }
  updateClaimant(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateClaimant + data.id, data)
  }
  createBillableItem(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.create_billable_item, data)
  }
  updateBillableItem(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.update_billable_item, data)
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
  getExaminarAddress(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.get_examinar_address + id)
  }
  searchbyEams(eams_number): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.searchEams + eams_number)
  }

  getBillableItemList() {
    return this.http.get(environment.baseUrl + api_endpoint.getBillItem)
  }

  postcorrespondence(data){
    return this.http.post(environment.baseUrl + api_endpoint.correspondenceUpload, data)
  }

  getSingleClaimant(id){
    return this.http.get(environment.baseUrl + api_endpoint.getClaimant + id)
  }

  getcorrespondence(id){
    return this.http.get(environment.baseUrl + api_endpoint.getcorrespondence + id)
  }

  deleteCorrespondence(id){
    return this.http.delete(environment.baseUrl + api_endpoint.deleteCorrespondence + id)
  }
}
