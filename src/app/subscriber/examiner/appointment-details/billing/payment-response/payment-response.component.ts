import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';

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
})

export class PaymentResponseComponent implements OnInit {

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
  constructor(public dialog: MatDialog, private fb: FormBuilder, private breakpointObserver: BreakpointObserver) {
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
    for (var i in [0, 1]) {
      this.addPayment();
      this.payments().get(i).patchValue({ id: i, bill_id: i, submission: i, showStatus: false })
     // this.addReviews(+i)
    }
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
console.log(this.billingData)



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
      bill_id: '',
      id: '',
      submission: '',
      showStatus: false,
      reviews: this.fb.array([])
    })
  }

  newReview(): FormGroup {
    return this.fb.group({
      post_date: '',
      effictive_date: '',
      deposit_date: '',
      payment_amount: ''
    })
  }

  payments(): FormArray {
    return this.paymentForm.get("payments") as FormArray;
  }

  paymentReviews(index: number): FormArray {
    if (index != null)
      return this.payments().at(index).get("reviews") as FormArray;
  }

  addPayment() {
    this.payments().push(this.newPayemntRes());
  }

  addReviews(index: number) {
    this.paymentReviews(index).push(this.newReview());
  }

  saveReview() {
    console.log(this.paymentForm)
  }

  showReview() {

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


}


@Component({
  selector: 'close-bill',
  templateUrl: '../close-bill.html',
})
export class CloseBill {

  constructor(
    public dialogRef: MatDialogRef<CloseBill>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'second-bill-review',
  templateUrl: '../second-bill-review.html',
})
export class SecondBillReview {
  displayedColumns: string[] = ['select', 'item', 'procedure_code_1', 'modifier_1', 'unit', 'charges', 'first_submission', 'balances'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

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
  { "id": 132, "bill_id": "CMBN10009320", "submission": "First", "sent_date": "12-07-2020", "due_date": "12-05-2020", "charge": "$3516.00", "payment": "$100.00", "balance": "$3416.00", "status": "Partially Paid", "action ": "", },
  { "id": 131, "bill_id": "CMBN10009480", "submission": "Second", "sent_date": "12-07-2020", "due_date": "12-05-2020", "charge": "$3516.00", "payment": "$100.00", "balance": "$3416.00", "status": "Partially Paid", "action ": "", },

];



@Component({
  selector: 'edit-response',
  templateUrl: 'edit-response.html',
})
export class EditResponse {

  constructor(
    public dialogRef: MatDialogRef<EditResponse>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}