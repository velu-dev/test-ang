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
  listCard(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.listCards)
  }
  createCard(card): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createCard, card)
  }
  updateCard(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.updateCard, data)
  }
  deleteCard(card): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteCard + card.id + "/" + card.customer)
  }
}
