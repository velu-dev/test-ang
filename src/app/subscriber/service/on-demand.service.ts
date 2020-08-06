import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class OnDemandService {

  constructor(private http: HttpClient) {

  }

  getRecords(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getRecords + claim_id + '/' + bill_item_id)
  }

  getHistory(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getHistory + claim_id + '/' + bill_item_id)
  }

  getTranscription(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getTranscription + claim_id + '/' + bill_item_id)
  }

  requestCreate(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.requestCreate, data)
  }
  getCorrespondingData(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getcorrespondence_data + claim_id + "/" + bill_item_id)
  }
  downloadCorrespondanceForm(claim_id, bill_item_id, documents_ids): Observable<any> {
    return this.http.post(environment.baseUrl + "billing/ondemand/correspondence-download/" + claim_id + "/" + bill_item_id, documents_ids);
  }
  uploadDocument(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.document_upload, data);
  }
  createCustomRecipient(claim_id, bill_item_id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.create_custom_recipient + claim_id + "/" + bill_item_id, data)
  }

  deleteDocument(id) {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteDocument + id)
  }

  postDocument(data) {
    return this.http.post(environment.baseUrl + api_endpoint.documentType, data)
  }
}
