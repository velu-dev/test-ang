import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { api_endpoint } from 'src/environments/api_endpoint';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ExaminerService {

  constructor(private http: HttpClient) { }

  getExaminerAddress(): Observable<any> {
    return this.http.get(environment.baseUrl + api_endpoint.getAddress, {})
  }

  postExaminerAddress(): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addAddress, {})
  }
}
