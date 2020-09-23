import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private http: HttpClient) { }
  getClaimantAwait(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaimantAwait)
  }

  getClaimAwait(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getClaimAwait)
  }

  getBillableAwait(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getBillableAwait)
  }

  getLocationDetails(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getLocationDetails)
  }

  updateLocation(data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateLocation, data)
  }

  updateExaminerLocation(id, data): Observable<any> {
    return this.http.put(environment.baseUrl + api_endpoint.updateLocation + id, data)
  }

  updateExistingLocation(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.updateExistingLocation, data)
  }

  getSingleLocation(id): Observable<any>{
    return this.http.get(environment.baseUrl + api_endpoint.getSingleLocation + id)
  }

  getSingleLocationExaminer(id, examiner): Observable<any>{
    return this.http.get(environment.baseUrl + api_endpoint.getSingleLocation + id + '/'+ examiner)
  }

  seedData(data): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.seedData + data)
  }

  removeAssignLocation(userId,locationId): Observable<any> {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteAssignLocation + userId + '/' + locationId)
  }
  getExaminer(id): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getExaminerUser + id);
  }

}
