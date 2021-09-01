import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialog, MatDialogRef, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, NativeDateAdapter } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { IntercomService } from 'src/app/services/intercom.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { HttpEvent } from '@angular/common/http';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM-dd-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export const PICK_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})

export class PaymentResponseComponent implements OnInit, OnDestroy {

  userTable: FormGroup;
  mode: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  paymentForm: FormGroup;
  @Input() billingData: any;
  @Input() paramsId: any;
  @Output() getPaymentStatus = new EventEmitter<any>();
  paymentTypes: any = ["Paper Check", "EFT", "Virtual Credit Card"];
  currentDate = new Date();
  minimumDate = new Date(1900, 0, 1);
  paymentRes: any;
  @Input() voidType: any;
  @Input() paidStatusData: any;
  subscription: any;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  @Input() cancellation: boolean;
  @Input() billType: number;
  @Output() getBillingDetails = new EventEmitter();
  isEditDepositdate: boolean = false;
  depositionDate: string = null;
  eorError = false;
  paymentError = false;
  paymentReviewAmount = null;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private breakpointObserver: BreakpointObserver, private onDemandService: OnDemandService,
    private alertService: AlertService, public billingService: BillingService, private intercom: IntercomService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Bill #", "Action"]
        this.columnsToDisplay = ['is_expand', 'bill_id', "action"]
      } else {
        this.columnName = ["", "Bill #", "Submission", "Date Sent", "Due Date", "Charge", "Payment", "Balance", "Status", "Action"]
        this.columnsToDisplay = ['is_expand', 'bill_id', 'submission', "sent_date", "due_date", 'charge', 'payment', 'balance', 'status', 'action']
      }
    })
    this.paymentForm = this.fb.group({
      payments: this.fb.array([]),
    })
  }
  billLineItems = [];

  getBillLineItems() {
    this.billingService.getBillLineItem(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId).subscribe(line => {
      this.billLineItems = line.data;
      // let balance: number = 0;
      // this.billLineItems && this.billLineItems.map(line_item => {
      //   console.log(line_item)
      //   if (line_item && +line_item.charge > +line_item.payment_amount) {
      //     console.log("charge", +line_item.charge)
      //     balance += +line_item.charge
      //   } else {
      //     console.log("payment_amount", +line_item.payment_amount)
      //     balance += +line_item.payment_amount
      //   }
      // })
      // console.log(+balance)
      // this.payments().at(0).get('balance').patchValue(+balance > 0 ? +balance : 0);
      // this.payments().at(0).get('actual_balance').patchValue(+balance > 0 ? +balance : 0);
    })

  }

  is_cancellation = false;
  ngAfterContentInit() {
    this.is_cancellation = this.cancellation;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EditResponse, {
      width: '800px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }
  openLateResponse(): void {
    const dialogRef = this.dialog.open(LateResponse, {
      width: '800px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }


  ngOnInit() {
    this.subscription = this.intercom.getBillItemChange().subscribe(res => {
      this.getBillLineItems();
    })
    this.getBillLineItems();
    this.getPaymentRes();
    this.subscription = this.intercom.getBillItemChange().subscribe(res => {
      if (!res.paymentStatus) {
        this.payments().at(0).get('charge').patchValue(res.total_charge)
        let balance = +res.total_charge - +this.payments().at(0).get('payment').value;
        this.payments().at(0).get('balance').patchValue(balance > 0 ? balance : 0);
      }
    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  billingEORDetails = []
  getPaymentRes() {
    this.billingService.getPaymentResponse(this.paramsId.billingId, this.paramsId.claim_id, this.paramsId.billId).subscribe(payment => {
      this.paymentForm = this.fb.group({
        payments: this.fb.array([]),
      })
      this.paymentRes = payment.data;
      this.getPaymentStatus.emit(this.paymentRes ? this.paymentRes[0] : null)
      let responseCount = 0;
      payment.data.map(pay => {
        responseCount = pay.payment_response && pay.payment_response.length + responseCount;
      })
      this.intercom.PaymentReview(responseCount);
      this.paymentRes.map((pay, i) => {
        this.addPayment();
        this.openElement(pay.id)
        let initPayment = {
          bill_no: pay.bill_no,
          id: pay.id,
          bill_submission_type: pay.bill_submission_type,
          showStatus: false,
          charge: pay.charge,
          date_sent: pay.date_sent,
          bill_due_date: pay.bill_due_date,
          payment: pay.payment,
          status: '',
          balance: pay.balance,
          bill_paid_status: pay.bill_paid_status,
          is_bill_closed: pay.is_bill_closed,
          reviews: pay.payment_response,
          first_submission_payment: pay.first_submission_payment,
          sbr_payment: pay.sbr_payment
        }


        this.payments().at(i).patchValue(initPayment);
        pay.payment_response && pay.payment_response.map((review, ind) => {
          this.billingEORDetails[ind] = review.eor_allowance_details;
          this.addReviews(i, false);
          review.file_name = review.eor_original_file_name ? review.eor_original_file_name : review.eor_file_name;
          review.file_url = review.eor_file_url;
          if (ind > 0) review.void_reason_id = this.paymentReviews(i).at(ind - 1).get('id').value;
          review.showStatus = false
          this.paymentReviews(i).at(ind).get('eor_allowance_details').patchValue([]);
          review.eor_allowance_details.map((eor, index) => {
            if (eor && !eor.is_fully_paid) {
              let eor_allowance_details = this.paymentReviews(i).at(ind).get('eor_allowance_details');
              (eor_allowance_details as FormArray).push(this.fb.group({
                bill_line_item_id: eor.id,
                item: eor.item_description, procedure_code: eor.procedure_code, modifier: eor.modifier, charges: eor.charge, eor_allowance: Number(eor.eor_allowance), payment_amount: eor.payment_amount, balance: eor.balance > 0 ? eor.balance : eor.charge, first_submission_payment: eor.first_submission_payment, sbr_payment: eor.sbr_payment
              }))
            }
          })
          this.paymentReviews(i).at(ind).patchValue(review);
        })

      })
    }, error => {
    })
  }
  expandId: any;
  openElement(element) {
    if (this.expandId && this.expandId == element) {
      this.expandId = null;
    } else {
      this.expandId = element;
    }
  }

  newPayemntRes(): FormGroup {
    return this.fb.group({
      bill_no: '',
      id: '',
      bill_submission_type: '',
      showStatus: true,
      charge: '',
      date_sent: '',
      bill_due_date: '',
      payment: '',
      status: '',
      balance: '',
      //  actual_balance: '',
      bill_paid_status: '',
      is_bill_closed: '',
      reviews: this.fb.array([]),
      first_submission_payment: '',
      sbr_payment: ''
    })
  }

  newReview(): FormGroup {
    return this.fb.group({
      id: [''],
      payment_amount: ['', Validators.compose([Validators.required, Validators.min(0)])],
      reference_no: ['', Validators.compose([Validators.required])],
      payor_claim_control_number: [''],
      effective_date: ['', Validators.compose([Validators.required])],
      payment_method: ['', Validators.compose([Validators.required])],
      post_date: ['', Validators.compose([Validators.required])],
      deposit_date: [''],
      penalty_charged: ['', Validators.min(0)],
      penalty_paid: ['', Validators.min(0)],
      interest_charged: ['', Validators.min(0)],
      interest_paid: ['', Validators.min(0)],
      void_type_id: '',
      void_reason: '',
      paper_eor_document_id: '',
      eor_file_id: '',
      void_reason_id: '',
      file: ['', Validators.compose([Validators.required])],
      file_name: '',
      file_url: '',
      showStatus: true,
      created_by_first_name: '',
      created_by_last_name: '',
      createdAt: '',
      updatedAt: '',
      updated_by_first_name: '',
      updated_by_last_name: '',
      eor_allowance_details: this.fb.array([]),
      voidData: '',
      void_type: '',
      response_type_id: ['', Validators.compose([Validators.required])],
      response_type: [''],
      bill_paid_status: [''],
      other_type_reason: ['']

    })
  }
  newEORForm() {
    return this.fb.group({
      item: [""],
      procedure_code: [""],
      modifier: [""],
      charges: [""],
      eor_allowence: [],
      payment_amount: [],
      balance: [],
      first_submission_payment: [],
      sbr_payment: []
    })
  }
  payments(): FormArray {
    return this.paymentForm.get("payments") as FormArray;
  }

  paymentReviews(index: number): FormArray {
    return this.payments().at(index).get("reviews") as FormArray;
  }
  eorForm(index: number, ind): FormArray {
    return this.paymentReviews(0).at(ind).get('eor_allowance_details') as FormArray;
  }
  addPayment() {
    this.payments().push(this.newPayemntRes());
  }
  reviewIndex: any;
  addReviews(index: number, isNew?, Extraind?) {
    this.reviewIndex = index;
    this.paymentReviews(index).push(this.newReview());
    const review = this.paymentReviews(index).at(this.paymentReviews(index).length - 1);
    if (isNew) {
      let eorDetails: any = {};
      this.billingService.getBillLineItem(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId).subscribe(line => {
        line.data.map((eor, ind) => {
          console.log(eor)
          if (eor && !eor.is_fully_paid) {
            eorDetails = {}
            const eor_allowance_details = review.get('eor_allowance_details');
            eorDetails = {
              bill_line_item_id: eor.id,
              item: eor.item_description, procedure_code: eor.procedure_code, modifier: eor.modifier, charges: eor.charge, eor_allowance: "", payment_amount: eor.payment_amount, balance: eor.balance > 0 ? eor.balance : eor.charge, first_submission_payment: eor.first_submission_payment, sbr_payment: eor.sbr_payment
            };
            if (this.billType == 2) {
              eorDetails.balance = eor.charge - eor.first_submission_payment;
            }
            if (this.billType == 3) {
              eorDetails.balance = eor.charge - eor.first_submission_payment - eor.sbr_payment;
            }
            (eor_allowance_details as FormArray).push(this.fb.group(eorDetails));
          }
        })
      })
    }

    //update payment amount value if response type is fully paid
    if (review.get('response_type').value === 1) {
      this.setPaymentAmount(index, review);
    }

    let responseCount = 0;
    this.payments().value.map(pay => {
      pay.reviews.map(rev => {
        responseCount = responseCount + 1;
      })
    })
    this.intercom.PaymentReview(responseCount);
    this.expandId = null;
    this.openElement(this.payments().at(0).get('id').value);
  }

  setPaymentAmount(index: number, review) {
    const { balance } = this.payments().at(index).value;
    const payment_amount = Number(balance || 0);
    review.get('payment_amount').patchValue(payment_amount.toFixed(2));
  }

  addDepositDate(review: FormGroup) {
    if (!this.depositionDate) {
      this.alertService.openSnackBar('Please enter Deposit date!', 'error');
      return;
    }
    const { bill_id, billable_item_id, claim_id } = this.billingData;
    const payment_response_id = review.get('id').value;
    const data = {
      deposit_date: moment(this.depositionDate).format("YYYY-MM-DD"),
      submission_type_id: this.billType
    }
    this.billingService.updateDepositDate(claim_id, billable_item_id, bill_id, payment_response_id, data).subscribe((res) => {
      review.get('deposit_date').patchValue(this.depositionDate);
      this.alertService.openSnackBar('Deposit date updated successfully!', 'success');
    }, err => {
      this.depositionDate = null;
      review.get('deposit_date').patchValue(null);
      this.alertService.openSnackBar('Unable to update Deposit date!', 'error');
    })
  }
  clearDepositDate() {
    this.isEditDepositdate = false;
    this.depositionDate = null;
  }
  saveReview(payment: FormGroup, review: FormGroup, payIndex, reviewIndex, isDepositAdd?) {
    review.get('eor_allowance_details').value.map((rev, ind) => {
      if (review.get('void_type_id').value == 3) {
        review.get('eor_allowance_details').value[ind].eor_allowance = null;
      }
    })
    if (reviewIndex > 0 && this.paymentReviews(payIndex).at(this.paymentReviews(payIndex).controls.length - 2).get('void_type_id').value != 3) {
      if (!isDepositAdd) {
        review.get('void_type_id').setValidators([Validators.required])
        review.get('void_reason').setValidators([Validators.required])
        review.get('void_type_id').updateValueAndValidity();
        review.get('void_reason').updateValueAndValidity();
      }
      if (!review.get('file').value) {
        review.get('file').setValidators([])
        review.get('file').updateValueAndValidity();
      } else {
        review.get('eor_file_id').patchValue('')
      }
    }
    let formData = new FormData();
    Object.keys(review.controls).forEach((key) => {
      if (review.get(key).value == null || review.get(key).value == undefined) review.get(key).patchValue('');
      if (review.get(key).value && typeof (review.get(key).value) == 'string')
        review.get(key).setValue(review.get(key).value.trim())
    });
    if (review.status == "INVALID") {
      this.alertService.openSnackBar("Please fill in the required (*) fields", 'error')
      review.markAllAsTouched();
      return;
    }
    const responseType = review.get('void_type_id').value;
    responseType !== 3 ? this.validatePaymentAmount(review) : '';
    if (responseType !== 3 && this.eorError) {
      return;
    }

    const paymentError = this.checkPaymentError(review);
    if (paymentError) {
      return;
    }

    formData.append('post_date', review.get('post_date').value ? moment(review.get('post_date').value).format("MM-DD-YYYY") : '');
    formData.append('effective_date', review.get('effective_date').value ? moment(review.get('effective_date').value).format("MM-DD-YYYY") : '');
    formData.append('deposit_date', review.get('deposit_date').value ? moment(review.get('deposit_date').value).format("MM-DD-YYYY") : '');
    formData.append('payment_amount', review.get('payment_amount').value);
    formData.append('payment_method', review.get("payment_method").value);
    formData.append('penalty_charged', review.get('penalty_charged').value);
    formData.append('penalty_paid', review.get('penalty_paid').value);
    formData.append('reference_no', review.get('reference_no').value);
    formData.append('payor_claim_control_number', review.get('payor_claim_control_number').value);
    formData.append('interest_charged', review.get('interest_charged').value);
    formData.append('interest_paid', review.get('interest_paid').value);
    formData.append('void_reason_id', reviewIndex > 0 && this.paymentReviews(payIndex).at(this.paymentReviews(payIndex).controls.length - 2).get('void_type_id').value != 3 ? this.paymentReviews(payIndex).at(reviewIndex - 1).get('id').value : '');
    formData.append('void_type_id', review.get('void_type_id').value);
    formData.append('void_reason', review.get('void_reason').value);
    formData.append('eor_file_id', review.get('eor_file_id').value);
    formData.append('response_type_id', review.get('response_type_id').value);
    formData.append('other_type_reason', review.get('other_type_reason').value);
    formData.append('eor_allowance_details', JSON.stringify(review.get('eor_allowance_details').value));
    formData.append('submission_type_id', this.billType.toString());




    formData.append('file', review.get('file').value);
    this.billingService.postPaymentResponse(this.paramsId.billingId, this.paramsId.claim_id, this.paramsId.billId, formData).subscribe((event: HttpEvent<any>) => {
      let pay = event['body'];
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          let responseCount = 0;
          pay.data.map(res => {
            responseCount = responseCount + res.payment_response.length;
          })
          this.intercom.PaymentReview(responseCount);
          this.intercom.paymentReviewSaved(true);
          this.paymentForm = this.fb.group({
            payments: this.fb.array([]),
          })
          this.paymentRes = pay.data;
          this.getPaymentStatus.emit(this.paymentRes ? this.paymentRes[0] : null)
          this.paymentRes.map((pay, i) => {
            this.addPayment();
            //this.openElement(i)
            let initPayment = {
              bill_no: pay.bill_no,
              id: pay.id,
              bill_submission_type: pay.bill_submission_type,
              showStatus: false,
              charge: pay.charge,
              date_sent: pay.date_sent,
              bill_due_date: pay.bill_due_date,
              payment: pay.payment,
              status: '',
              balance: pay.balance,
              bill_paid_status: pay.bill_paid_status,
              is_bill_closed: pay.is_bill_closed,
              reviews: pay.payment_response,
              first_submission_payment: pay.first_submission_payment,
              sbr_payment: pay.sbr_payment
            }
            this.payments().at(i).patchValue(initPayment);
            pay.payment_response.map((review, ind) => {
              review.file_name = review.eor_original_file_name ? review.eor_original_file_name : review.eor_file_name;
              review.file_url = review.eor_file_url;
              if (ind > 0) review.void_reason_id = this.paymentReviews(i).at(ind - 1).get('id').value;
              review.showStatus = false;
              // if (review.eor_allowance_details.length == 0) {
              this.addReviews(i, false);
              // }
              review.eor_allowance_details.map((eor, index) => {
                // this.addReviews(i, false);
                if (eor && !eor.is_fully_paid) {
                  let eor_allowance_details = this.paymentReviews(i).at(ind).get('eor_allowance_details');
                  (eor_allowance_details as FormArray).push(this.fb.group({
                    bill_line_item_id: eor.bill_line_item_id,
                    item: eor.item_description, procedure_code: eor.procedure_code, modifier: eor.modifier, charges: eor.charges, eor_allowance: Number(eor.eor_allowance), payment_amount: eor.payment_amount, balance: eor.balance > 0 ? eor.balance : eor.charge, first_submission_payment: eor.first_submission_payment, sbr_payment: eor.sbr_payment
                  }))
                }
              })
              this.paymentReviews(i).at(ind).patchValue(review);
            })
            // this.getPaymentRes();
          })
          this.intercom.setBillItemChange({ paymentStatus: true })
          // this.getPaymentRes();
          this.getBillingDetails.emit(true);
        }
      }
    }, error => {

    })
  }

  private checkPaymentError(review: FormGroup) {
    const { response_type_id, void_type_id } = review.value;
    const paymentError = (response_type_id === 2 || response_type_id === 1) && Number(review.get('payment_amount').value) === 0 && void_type_id !== 3;
    this.paymentError = paymentError;
    return paymentError;
  }

  showReview() {

  }

  removeReview(payI, reviewI) {
    this.eorError = false;
    this.paymentReviews(payI).removeAt(reviewI)
    let responseCount = 0;
    this.payments().value.map(pay => {
      pay.reviews.map(rev => {
        responseCount = responseCount + 1;
      })
    })
    this.intercom.PaymentReview(responseCount);
  }

  editResponse(payment, review, payi, reviewi) {
    this.addReviews(payi, true, reviewi + 1);
    // this.paymentReviews(payi).at(reviewi).get('eor_allowance_details').patchValue([]);
    // return;
    // this.paymentRes[payi].payment_response[reviewi].eor_allowance_details.value.map((eor, index) => {
    //   let eor_allowance_details = review.get('eor_allowance_details');
    //   (eor_allowance_details as FormArray).push(this.fb.group({
    //     bill_line_item_id: eor.id,
    //     item: eor.item_description, procedure_code: eor.procedure_code, modifier: eor.modifier, charges: eor.charge, eor_allowence: Number(eor.eor_allowance), payment_amount: eor.payment_amount
    //   }))
    // })
    this.paymentReviewAmount = review.value.payment_amount;
    this.paymentReviews(payi).at(reviewi + 1).patchValue(review.value);
    this.paymentReviews(payi).at(reviewi + 1).get('showStatus').patchValue(true);
    this.paymentReviews(payi).at(reviewi + 1).get('voidData').patchValue(this.voidType)
    this.paymentReviews(payi).at(reviewi + 1).get('void_reason_id').patchValue(review.value.id);
    this.paymentReviews(payi).at(reviewi + 1).get('id').patchValue('');
    this.paymentReviews(payi).at(reviewi + 1).disable();
    this.paymentReviews(payi).at(reviewi + 1).get('void_type_id').enable();
    this.paymentReviews(payi).at(reviewi + 1).get('void_reason').enable();
  }

  changeVoidType(payment, review, payIndex, reviewIndex, event) {
    if (event.value == 3) { //Void Payment
      review.get('payment_amount').patchValue(0);
      review.disable();
      review.get('void_type_id').enable();
      review.get('void_reason').enable();
    }
    if (event.value == 2) { //Correction
      review.enable();
    }
    if (event.value == 1) { //Change Payment
      review.enable();
    }
    this.changeResponseType(payment, review, payIndex, reviewIndex, { value: review.value.response_type_id })
  }

  changeResponseType(payment, review, payIndex, reviewIndex, event) {


    //update payment amount value if response type is fully paid
    if (event.value === 1) {
      this.setPaymentAmount(payIndex, review);
    } else {
      review.get('payment_amount').patchValue(event.value === 3 ? (0).toFixed(2) : this.paymentReviewAmount);
    }

    if (event.value == 3 || event.value == 5) {
      review.get('payment_amount').setValidators([Validators.min(0)]); review.get('payment_amount').updateValueAndValidity();
      review.get('reference_no').setValidators([]); review.get('reference_no').updateValueAndValidity();
      review.get('effective_date').setValidators([]); review.get('effective_date').updateValueAndValidity();
      review.get('payment_method').setValidators([]); review.get('payment_method').updateValueAndValidity();
      review.get('post_date').setValidators([]); review.get('post_date').updateValueAndValidity();
      //review.get('deposit_date').setValidators([]); review.get('deposit_date').updateValueAndValidity();
      review.get('other_type_reason').setValidators(); review.get('other_type_reason').updateValueAndValidity();
    }
    // else if (event.value == 4) {
    //   review.get('payment_amount').setValidators(Validators.compose([Validators.required, Validators.min(0)])); review.get('payment_amount').updateValueAndValidity();
    //   review.get('reference_no').setValidators([]); review.get('reference_no').updateValueAndValidity();
    //   review.get('effective_date').setValidators([Validators.required]); review.get('effective_date').updateValueAndValidity();
    //   review.get('payment_method').setValidators([]); review.get('payment_method').updateValueAndValidity();
    //   review.get('post_date').setValidators([]); review.get('post_date').updateValueAndValidity();
    //   //review.get('deposit_date').setValidators([]); review.get('deposit_date').updateValueAndValidity();
    //   review.get('other_type_reason').setValidators(); review.get('other_type_reason').updateValueAndValidity();
    // } 
    else {
      review.get('payment_amount').setValidators(Validators.compose([Validators.required, Validators.min(0)])); review.get('payment_amount').updateValueAndValidity();
      review.get('reference_no').setValidators(Validators.compose([Validators.required])); review.get('reference_no').updateValueAndValidity();
      review.get('effective_date').setValidators(Validators.compose([Validators.required])); review.get('effective_date').updateValueAndValidity();
      review.get('payment_method').setValidators(Validators.compose([Validators.required])); review.get('payment_method').updateValueAndValidity();
      review.get('post_date').setValidators(Validators.compose([Validators.required])); review.get('post_date').updateValueAndValidity();
      //review.get('deposit_date').setValidators(Validators.compose([Validators.required])); review.get('deposit_date').updateValueAndValidity();
      review.get('other_type_reason').setValidators(); review.get('other_type_reason').updateValueAndValidity();
    }
    if (event.value == 5) {
      review.get('other_type_reason').setValidators(Validators.compose([Validators.required])); review.get('other_type_reason').updateValueAndValidity();
    } else {
      review.get('other_type_reason').patchValue('')
    }
    review.updateValueAndValidity();

    this.checkPaymentError(review);

  }
  openUploadPopUp(isMultiple, type, data?, fileSize?) {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { name: 'make this card the default card', address: true, isMultiple: isMultiple, fileType: type, fileSize: fileSize },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.addEOR(result.files, data)
        // if (callback == 'addCompleteDoc') {
        //   this.addCompleteDoc(result.files, data)
        // } else if (callback == 'addFile') {
        //   this.addFile(result.files, true)
        // }
      }
    })
  }
  addEOR(files, review?) {
    let fileTypes = ['pdf', 'jpg', 'jpeg', 'png']

    if (fileTypes.includes(files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.alertService.openSnackBar(files[0].name + " file too long", 'error');
        return;
      }

      let file = {
        file: files[0],
        file_name: files[0].name
      }
      review.get('file').patchValue(files[0]);
      review.get('file_name').patchValue(files[0].name)
    } else {
      this.alertService.openSnackBar(files[0].name + " file is not accepted", 'error');
    }
  }

  download(element) {
    this.billingService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.billingService.updateActionLog({ type: "billing", "claim_id": this.paramsId.claim_id, "billable_item_id": this.paramsId.billId, "documents_ids": [element.id], submission_type_id: this.billType }).subscribe(res => {
      })
      saveAs(res.signed_file_url, element.file_name);
    })
  }



  //Popup's list
  openVoidDialog(): void {
    const dialogRef = this.dialog.open(VoidPayment, {
      width: '800px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }
  openCloseBillDialog(): void {
    const dialogRef = this.dialog.open(CloseBill, {
      width: '800px',
      data: { bill_id: this.billingData.bill_id, claim_id: this.paramsId.claim_id, billable_item_id: this.paramsId.billId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }
  openSecondBillReviewDialog(): void {
    const dialogRef = this.dialog.open(SecondBillReview, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  validatePaymentAmount(review: any, eorIndex?: number, eorData?) {
    const eorDetails = review.get('eor_allowance_details').value;
    const paymentAmount = Number(review.get('payment_amount').value);
    const eorDetail = eorDetails[eorIndex];
    if (eorIndex >= 0) {
      if (eorDetail.charges < eorDetail.eor_allowance) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: "500px",
          data: {
            title: "Warning",
            type: 'warning',
            proceed: true,
            cancel: true,
            message: 'EOR Allowance is higher than charge'
          }
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (!res.data) {
            eorDetails[eorIndex].eor_allowance = null;
            review.get('eor_allowance_details').patchValue(eorDetails);
          }
          this.checkEorError(eorDetails, paymentAmount);
        });
      }
    }
    if (eorData) {
      let balance
      if (this.billType == 1) {
        balance = eorData.get('charges').value - eorData.get('eor_allowance').value;
      }
      if (this.billType == 2) {
        balance = eorData.get('charges').value - eorData.get('eor_allowance').value - eorData.get('first_submission_payment').value;
      }
      if (this.billType == 3) {
        balance = eorData.get('charges').value - eorData.get('eor_allowance').value - eorData.get('first_submission_payment').value - eorData.get('sbr_payment').value
      }
      eorData.get('balance').patchValue(balance);
    }

    this.checkEorError(eorDetails, paymentAmount);

    this.checkPaymentError(review);
  }

  toggleDepositDate() {
    this.isEditDepositdate = !this.isEditDepositdate;
  }

  checkFullyPaid(review) {
    //check payment equal to charge and show alert to change response type to fully paid
    const { payment_amount, response_type_id, eor_allowance_details } = review.value;
    const charge = eor_allowance_details.reduce((a, b) => a + Number(b.charges), 0);
    const balance = eor_allowance_details.reduce((a, b) => {
      if (this.billType == 2) {
        return a + (Number(b.charges) - Number(b.first_submission_payment));
      } else {
        return a + (Number(b.charges) - Number(b.first_submission_payment) - Number(b.sbr_payment));
      }
    }, 0);
    let comparisonText = 'equal to'
    if (
      response_type_id == 2 &&
      (
        (Number(payment_amount) >= charge && this.billType == 1) ||
        (Number(payment_amount) >= balance &&
          (this.billType == 2 || this.billType == 3)
        )
      )
    ) {
      if (Number(payment_amount) >= charge && this.billType == 1) {
        comparisonText = payment_amount === charge ? 'equal to the' : 'greater than';
      } else {
        comparisonText = payment_amount === balance ? 'equal to the' : 'greater than';
      }
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: '500px',
        data: {
          proceed: true,
          cancel: true,
          type: 'warning',
          message: 'Payment amount is ' + comparisonText + ' balance. Do you want to change the response type to Fully Paid?'
        }
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res.data) {
          review.get('response_type_id').patchValue(1);
        }
      });
    }
  }

  private checkEorError(eorDetails: any, paymentAmount: number) {
    let eorAllowance = 0;
    eorDetails.map(eorDetail => {
      eorAllowance += Number(eorDetail.eor_allowance);
    });
    // const eorFilled = eorDetails.some((eorDetail) => eorDetail.eor_allowance && eorDetail.eor_allowance > 0);
    this.eorError = paymentAmount !== eorAllowance;
  }
}


@Component({
  selector: 'close-bill',
  templateUrl: '../close-bill.html',
})
export class CloseBill {
  closeBillForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CloseBill>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public billingService: BillingService,
    private alertService: AlertService) {

    this.closeBillForm = this.fb.group({
      close_bill_reason: ['', Validators.compose([Validators.required])],
    })
  }

  closeBill() {
    Object.keys(this.closeBillForm.controls).forEach((key) => {
      if (this.closeBillForm.get(key).value && typeof (this.closeBillForm.get(key).value) == 'string')
        this.closeBillForm.get(key).setValue(this.closeBillForm.get(key).value.trim())
    });
    if (this.closeBillForm.invalid) {
      return;
    }
    this.billingService.closeBill(this.data.bill_id, this.data.claim_id, this.data.billable_item_id, this.closeBillForm.value).subscribe(close => {
      this.alertService.openSnackBar(close.message, "success");
      this.dialogRef.close();
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'void-payment',
  templateUrl: '../void-payment.html',
})
export class VoidPayment {

  constructor(
    public dialogRef: MatDialogRef<VoidPayment>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
export interface PeriodicElement2 {
  name: string;
  action: string;
}
@Component({
  selector: 'second-bill-review',
  templateUrl: '../second-bill-review.html',
})
export class SecondBillReview {
  displayedColumns: string[] = ['select', 'item', 'procedure_code_1', 'modifier_1', 'unit', 'charges', 'first_submission', 'balances'];
  dataSource = new MatTableDataSource(ELEMENT_DATA1);
  selection = new SelectionModel(true, []);
  displayedColumns1: string[] = ['name', 'action'];
  dataSource1 = ELEMENT_DATA2;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.item + 1}`;
  }
  constructor(
    public dialogRef: MatDialogRef<SecondBillReview>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
const ELEMENT_DATA1 = [
  { item: 'QME', procedure_code_1: 'ML201', modifier_1: '93', unit: '1', charges: '2200.00', first_submission: '0', balances: '2200.00' },
  { item: 'Excess Report Pages', procedure_code_1: '', modifier_1: '', unit: '758', charges: '1516.00', first_submission: '0', balances: '1516.00' },
];

const ELEMENT_DATA2: PeriodicElement2[] = [
  { action: '', name: 'Document_filename.pdf' },
];


@Component({
  selector: 'edit-response',
  templateUrl: 'edit-response.html',
})
export class EditResponse {

  constructor(
    public dialogRef: MatDialogRef<EditResponse>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'late-response',
  templateUrl: 'late-response.html',
})
export class LateResponse {

  constructor(
    public dialogRef: MatDialogRef<LateResponse>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}