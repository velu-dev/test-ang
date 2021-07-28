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
  public BillDocChange = new Subject<any>();
  public BillItemChange = new Subject<any>();
  BillDiagnosisChange = new Subject<any>();
  BillingDetails = new Subject<any>();
  AttorneyAddressChange = new Subject<boolean>();
  billLineItemChange = new Subject<any>();
  paymentReviewCount = new Subject<any>();
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

  public setBillItemChange(status): any {
    this.BillItemChange.next(status);
  }

  public getBillItemChange() {
    return this.BillItemChange.asObservable();;
  }

  public setBillDocChange(status): any {
    this.BillDocChange.next(status);
  }

  public getBillDocChange() {
    return this.BillDocChange.asObservable();;
  }

  public setBillDiagnosisChange(status): any {
    this.BillDiagnosisChange.next(status);
  }

  public getBillDiagnosisChange() {
    return this.BillDiagnosisChange.asObservable();;
  }

  public setBillingDetails(status): any {
    this.BillingDetails.next(status);
  }

  public getBillingDetails() {
    return this.BillingDetails.asObservable();;
  }

  public setAttorneyAddressChanges(bool: boolean) {
    this.AttorneyAddressChange.next(bool)
  }

  public getAttorneyAddressChanges() {
    return this.AttorneyAddressChange.asObservable();
  }
  public getBillLineItem(line_item) {
    this.billLineItemChange.next(line_item);
  }
  public PaymentReview(line_item) {
    this.paymentReviewCount.next(line_item);
  }
  public getPaymentReview() {
    return this.paymentReviewCount.asObservable();;
  }
}
