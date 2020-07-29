import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';

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
}
