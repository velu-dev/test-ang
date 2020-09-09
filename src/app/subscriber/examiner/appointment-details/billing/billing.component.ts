import { Component, OnInit, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { NGXLogger } from 'ngx-logger';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
@Component({
  selector: 'app-billable-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BilllableBillingComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  columnsToDisplay = [];
  IcdDataSource = new MatTableDataSource([]);
  expandedElement;
  isMobile = false;
  columnName = [];
  dataSource1 = ELEMENT_DATA1;
  columnsToDisplay1 = [];
  expandedElement1;
  columnName1 = [];
  isMobile1 = false;
  dataSource2 = ELEMENT_DATA2;
  columnsToDisplay2 = [];
  expandedElement2;
  columnName2 = [];
  isMobile2 = false;
  dataSource3 = ELEMENT_DATA3;
  columnsToDisplay3 = [];
  expandedElement3;
  columnName3 = [];
  isMobile3 = false;
  filterValue: string;
  file: any;
  documentType: any;
  constructor(private logger: NGXLogger, private claimService: ClaimService, private breakpointObserver: BreakpointObserver, private alertService: AlertService, public dialog: MatDialog) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Code", "Action"]
        this.columnsToDisplay = ['is_expand', 'code', 'action']
      } else {
        this.columnName = ["Code", "Name", "Action"]
        this.columnsToDisplay = ['code', 'name', 'action']
      }
      this.isMobile1 = res;
      if (res) {
        this.columnName1 = ["", "Item", "Action"]
        this.columnsToDisplay1 = ['is_expand', 'code', "action"]
      } else {
        this.columnName1 = ["Item", "Procedure Code", "Modifier", "Units", "Charge", "Payment", "Balance", "Action"]
        this.columnsToDisplay1 = ['item', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action']
      }
      this.isMobile2 = res;
      if (res) {
        this.columnName2 = ["", "File Name", "Action"]
        this.columnsToDisplay2 = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName2 = ["","File Name", "Type", "Date", "Action"]
        this.columnsToDisplay2 = ['doc_image','file_name', 'type', 'date', "action"]
      }

      this.isMobile3 = res;
      if (res) {
        this.columnName3 = ["", "File Name", "Action"]
        this.columnsToDisplay3 = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName3 = ["","File Name", "Action", "Date", "Recipients", "Download Sent Documents", "Download Proof of Service"]
        this.columnsToDisplay3 = ['doc_image','file_name', 'action', 'date', "recipients", "sent_document", "proof_of_service"]
      }
    })
  }
  icdCtrl = new FormControl();
  icdSearched = false;
  filteredICD: Observable<[]>;


  openDialog(): void {
    const dialogRef = this.dialog.open(BillingPaymentDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.icdCtrl.valueChanges.subscribe(res => {
      this.icdSearched = true;
      this.claimService.getICD10(res).subscribe(icd => {
        console.log(icd)
        this.filteredICD = icd[3];
      });
    })
  }
  icdData = [];
  selectedIcd = { code: "", name: "" };
  selectICD(icd) {
    this.selectedIcd = { code: icd[0], name: icd[1] }
  }
  addIcd() {
    this.icdData = this.IcdDataSource.data;
    this.icdData.push(this.selectedIcd)
    this.IcdDataSource = new MatTableDataSource(this.icdData);
    this.selectedIcd = { code: "", name: "" };
    this.alertService.openSnackBar("ICD data added succssfull", "success");
    this.icdCtrl.reset();
  }
  removeICD(icd) {
    let index = 0;
    this.icdData.map(res => {
      if (res.code == icd.code) {
        this.icdData.splice(index, 1);
      }
      index = index + 1;
    })
    this.IcdDataSource = new MatTableDataSource(this.icdData);
    this.alertService.openSnackBar("ICD data removed succssfull", "success");
  }
  icdExpandID: any;
  expandId1: any;
  expandId2: any;
  expandId3: any;
  openElement(element) {
    if (this.isMobile) {
      this.icdExpandID = element.id;
    }
    if (this.isMobile1) {
      this.expandId1 = element.id;
    }
    if (this.isMobile2) {
      this.expandId2 = element.id;
    }
    if (this.isMobile3) {
      this.expandId3 = element.id;
    }
  }
  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
  addFile(file) {

  }

}
const ELEMENT_DATA1 = [
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00" },
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00" },
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00" },

];
const ELEMENT_DATA2 = [
  { "id": 123, "file_name": "Finalized and Signed Report.pdf", "type": "Report", "date": "05-25-2019" },
  { "id": 1, "file_name": "Submission Cover Letter", "type": "Attachment", "date": "05-25-2019" },
  { "id": 2, "file_name": "Finalized and Signed Report.pdf", "type": "Report", "date": "05-25-2019" },
  { "id": 3, "file_name": "Submission Cover Letter", "type": "Attachment", "date": "05-25-2019" },
  { "id": 4, "file_name": "Finalized and Signed Report.pdf", "type": "Report", "date": "05-25-2019" },
  { "id": 5, "file_name": "Submission Cover Letter", "type": "Attachment", "date": "05-25-2019" },

];
const ELEMENT_DATA3 = [
  { "id": 6, "file_name": "Appointment Notification Letter", "action": "Mailed On Demand", "date": "05-25-2019", "recipients": "Claimant, Claims Adjuster, Applicant Attorney Defense Attorney, Employer, DEU Office", "sent_document": "Download", "proof_of_service": "Download" },
  { "id": 5, "file_name": "QME 110 - QME Appointment Notification Form", "action": "Downloaded", "date": "05-25-2019", "recipients": "", "sent_document": "Download", "proof_of_service": "Download" },
  { "id": 9, "file_name": "QME 122 - AME or QME Declaration of Service of…", "action": "Downloaded", "date": "05-25-2019", "recipients": "", "sent_document": "Download", "proof_of_service": "Download" },

];


@Component({
  selector: 'billing-payment-dialog.html',
  templateUrl: 'billing-payment-dialog.html',
})
export class BillingPaymentDialog {
  file:any;
  constructor(
    public dialogRef: MatDialogRef<BillingPaymentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addFile(e){

  }

}