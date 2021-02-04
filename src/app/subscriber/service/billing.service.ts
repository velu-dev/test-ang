import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { retry } from 'rxjs/operators';

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

  deleteDocument(id, is_billable_item_document?): Observable<any> {
    let isBillableItemDocument = is_billable_item_document ? true : false
    return this.http.delete(environment.baseUrl + api_endpoint.deleteDocument + id + "/" + isBillableItemDocument)
  }

  getBilling(id, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getbilling + id + '/' + billId)
  }

  createBillLine(billId, billableId, claim_id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.createBillLineItem + billId + '/' + billableId + '/' + claim_id, data)
  }

  updateDiagnosisCode(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.updateDiagnosisCode, data)
  }

  removeBillItem(id, claim_id?, billable_id?): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.removeBillItem + id + "/" + claim_id + "/" + billable_id)
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

  billingDownloadAll(claimID, billableId, billId, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.billingDownloadAll + claimID + '/' + billableId + '/' + billId, data)
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

  removeRecipient(id, data?): Observable<any> {
    let last: any;
    if (data) {
      last = id + "/" + data.claim_id + "/" + data.billable_item_id
    } else {
      last = id;
    }
    console.log(data)
    return this.http.delete(environment.baseUrl + api_endpoint.removeCustomRecipient + last + "/" + data.request_type, data)
  }

  getBillDocument(claimID, billableId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillDocument + claimID + '/' + billableId)
  }

  downloadOndemandDocuments(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSignedURL, data)
  }

  postBillingCompleteDoc(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postBillingComplete, data)
  }

  postPaymentFileAdd(billID, form): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.postPaymentFileAdd + billID, form)
  }

  eorRemove(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.eorRemove + id)
  }

  getIncompleteInfo(claim_id, bill_id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getIncompleteinfo + claim_id + "/" + bill_id, data)
  }

  generateBillingForm(claimID, billableId, formId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.generateBillingForm + claimID + '/' + billableId + '/' + formId)
  }

  getBreadcrumbDetails(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getBreadcrumbDetails, data)
  }
}
