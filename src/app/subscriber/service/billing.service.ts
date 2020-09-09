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

  getDocumentData(id, billId):  Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.billDocument + id + '/' + billId)
  }
}
