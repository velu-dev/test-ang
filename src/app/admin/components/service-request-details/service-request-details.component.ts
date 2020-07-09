import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';

export interface PeriodicElement {
  doc_name: string;
  sent_doc_name: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { doc_name: 'test-document.pdf', sent_doc_name: 'test-document.pdf', },
];

export interface PeriodicElement1 {
  trans_mode: string;
  date_time: string;
  status: string;
  log: string;
}
const ELEMENT_DATA1: PeriodicElement1[] = [
  { trans_mode: 'sample data', date_time: 'sample data', status: 'sample data', log: 'sample data', },
  { trans_mode: 'sample data', date_time: 'sample data', status: 'sample data', log: 'sample data', },
];

export interface PeriodicElement12 {
  call_date_time: string;
  caller: string;
  callee: string;
  called_name: string;
  notes: string;
}
const ELEMENT_DATA2: PeriodicElement12[] = [
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
 { call_date_time: '02-02-2020 10.00 AM', caller: 'Venkatesan', callee: 'Rajan', called_name: 'Venkatesan', notes: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry', },
];
@Component({
  selector: 'app-service-request-details',
  templateUrl: './service-request-details.component.html',
  styleUrls: ['./service-request-details.component.scss']
})
export class ServiceRequestDetailsComponent implements OnInit {
  displayedColumns: string[] = ['doc_name', 'sent_doc_name',];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['trans_mode', 'date_time', 'status', 'log'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['call_date_time', 'caller', 'callee', 'called_name', 'notes'];
  dataSource2 = ELEMENT_DATA2;
  constructor(public dialog: MatDialog) {

   }
   openDialog(): void {
    const dialogRef = this.dialog.open(ServiceDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

  ngOnInit() {
  }

}


@Component({
  selector: 'service-dialog',
  templateUrl: 'service-dialog.html',
})

export class ServiceDialog {

  constructor(
    public dialogRef: MatDialogRef<ServiceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}