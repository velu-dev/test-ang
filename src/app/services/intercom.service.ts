import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {
  public cusname = new Subject<any>();
  public userChanges = new Subject<any>();
  public claimantName = new Subject<any>();
  public claimNumber = new Subject<any>();
  constructor() { }
  public setUser(status): any {
    this.cusname.next(status);
  }

  public getUser(): Observable<any> {
    return this.cusname.asObservable();
  }

  public setUserChanges(status): any {
    this.userChanges.next(status);
  }

  public getUserChanges(): Observable<any> {
    return this.userChanges.asObservable();
  }

  public setClaimant(status): any {
    this.claimantName.next(status);
  }

  public getClaimant(): Observable<any> {
    return this.claimantName.asObservable();
  }

  public setClaimNumber(status): any {
    this.claimNumber.next(status);
  }

  public getClaimNumber(): Observable<any> {
    return this.claimNumber.asObservable();
  }
}
