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

  generateCMS1500Form(claimID, billableId, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.CMS1500Form + claimID + '/' + billableId + '/' + billId)
  }

  billingDownloadAll(claimID, billableId, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.billingDownloadAll + claimID + '/' + billableId + '/' + billId)
  }

  billingPostPayment(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.billingPostPayment + id, data)
  }

  getBillLineItem(claimID, billableId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillLine + claimID + '/' + billableId)
  }

  getPostPayment(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getPostPayment + id)
  }

  postBillRecipient(claimID, billableId, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postBillRecipient + claimID + '/' + billableId, data)
  }

  getBillRecipient(claimID, billableId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillRecipient + claimID + '/' + billableId)
  }

  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }

  removeRecipient(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.removeCustomRecipient + id)
  }

  getBillDocument(claimID, billableId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillDocument + claimID + '/' + billableId)
  }
}
