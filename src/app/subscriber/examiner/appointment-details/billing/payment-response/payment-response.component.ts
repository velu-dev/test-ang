import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(public dialog: MatDialog, private fb: FormBuilder, private breakpointObserver: BreakpointObserver,
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
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  openLateResponse(): void {
    const dialogRef = this.dialog.open(LateResponse, {
      width: '800px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }


  ngOnInit() {
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

  getPaymentRes() {
    this.billingService.getPaymentResponse(this.paramsId.billingId, this.paramsId.claim_id, this.paramsId.billId).subscribe(payment => {
      console.log(payment);
      this.paymentForm = this.fb.group({
        payments: this.fb.array([]),
      })
      this.paymentRes = payment.data;
      this.getPaymentStatus.emit(this.paymentRes ? this.paymentRes[0] : null)
      this.paymentRes.map((pay, i) => {
        // console.log(pay, i)
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
          reviews: pay.payment_response
        }
        this.payments().at(i).patchValue(initPayment);
        pay.payment_response.map((review, ind) => {
          //  console.log(ind, i)
          this.addReviews(i);
          review.file_name = review.eor_original_file_name ? review.eor_original_file_name : review.eor_file_name;
          review.file_url = review.eor_file_url;
          if (ind > 0) review.void_reason_id = this.paymentReviews(i).at(ind - 1).get('id').value;
          review.showStatus = false
          this.paymentReviews(i).at(ind).patchValue(review);
        })

      })
    }, error => {
      console.log(error)
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
      bill_paid_status: '',
      is_bill_closed: '',
      reviews: this.fb.array([])
    })
  }

  newReview(): FormGroup {
    return this.fb.group({
      id: [''],
      payment_amount: ['', Validators.compose([Validators.required, Validators.min(0)])],
      reference_no: ['', Validators.compose([Validators.required])],
      effective_date: ['', Validators.compose([Validators.required])],
      payment_method: ['', Validators.compose([Validators.required])],
      post_date: ['', Validators.compose([Validators.required])],
      deposit_date: ['', Validators.compose([Validators.required])],
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
      voidData: '',
      void_type: '',
      response_type_id: ['', Validators.compose([Validators.required])],
      response_type: [''],
      bill_paid_status: [''],
      other_type_reason: ['']

    })
  }

  payments(): FormArray {
    return this.paymentForm.get("payments") as FormArray;
  }

  paymentReviews(index: number): FormArray {
    return this.payments().at(index).get("reviews") as FormArray;
  }

  addPayment() {
    this.payments().push(this.newPayemntRes());
  }

  addReviews(index: number) {
    this.paymentReviews(index).push(this.newReview());
    this.expandId = null;
    this.openElement(this.payments().at(0).get('id').value)
  }

  saveReview(payment: FormGroup, review: FormGroup, payIndex, reviewIndex) {
    // console.log(payment.value)
    // console.log(review.value)
    if (reviewIndex > 0 && this.paymentReviews(payIndex).at(this.paymentReviews(payIndex).controls.length - 2).get('void_type_id').value != 3) {
      review.get('void_type_id').setValidators([Validators.required])
      review.get('void_reason').setValidators([Validators.required])
      review.get('void_type_id').updateValueAndValidity();
      review.get('void_reason').updateValueAndValidity();

      if (!review.get('file').value) {
        review.get('file').setValidators([])
        review.get('file').updateValueAndValidity();
        //console.log(review.get('file').value);
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
    formData.append('post_date', review.get('post_date').value ? moment(review.get('post_date').value).format("MM-DD-YYYY") : '');
    formData.append('effective_date', review.get('effective_date').value ? moment(review.get('effective_date').value).format("MM-DD-YYYY") : '');
    formData.append('deposit_date', review.get('deposit_date').value ? moment(review.get('deposit_date').value).format("MM-DD-YYYY") : '');
    formData.append('payment_amount', review.get('payment_amount').value);
    formData.append('payment_method', review.get("payment_method").value);
    formData.append('penalty_charged', review.get('penalty_charged').value);
    formData.append('penalty_paid', review.get('penalty_paid').value);
    formData.append('reference_no', review.get('reference_no').value);
    formData.append('interest_charged', review.get('interest_charged').value);
    formData.append('interest_paid', review.get('interest_paid').value);
    formData.append('void_reason_id', reviewIndex > 0 && this.paymentReviews(payIndex).at(this.paymentReviews(payIndex).controls.length - 2).get('void_type_id').value != 3 ? this.paymentReviews(payIndex).at(reviewIndex - 1).get('id').value : '');
    formData.append('void_type_id', review.get('void_type_id').value);
    formData.append('void_reason', review.get('void_reason').value);
    formData.append('eor_file_id', review.get('eor_file_id').value);
    formData.append('response_type_id', review.get('response_type_id').value);
    formData.append('other_type_reason', review.get('other_type_reason').value);



    formData.append('file', review.get('file').value);
    this.billingService.postPaymentResponse(this.paramsId.billingId, this.paramsId.claim_id, this.paramsId.billId, formData).subscribe(pay => {
      // console.log(pay);
      this.paymentForm = this.fb.group({
        payments: this.fb.array([]),
      })
      this.paymentRes = pay.data;
      this.getPaymentStatus.emit(this.paymentRes ? this.paymentRes[0] : null)
      this.paymentRes.map((pay, i) => {
        // console.log(pay, i)
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
          reviews: pay.payment_response
        }
        this.payments().at(i).patchValue(initPayment);
        pay.payment_response.map((review, ind) => {
          // console.log(ind, i)
          this.addReviews(i);
          review.file_name = review.eor_file_name;
          review.file_url = review.eor_file_url;
          if (ind > 0) review.void_reason_id = this.paymentReviews(i).at(ind - 1).get('id').value;
          review.showStatus = false
          this.paymentReviews(i).at(ind).patchValue(review);
        })
        this.intercom.setBillItemChange({ paymentStatus: true })
      })
      // this.getPaymentRes();
    }, error => {

    })
  }

  showReview() {

  }

  removeReview(payI, reviewI) {
    this.paymentReviews(payI).removeAt(reviewI)
  }

  editResponse(payment, review, payi, reviewi) {
    // console.log(this.voidType)
    this.addReviews(payi);
    this.paymentReviews(payi).at(reviewi + 1).patchValue(review.value);
    this.paymentReviews(payi).at(reviewi + 1).get('showStatus').patchValue(true);
    this.paymentReviews(payi).at(reviewi + 1).get('voidData').patchValue(this.voidType)
    this.paymentReviews(payi).at(reviewi + 1).get('void_reason_id').patchValue(review.value.id);
    this.paymentReviews(payi).at(reviewi + 1).get('id').patchValue('');
    this.paymentReviews(payi).at(reviewi + 1).disable();
    this.paymentReviews(payi).at(reviewi + 1).get('void_type_id').enable();
    this.paymentReviews(payi).at(reviewi + 1).get('void_reason').enable();
    console.log(this.paymentReviews(payi).at(reviewi + 1))

  }

  changeVoidType(payment, review, payIndex, reviewIndex, event) {
    // console.log(event.value);
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
    // console.log(review)
    this.changeResponseType(payment, review, payIndex, reviewIndex, { value: review.value.response_type_id })
  }

  changeResponseType(payment, review, payIndex, reviewIndex, event) {
    console.log(event.value);

    if (event.value == 3 || event.value == 5) {
      review.get('payment_amount').setValidators([Validators.min(0)]); review.get('payment_amount').updateValueAndValidity();
      review.get('reference_no').setValidators([]); review.get('reference_no').updateValueAndValidity();
      review.get('effective_date').setValidators([]); review.get('effective_date').updateValueAndValidity();
      review.get('payment_method').setValidators([]); review.get('payment_method').updateValueAndValidity();
      review.get('post_date').setValidators([]); review.get('post_date').updateValueAndValidity();
      review.get('deposit_date').setValidators([]); review.get('deposit_date').updateValueAndValidity();
      review.get('other_type_reason').setValidators(); review.get('other_type_reason').updateValueAndValidity();
    } else if (event.value == 4) {
      review.get('payment_amount').setValidators(Validators.compose([Validators.required, Validators.min(0)])); review.get('payment_amount').updateValueAndValidity();
      review.get('reference_no').setValidators([]); review.get('reference_no').updateValueAndValidity();
      review.get('effective_date').setValidators([Validators.required]); review.get('effective_date').updateValueAndValidity();
      review.get('payment_method').setValidators([]); review.get('payment_method').updateValueAndValidity();
      review.get('post_date').setValidators([]); review.get('post_date').updateValueAndValidity();
      review.get('deposit_date').setValidators([]); review.get('deposit_date').updateValueAndValidity();
      review.get('other_type_reason').setValidators(); review.get('other_type_reason').updateValueAndValidity();
    } else {
      review.get('payment_amount').setValidators(Validators.compose([Validators.required, Validators.min(0)])); review.get('payment_amount').updateValueAndValidity();
      review.get('reference_no').setValidators(Validators.compose([Validators.required])); review.get('reference_no').updateValueAndValidity();
      review.get('effective_date').setValidators(Validators.compose([Validators.required])); review.get('effective_date').updateValueAndValidity();
      review.get('payment_method').setValidators(Validators.compose([Validators.required])); review.get('payment_method').updateValueAndValidity();
      review.get('post_date').setValidators(Validators.compose([Validators.required])); review.get('post_date').updateValueAndValidity();
      review.get('deposit_date').setValidators(Validators.compose([Validators.required])); review.get('deposit_date').updateValueAndValidity();
      review.get('other_type_reason').setValidators(); review.get('other_type_reason').updateValueAndValidity();
    }
    if (event.value == 5) {
      review.get('other_type_reason').setValidators(Validators.compose([Validators.required])); review.get('other_type_reason').updateValueAndValidity();
    } else {
      review.get('other_type_reason').patchValue('')
    }
    review.updateValueAndValidity();
    console.log(review)
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
      console.log(element)
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
    // console.log(this.closeBillForm.value)
    Object.keys(this.closeBillForm.controls).forEach((key) => {
      if (this.closeBillForm.get(key).value && typeof (this.closeBillForm.get(key).value) == 'string')
        this.closeBillForm.get(key).setValue(this.closeBillForm.get(key).value.trim())
    });
    if (this.closeBillForm.invalid) {
      return;
    }
    this.billingService.closeBill(this.data.bill_id, this.data.claim_id, this.data.billable_item_id, this.closeBillForm.value).subscribe(close => {
      //console.log(close)
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