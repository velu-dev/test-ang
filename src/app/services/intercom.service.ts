import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {
  public cusname = new Subject<any>();
  constructor() { }
  public setUser(status): any {
    this.cusname.next(status);
  }

  public getUser(): Observable<any> {
    return this.cusname.asObservable();
  }
}
