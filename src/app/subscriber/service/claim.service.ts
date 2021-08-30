import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InterceptorSkipHeader } from 'src/app/authentication/services/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private headers = new HttpHeaders().set(InterceptorSkipHeader, '');
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
  searchEAMSAttorney(attorney): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.searchAttorney, attorney)
  }
  searchEAMSAdmin(admin): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.searchEamsAdmin, admin)
  }
  createClaim(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createClaim, data)
  }
  updateClaim(data, id): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateClaim + id, data)
  }
  updateClaimAll(data, id): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateClaimAll + id, data)
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
  listExaminar(id?): Observable<any> {
    if (id) {
      return this.http.get(environment.baseUrl + api_endpoint.examinar_type + '/' + id)
    }
    return this.http.get(environment.baseUrl + api_endpoint.examinar_type)
  }
  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }
  seedDocumentData(data, claim_id?, billable_item_id?): Observable<any> {
    let dd = claim_id ? (data + "/" + claim_id + "/" + billable_item_id) : data
    return this.http.get(environment.baseUrl + "examinations/" + dd)
  }
  // getCallerAffliation(): Observable<any> {
  //   return this.http.get(environment.baseUrl + api_endpoint.callerAffliation)
  // }
  getExaminarAddress(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.get_examinar_address + id)
  }
  searchbyEams(eams_number, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.searchEams, data)
  }

  getBillableItemList() {
    return this.http.get(environment.baseUrl + api_endpoint.getBillItem)
  }
  getDocumentsDeclared(claim_id, billable_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + "examinations/documents-declared-details/" + claim_id + "/" + billable_item_id)
  }
  createDeclaredDocument(data, claim_id, billable_item_id): Observable<any> {
    return this.http.post(environment.baseUrl + "examinations/documents-declared-add/" + claim_id + "/" + billable_item_id, data, {
      reportProgress: true,
      observe: 'events'
    })
  }
  removeDeclaredDocument(documents_declared_id, data): Observable<any> {
    return this.http.delete(environment.baseUrl + "examinations/documents-declared-remove/" + data.claim_id + "/" + data.billable_item_id + "/" + documents_declared_id,)
  }
  postcorrespondence(data) {
    return this.http.post(environment.baseUrl + api_endpoint.correspondenceUpload, data)
  }

  getSingleClaimant(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaimant + id)
  }

  getcorrespondence(id) {
    return this.http.get(environment.baseUrl + api_endpoint.getcorrespondence + id)
  }

  deleteCorrespondence(id, type?) {
    let type1 = type ? "/" + type : "";
    return this.http.delete(environment.baseUrl + api_endpoint.deleteCorrespondence + id + type1)
  }
  updateAgent(id, value): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateAgents + id, value)
  }
  updateInjury(data, claim_id) {
    return this.http.put(environment.baseUrl + api_endpoint.updateInjury + claim_id, data)
  }
  addInjury(data, claim_id): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addinjury + claim_id, data);
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

  getBillableItemSingle(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.billableItemSingle + id)
  }
  getICD10(term): Observable<any> {
    return this.http.get("https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&authenticity_token=&terms=" + term, { headers: this.headers })

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
  getProcedureType(examtype): Observable<any> {
    return this.http.get(environment.baseUrl + "claim/procedures-modifiers-seed-data/" + examtype)
  }

  billCreate(cliam, bill): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createbill + cliam + '/' + bill, {})
  }
  getActivityLog(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.activityLog + claim_id + "/" + bill_item_id)
  }
  updateActionLog(data, is_billable_item_document?): Observable<any> {
    data.is_billable_item_document = is_billable_item_document ? true : false;
    return this.http.post(environment.baseUrl + api_endpoint.activityLogUpdate, data)
  }

  searchClaim(data): Observable<any> {
    return this.http.post(environment.searchUrl + api_endpoint.claimNumberSearch, data)
  }

  getProcedureTypeAttoney(claim_id, billableId?): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getProcedureTypeAttoney + claim_id + '/' + (billableId ? billableId : null));
  }


  searchAddress(input): Observable<any> {
    // this.headers.append("access-control-allow-origin", '*');
    // this.headers.append("referer", 'https://dev01app.simplexam.com');
    // this.headers = new HttpHeaders().set("Access-Control-Allow-Origin", "http://localhost:4200/");
    return this.http.get('https://us-autocomplete-pro.api.smartystreets.com/lookup?key=' + environment.smartyStreetsAPIKey + '&search=' + input, { headers: this.headers })
  }
  removeFormat(phone) {
    var tel = phone;
    tel = tel.replace(/\D+/g, "");
    phone = tel;
    return phone;
  }

  removeDocumentDeclared(documents_declared_id, document_id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.removeDocumentDeclared + documents_declared_id + '/' + document_id)
  }
  getFormDisabled(claim_id, billable_item_id, examination_status_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getFormDisabled + claim_id + "/" + billable_item_id + "/" + examination_status_id)
  }
}