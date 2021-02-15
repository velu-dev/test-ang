import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';


const ELEMENT_DATA: any = [
  { item: 'QME', procedure_code_1: 'ML201', modifier_1: '93', unit: '1', charges: '2200.00', first_submission: '0', balances: '2200.00' },
  { item: 'Excess Report Pages', procedure_code_1: '', modifier_1: '', unit: '758', charges: '1516.00', first_submission: '0', balances: '1516.00' },
];

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
  dataSource = ELEMENT_DATA1;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Bill #", "Action"]
        this.columnsToDisplay = ['is_expand', 'bill_id', "action"]
      } else {
        this.columnName = ["", "Bill #", "Submission", "Date Sent", "Due Date", "Payment", "Balance", "Status", "Action"]
        this.columnsToDisplay = ['is_expand', 'bill_id', 'submission', "sent_date", "due_date", 'charge', 'payment', 'balance', 'status', 'action']
      }
    })
  }

  ngOnInit() {
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
  }
  expandId: any;
  openElement(element) {
    if (this.expandId && this.expandId == element.id) {
      this.expandId = null;
    } else {
      this.expandId = element.id;
    }
  }
  initiateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      submission: ['', Validators.compose([Validators.required])],
      date_sent: ['', Validators.compose([Validators.required])],
      duedate: [[]],
      change: ['', Validators.compose([Validators.pattern('^[0-9]{2}(?:-[0-9]{2})?(?:-[0-9]{2})?(?:-[0-9]{2})?$')])],
      referencen_number: ['', Validators.compose([Validators.required, Validators.min(0)])],
      charge: ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(99999999.99)])],
      payment: [0],
      balance: [0],
      postdate: [0],
      posttype: [true],
      eor: [],
      status: []
    });
  }
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
  dataSource = new MatTableDataSource(ELEMENT_DATA);
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
  { "id": 132, "bill_id": "CMBN10009320", "submission": "First", "sent_date": "12-07-2020", "due_date": "12-05-2020", "charge": "$3516.00", "payment": "$100.00", "balance": "$3416.00", "status": "Partially Paid", "action ": "",},
  // { "id": 131, "bill_id": "CMBN10009480", "submission": "First", "sent_date": "12-07-2020", "due_date": "12-05-2020", "charge": "$3516.00", "payment": "$100.00", "balance": "$3416.00", "status": "Partially Paid", "action ": "",},

];