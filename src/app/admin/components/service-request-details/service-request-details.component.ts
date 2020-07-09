import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { MatTableDataSource } from '@angular/material';
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
  displayedColumns: string[] = ['transmitted_file_name', 'file_name',];
  dataSource: any;
  displayedColumns1: string[] = ['document_transmission_type', 'createdAt', 'transmission_status', 'transmission_message'];
  dataSource1: any;
  displayedColumns2: string[] = ['call_date_time', 'caller', 'callee', 'called_name', 'notes'];
  dataSource2 = ELEMENT_DATA2;
  serviceRequestDetails: any;
  requestDocuments = [];
  transmissions = [];
  followupCalls = [];
  isLoading = false;
  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) {
    this.isLoading = true;
    this.route.params.subscribe(param => {
      if (param.id) {
        this.userService.getServiceRequest(param.id).subscribe(res => {
          this.serviceRequestDetails = res.service_request;
          this.requestDocuments = res.service_request_doc;
          this.transmissions = res.service_request_transmission;
          this.dataSource1 = new MatTableDataSource(this.transmissions)
          this.dataSource = new MatTableDataSource(this.requestDocuments)
          this.followupCalls = res.service_request_followup_calls;
          this.isLoading = false;
        })
      }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let data = {
        "date_of_call": "1234567890",
        "notes": "test notes",
        "service_provider_id": "1",
        "on_demand_service_req_id": "60",
        "service_provider_contact_number": "8889900000",
        "service_provider_contact_person": "Kadhir"
      }
      this.userService.followupCreate(data).subscribe(res => {
        console.log(res)
      })
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}