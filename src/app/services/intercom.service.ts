import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {
  public IsaaChanged = new Subject<any>();
  public cusname = new Subject<any>();
  public userChanges = new Subject<any>();
  public claimantName = new Subject<any>();
  public claimNumber = new Subject<any>();
  public billableItem = new Subject<any>();
  public billNo = new Subject<any>();
  public examinerPage: any;
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
  public aaChange(): any {
    this.IsaaChanged.next(true)
  }
  public getaaStatus(): Observable<any> {
    return this.IsaaChanged.asObservable();
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

  public setBillableItem(status): any {
    this.billableItem.next(status);
  }

  public getBillableItem(): Observable<any> {
    return this.billableItem.asObservable();
  }

  public setBillNo(status): any {
    this.billNo.next(status);
  }

  public getBillNo(): Observable<any> {
    return this.billNo.asObservable();
  }

  public setExaminerPage(status): any {
    this.examinerPage = status;
  }

  public getExaminerPage() {
    return this.examinerPage;
  }

}
