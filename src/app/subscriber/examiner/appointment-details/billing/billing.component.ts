import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
  dataSource = ELEMENT_DATA;
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
  constructor(private breakpointObserver: BreakpointObserver) {
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
        this.columnName2 = ["File Name", "Type", "Date", "Action"]
        this.columnsToDisplay2 = ['file_name', 'type', 'date', "action"]
      }

      this.isMobile3 = res;
      if (res) {
        this.columnName3 = ["", "File Name", "Action"]
        this.columnsToDisplay3 = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName3 = ["File Name", "Action", "Date", "Recipients", "Download Sent Documents", "Download Proof of Service"]
        this.columnsToDisplay3 = ['file_name', 'action', 'date', "recipients", "sent_document", "proof_of_service"]
      }
    })
  }

  ngOnInit() {
  }
  expandId: any;
  expandId1: any;
  expandId2: any;
  expandId3: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
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
  addFile(event) {

  }

}
const ELEMENT_DATA = [
  { "id": 132, "code": "K50.00", "name": " Crohn disease of small intestine without complications " },
  { "id": 131, "code": "N80.1", "name": "Endometriosis of ovary" },
  { "id": 130, "code": "M76.62", "name": "Achilles tendinitis, left leg" },

];
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