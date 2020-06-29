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
    return this.http.post(environment.baseUrl + api_endpoint.createClaimant, data)
  }
  updateClaimant(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateClaimant + data.id, data)
  }
  createBillableItem(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.create_billable_item, data)
  }
  updateBillableItem(data, id): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.update_billable_item + id, data)
  }
  listExaminar(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.examinar_type)
  }
  seedData(data): Observable<any> {
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

  postcorrespondence(data) {
    return this.http.post(environment.baseUrl + api_endpoint.correspondenceUpload, data)
  }

  getSingleClaimant(id) {
    return this.http.get(environment.baseUrl + api_endpoint.getClaimant + id)
  }

  getcorrespondence(id) {
    return this.http.get(environment.baseUrl + api_endpoint.getcorrespondence + id)
  }

  deleteCorrespondence(id) {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteCorrespondence + id)
  }
  updateAgent(id, value): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateAgents + id, value)
  }
  updateInjury(data, claim_id) {
    return this.http.put(environment.baseUrl + api_endpoint.updateInjury + claim_id, data)
  }
  deleteInjury(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteInjury + id)
  }
  getInjury(claim_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getInjury + claim_id)
  }

  getbillableItem(claim_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.billableItemList + claim_id)
  }
  getDeuDetails(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.deuList)
  }
  intakeCallList(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.listIntakeCall)
  }

  getBillableItemSingle(id) {
    return this.http.get(environment.baseUrl + api_endpoint.billableItemSingle + id)
  }
  getICD10(term): Observable<any> {
    console.log(term)
    return this.http.get("https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&authenticity_token=&terms=" + term)

  }
  getBillings(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillings)
  }
  getBilling(claim_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBilling + claim_id)
  }

  getclaimantBillable(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.claimantBillable + id)
  }
}
