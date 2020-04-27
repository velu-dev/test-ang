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

  postExaminerAddressOther(data, id): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addAddress + '/' + id, data)
  }

  postExaminerAddress(data): Observable<any> {
    return this.http.post(environment.baseUrl + api_endpoint.addAddress, data)
  }

  updateExaminerAddress(data,id) {
    return this.http.put(environment.baseUrl + api_endpoint.updateAddress + id, data)
  }

  deleteExaminerAddress(id) {
    return this.http.delete(environment.baseUrl + api_endpoint.deleteAddress + id)
  }

  getExaminerList() {
    return this.http.get(environment.baseUrl + api_endpoint.getExaminerList)
  }

  getsingleExAddress(exam_id,address_id) {
    return this.http.get(environment.baseUrl + api_endpoint.getSingleExaminer + exam_id +'/'+address_id)
  }
  searchAddress(data) {
    return this.http.post(environment.baseUrl + api_endpoint.searchAddress, data)
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

  getExaminationDetails(){
    return this.http.get(environment.baseUrl + api_endpoint.getExamination)
  }

  getAllExamination(id){
    return this.http.get(environment.baseUrl + api_endpoint.getAllExamination + id)
  }
}
