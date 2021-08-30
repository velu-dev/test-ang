import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { HttpClient } from '@angular/common/http';
import { env } from 'process';
@Injectable({
  providedIn: 'root'
})
export class ExaminerService {

  constructor(private http: HttpClient) { }

  getExaminerAddress(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getAddress, {})
  }

  postExaminerAddressOther(data, id): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addAddress + '/' + id, data)
  }

  postExaminerAddress(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addAddress, data)
  }

  updateExaminerAddress(data, id) {
    return this.http.put(environment.baseUrl + api_endpoint.updateAddress + id, data)
  }

  deleteExaminerAddress(id) {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteAddress + id)
  }

  getCalendarEvent(months?): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getCalendarEvents, { "fetch_event_months": months })
  }
  getExaminerCalendarEvent(examiner_id, months?): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getCalendarEvents + "/" + examiner_id, { "fetch_event_months": months })
  }
  getExaminerList(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getExaminerList)
  }

  getsingleExAddress(exam_id, address_id) {
    return this.http.get(environment.baseUrl + api_endpoint.getSingleExaminer + exam_id + '/' + address_id)
  }
  searchAddress(data, id): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.searchAddress + id, data)
  }

  getAllExaminerAddress() {
    return this.http.get(environment.baseUrl + api_endpoint.allExaminerAddress)
  }

  postExistAddress(data) {
    return this.http.post(environment.baseUrl + api_endpoint.addExistAddress, data)
  }

  PostDeleteExaminerAddress(data) {
    return this.http.post(environment.baseUrl + api_endpoint.deleteAddress, data)
  }

  getExaminationDetails() {
    return this.http.get(environment.baseUrl + api_endpoint.getExamination)
  }
  getAllExamination(id, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getAllExamination + id + '/' + billId)
  }

  postDocument(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.documentType, data, {
      reportProgress: true,
      observe: 'events'
    })
  }
  downloadOndemandDocuments(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSignedURL, data)
  }
  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }
  getDocumentData(id, billId) {
    return this.http.get(environment.baseUrl + api_endpoint.getDocumentData + id + '/' + billId)
  }
  deleteDocument(id, is_billable_item_document?): Observable<any> {
    let isBillableItemDocument = is_billable_item_document ? true : false
    return this.http.delete(environment.baseUrl + api_endpoint.deleteDocument + id + "/" + isBillableItemDocument)
  }

  postNotes(data) {
    return this.http.post(environment.baseUrl + api_endpoint.postNotes, data)
  }
  getForms(claim_id, form_id, group, billId): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.formUrl + group + "/" + form_id + "/" + claim_id + "/" + billId)
  }

  updateExistingLocation(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.updateExistingLocation, data)
  }
  updateExaminationStatus(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateExamType + data.appointment_id, data)
  }
  updateBillableItem(billable_item, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.update_billable_item + billable_item, data)
  }
  getSingleEvent(examiner_id, appointment_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSingleEvent + examiner_id + "/" + appointment_id)
  }
  getExaminerDashboardData(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getAllData)
  }

  getUpcomingAppointment(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.upcomingAppointment)
  }

  getDashboardBilling(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.dashboardBilling)
  }

  getItemsAwaiting(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.itemsAwaiting)
  }

  getNotes(bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getNotes + bill_item_id)
  }

  addNotes(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addNotes, data)
  }


}
