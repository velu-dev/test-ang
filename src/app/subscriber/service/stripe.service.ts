import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http: HttpClient) { }
  getPK(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getPublicKey);
  }
  createPaymentIntent(intentId): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createPaymentIntent, { payment_method: intentId, organization_id: 2 })
  }
}
