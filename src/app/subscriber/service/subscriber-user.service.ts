import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
@Injectable({
  providedIn: 'root'
})
export class SubscriberUserService {

  constructor(private http: HttpClient) { }
  getUsers(roles, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSubscriberUsers, { role_filter: roles, status: status })
  }
  getRoles(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberRole)
  }
  getUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberUser + id)
  }

  createUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createSubscriberUser, data)
  }
  updateUser(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.subscriberProfileUpdate + data.id, data)
  }
  getProfile(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.subscriberProfile);
  }
  disableUser(id, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.subscriberDisableUser + id, { status: status })
  }

  getPrimarAddress() {
    return this.http.get(environment.baseUrl + api_endpoint.getPrimaryAddress);
  }
  updatePrimaryAddress(data, id) {
    return this.http.post(environment.baseUrl + api_endpoint.updatePrimaryAddress + id, data)
  }

  getEditUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getEditUser + id);
  }

  updateEditUser(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateEditUser + id, data)
  }

  updateSubsciberSetting(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateSubsciberSetting + data.id, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  createExaminerUser(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postExaminerUser, data)
  }

  getExaminerUser(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getExaminerUser + id);
  }

  postUninvite(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.postUninvite + data, '')
  }

  postmailingAddress(id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createMailingAddress + id, data)
  }

  updatemailingAddress(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateMailingAddress + id, data)
  }

  postBillingProvider(id, data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.createBillingProvider + id, data)
  }

  updateBillingProvider(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateBillingProvider + id, data, {
      reportProgress: true,
      observe: 'events'
    })
  }

  updateRenderingProvider(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateRenderingProvider + id, data, {
      reportProgress: true,
      observe: 'events'
    })
  }

  createLicense(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.createLicense + id, data)
  }

  deleteLicense(id): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteLicense + id)
  }

  verifyRole(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.verifyRole)
  }

  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }

  getLocationDetails(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getLocationDetails + id)
  }


  getManageUsers(roles, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.getSubscriberManageUsers, { role_filter: roles, status: status })
  }

  disableManageUser(id, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.subscriberManageDisableUser + id, { status: status })
  }

  diasbleExaminer(id, status): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.examinerDisable + id, { status: status })
  }
  getPaymentHistory(date): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.paymentHistory, { date: date })
  }
  subscriptionCharges(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.subscriptionCharges)
  }
  downloadCSV(date): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.downloadPaymentHistoryCSV, { date: date })
  }
  subscriberaddress(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addSubscriberAddress, data)
  }
  getSubscriberAddress(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getSubscriberAddress)
  }
}