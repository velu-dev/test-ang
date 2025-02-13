import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { MatTableDataSource, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
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
export interface PeriodicElement3 {
  document_name: string;
  received_doc_name: string;
}
const ELEMENT_DATA3: PeriodicElement3[] = [
  { document_name: 'sample data', received_doc_name: 'sample data' },
  { document_name: 'sample data', received_doc_name: 'sample data', },
  { document_name: 'sample data', received_doc_name: 'sample data', },
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
  displayedColumns: string[] = ['transmitted_file_name', 'file_name'];
  receivedDocumentdisplayedColumns: string[] = ['transmitted_file_name', 'file_name'];
  requestDocuments: any;
  receivedDocuments: any;
  displayedColumns1: string[] = ['document_transmission_type', 'createdAt', 'transmission_status', 'transmission_message'];
  dataSource1: any;
  displayedColumns2: string[] = ['date_of_call', 'first_name', 'service_provider_contact_person', 'service_provider_contact_number', 'notes'];
  dataSource2: any;
  displayedColumns3: string[] = ['document_name', 'received_doc_name',];
  dataSource3 = ELEMENT_DATA3;
  serviceRequestDetails: any;
  processedZipFileName: any;
  transmissions = [];
  followupCalls = [];
  isLoading = false;
  user: any;
  service_request_id: any;
  requestResponseDocuments: any = new MatTableDataSource([])
  displayedColumnsReqRes: string[] = ['file_name', 'received_on', 'status', 'download'];
  constructor(private cookieService: CookieService, private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) {
    this.user = JSON.parse(this.cookieService.get('user'));
    this.isLoading = true;
    this.route.params.subscribe(param => {
      if (param.id) {
        this.service_request_id = param.id;
        this.getData();
      }
    })

  }
  getData() {
    this.userService.getServiceRequest(this.service_request_id).subscribe(res => {
      this.serviceRequestDetails = res.service_request;
      if (this.serviceRequestDetails.service_request_type == 'Record Review' || this.serviceRequestDetails.service_request_type == 'Transcription') {
        this.receivedDocumentdisplayedColumns = ['transmitted_file_name', 'date_of_communication', 'document_produced_by', 'document_lines', 'file_name'];
      }
      if (res.service_request && res.service_request.service_request_type_id == 5) {
        this.displayedColumnsReqRes = ['file_name', 'workcompedi_bill_id', 'received_on', 'status', 'download'];
      } else {
        this.displayedColumnsReqRes = ['file_name', 'received_on', 'status', 'download'];
      }
      let requestDocuments = [];
      let receivedDocument = [];
      this.processedZipFileName = res.service_request_doc && res.service_request_doc.length > 0 ? res.service_request_doc[0].processed_zip_file_name : null;
      res.service_request_doc.map(doc => {
        if (doc.transmission_direction == 'OUT') {
          requestDocuments.push(doc)
        } else {
          receivedDocument.push(doc)
        }
      })
      this.transmissions = res.service_request_transmission;
      this.dataSource1 = new MatTableDataSource(this.transmissions)
      this.requestDocuments = new MatTableDataSource(requestDocuments);
      console.log(receivedDocument)
      this.receivedDocuments = new MatTableDataSource(receivedDocument)
      this.followupCalls = res.service_request_followup_calls;
      this.dataSource2 = new MatTableDataSource(this.followupCalls)
      this.isLoading = false;
      this.requestResponseDocuments = new MatTableDataSource(res.service_request_response)
    })
  }
  ngOnInit() {

  }

  download(data) {
    saveAs(data.url, data.file_name, '_self');
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceDialog, {
      width: '800px',
      data: { service_provider_name: (this.user.first_name + " " + this.user.last_name), service_provider_id: this.user.id, on_demand_service_req_id: this.serviceRequestDetails.id, caler_name: this.serviceRequestDetails.service_provider }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }
}
export const MY_CUSTOM_FORMATS = {
  parseInput: 'MM-DD-YYYY hh:mm A Z',
  fullPickerInput: 'MM-DD-YYYY hh:mm A Z',
  datePickerInput: 'MM-DD-YYYY hh:mm A Z',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};


@Component({
  selector: 'service-dialog',
  templateUrl: 'service-dialog.html',
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

  ]
})

export class ServiceDialog {
  followUp: FormGroup;
  service_provider_name: any;
  constructor(private userService: UserService,
    public dialogRef: MatDialogRef<ServiceDialog>, private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) {
    this.service_provider_name = data['service_provider_name']
    this.followUp = this.formBuilder.group({
      date_of_call: [null],
      notes: [null],
      service_provider_id: [null],
      on_demand_service_req_id: [null],
      service_provider_contact_number: [null, Validators.compose([Validators.pattern('[0-9]{0,15}')])],
      service_provider_contact_person: [null]
    });
  }
  followUpSubmit() {
    if (this.followUp.invalid) {
      return;
    }
    this.userService.followupCreate(this.followUp.value).subscribe(res => {
      this.alertService.openSnackBar("Followup call created successfully", 'success');
      this.dialogRef.close(res)
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.followUp.patchValue({
      service_provider_id: this.data['service_provider_id'],
      on_demand_service_req_id: this.data['on_demand_service_req_id']
    })
  }
  pickerOpened(type) { }
}