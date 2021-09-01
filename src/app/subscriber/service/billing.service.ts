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

  getBilling(id, billId, billing): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getbilling + id + '/' + billId + '/' + billing)
  }

  createBillLine(billId, billableId, claim_id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.createBillLineItem + claim_id + '/' + billableId + '/' + billId, data)
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

  generateCMS1500Form(claimID, billableId, billId, billType): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.CMS1500Form + claimID + '/' + billableId + '/' + billId + '/' + billType)
  }

  billingDownloadAll(claimID, billableId, billId, billType, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.billingDownloadAll + claimID + '/' + billableId + '/' + billId + '/' + billType, data)
  }

  billingPostPayment(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.billingPostPayment + id, data)
  }

  getBillLineItem(claimID, billableId, billingId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillLine + claimID + '/' + billableId + '/' + billingId)
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

  getBillDocument(claimID, billableId, billingId, billType): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillDocument + claimID + '/' + billableId + '/' + billingId + '/' + billType)
  }

  downloadOndemandDocuments(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSignedURL, data)
  }

  postBillingCompleteDoc(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postBillingComplete, data, {
      reportProgress: true,
      observe: 'events'
    })
  }

  postPaymentFileAdd(billID, form): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.postPaymentFileAdd + billID, form)
  }

  eorRemove(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.eorRemove + id)
  }

  getIncompleteInfo(claim_id, bill_id, billingId, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getIncompleteinfo + claim_id + "/" + bill_id + '/' + billingId, data)
  }

  generateBillingForm(claimID, billableId, billingId, formId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.generateBillingForm + claimID + '/' + billableId + '/' + billingId + '/' + formId)
  }

  getBreadcrumbDetails(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getBreadcrumbDetails, data)
  }

  getPaymentResponse(billId, claim, billable): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getPayment + claim + '/' + billable + '/' + billId)
  }

  postPaymentResponse(billId, claim, billable, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postPayment + claim + '/' + billable + '/' + billId, data, {
      reportProgress: true,
      observe: 'events'
    })
  }

  closeBill(billId, claim, billable, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.closeBill + claim + '/' + billable + '/' + billId, data)
  }

  createSecondBill(billId, claim, billable): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postSecondBillCreate + claim + '/' + billable + '/' + billId, {})
  }

  getSendRecDocument(claim, billable, billId, billtype): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.sendRecDocument + claim + '/' + billable + '/' + billId + '/' + billtype)
  }

  postSBRSupport(claim, billable, billId, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.supportDocUpload + claim + '/' + billable + '/' + billId, data)
  }

  removeLineDoc(claim, billable, billId, docId): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.removeSBRLineDoc + claim + '/' + billable + '/' + billId + '/' + docId)
  }

  getLateResponse(claim, billable, billId, type): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getLateRes + claim + '/' + billable + '/' + billId + '/' + type)
  }

  postLateResponse(claim, billable, billId, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postLateRes + claim + '/' + billable + '/' + billId, data)
  }

  getLateResBillStatus(claim, billable, billId, type): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.lateResStatus + claim + '/' + billable + '/' + billId + '/' + type)
  }

  secondBillOnDemand(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.secondBillDemand, data)
  }

  getSubmission(claim, billable): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubmission + claim + '/' + billable)
  }

  createIBR(claim, billable, firstBillId, secondBillId): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postIBRCreate + claim + '/' + billable + '/' + firstBillId + '/' + secondBillId, {})
  }

  uploadCustomDoc(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.uploadCustomDoc, data, {
      reportProgress: true,
      observe: 'events'
    })
  }
  getDtmData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.dtmGetdata + data.claim_id + "/" + data.billable_item_id + "/" + data.bill_id)
  }

  createDateofService(data, billable_item_id): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updatedateOfService + billable_item_id, data)
  }
  getOverlap(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getOverlap, data)
  }
  updateDepositDate(claim_id, billable_item_id, bill_id, payment_response_id, data): Observable<any> {
    const postUrl = environment.baseUrl + api_endpoint.updateDepositDate + claim_id + '/' + billable_item_id + '/' + bill_id + '/' + payment_response_id;
    return this.http.post(postUrl, data);
  }

  updateActionLog(data, is_billable_item_document?): Observable<any> {
    data.is_billable_item_document = is_billable_item_document ? true : false;
    return this.http.post(environment.baseUrl + api_endpoint.activityLogUpdate, data)
  }

  getProcedureCode(claim_id, billable_item_id): Observable<any> {
    const url = environment.baseUrl + api_endpoint.getProcedureCode + claim_id + '/' + billable_item_id;
    return this.http.get(url);
  }
}
