import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, ObservedValueOf, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { env } from 'process';
import { IntercomService } from 'src/app/services/intercom.service';

@Injectable({
  providedIn: 'root'
})
export class OnDemandService {

  constructor(private http: HttpClient, private intercom: IntercomService) {

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
  getZipFile(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getZipFile, data)
  }
  getTrackingTable(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getTracking + claim_id + "/" + bill_item_id)
  }
  getCorresIncomplete(claim_id, bill_item_id, recipients_ids): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getCorresIncomplete + claim_id + "/" + bill_item_id, { "isPopupValidate": true, recipients_ids: recipients_ids })
  }
  getTracingPopUp(tracking_id, claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.tracingPopup + tracking_id + "/" + claim_id + "/" + bill_item_id)
  }
  uploadDocument(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.document_upload, data, {
      reportProgress: true,
      observe: 'events'
    });
  }
  createCustomRecipient(claim_id, bill_item_id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.create_custom_recipient + claim_id + "/" + bill_item_id, data)
  }

  deleteDocument(id, is_billable_item_document?): Observable<any> {
    let isBillableItemDocument = is_billable_item_document ? true : false
    return this.http.delete(environment.baseUrl + api_endpoint.deleteDocument + id + "/" + isBillableItemDocument)
  }

  postDocument(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.documentType, data, {
      reportProgress: true,
      observe: 'events'
    })
  }
  progress: any;
  getProgress(event) {
    console.log(event)
    switch (event.type) {
      case HttpEventType.Sent:
        console.log(event)
        this.progress = null;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.progress = Math.round(event.loaded / event.total * 100);
        this.intercom.setLoaderPercentage(this.progress);
        break;
      case HttpEventType.Response:
        // setTimeout(() => {
        this.progress = 0;
        this.intercom.setLoaderPercentage(this.progress)
        break
      // }, 1500);
    }
    return this.progress
  }

  documentUnit(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.documentUnit, data)
  }
  removeDocument(id, document_category_id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.removeCustomDocument + id + "/" + document_category_id)
  }
  removeRecipient(id, data?): Observable<any> {
    let last: any;
    if (data) {
      last = id + "/" + data.claim_id + "/" + data.billable_item_id
    } else {
      last = id;
    }
    return this.http.delete(environment.baseUrl + api_endpoint.removeCustomRecipient + last + "/" + data.request_type, data)
  }
  getBilling(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.bilingList + claim_id + "/" + bill_item_id)
  }
  downloadBillingDoc(claim_id, bill_item_id, doc_ids): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.downloadBillingDocument + claim_id + "/" + bill_item_id, doc_ids)
  }
  uploadExaminationDocument(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.uploadExaminationFile, data, {
      reportProgress: true,
      observe: 'events'
    })
  }
  listUploadedDocs(claim_id, bill_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.listExaminationUploadedDocs + claim_id + "/" + bill_item_id)
  }

  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }

  recordDownload(claim_id, bill_item_id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.recordDownload + claim_id + "/" + bill_item_id, data)
  }
  reportDownload(claim_id, bill_item_id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.reportDownload + claim_id + "/" + bill_item_id, data)
  }

  onDemandCorrespondence(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.onDemandCorrespondence, data)
  }

  OnDemandhistory(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.onDemandHistory, data)
  }

  getBreadcrumbDetails(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getBreadcrumbDetails, data)
  }

  getHistoryCallTracking(claim_id, billable_item_id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.historyCallTracking + claim_id + "/" + billable_item_id);
  }
}
