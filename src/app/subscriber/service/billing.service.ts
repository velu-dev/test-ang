import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }

  billCreate(cliam, bill): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createbill + cliam + '/' + bill, {})
  }

  postDocument(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.documentType, data)
  }

  getDocumentData(id, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.billDocument + id + '/' + billId)
  }

  onDemandBilling(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.onDemandBilling, data)
  }

  deleteDocument(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteDocument + id)
  }

  getBilling(id, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getbilling + id + '/' + billId)
  }

  createBillLine(billId, billableId, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.createBillLineItem + billId + '/' + billableId, data)
  }

  updateDiagnosisCode(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.updateDiagnosisCode, data)
  }

  removeBillItem(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.removeBillItem + id)
  }

  updatePayor(billId, payor): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updatePayor + billId + '/' + payor, {})
  }

  searchPayor(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.searchPayor, data)
  }

  generateCMS1500Form(claimID,billableId,billId): Observable<any>{
    return this.http.get(environment.baseUrl + api_endpoint.CMS1500Form + claimID + '/' + billableId + '/' + billId)
  }
}
