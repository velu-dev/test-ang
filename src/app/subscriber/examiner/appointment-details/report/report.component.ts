import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { saveAs } from 'file-saver';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IntercomService } from 'src/app/services/intercom.service';
import * as moment from 'moment-timezone';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportComponent implements OnInit {

  displayedColumns: string[] = ['select', 'file_name', 'simple_service_origin', 'action'];
  dataSource: any = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  columnsToDisplay = [];
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;
  paramsId: any;
  dataSoruceOut: any;
  dataSoruceIn: any;
  rushRequest: any;
  reportData: any;
  documentList: any = [];
  documentType: any = 6;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  statusBarValues = { value: null, status: '', class: '' }
  claim_id: any;
  billable_item_id: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  progress: number = 0;
  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public dialog: MatDialog,
    public claimService: ClaimService,
    private onDemandService: OnDemandService,
    private intercom: IntercomService,
    private cookieService: CookieService) {


    this.route.params.subscribe(param => {
      console.log(param)
      this.paramsId = param;
      this.claim_id = param.claim_id;
      this.billable_item_id = param.billId;
      let ids = {
        claimant_id: param.claimant_id,
        claim_id: param.claim_id,
        billable_item_id: param.billId
      }
      this.onDemandService.getBreadcrumbDetails(ids).subscribe(details => {
        this.intercom.setClaimant(details.data.claimant.first_name + ' ' + details.data.claimant.last_name);
        this.cookieService.set('claimDetails', details.data.claimant.first_name + ' ' + details.data.claimant.last_name)
        this.intercom.setClaimNumber(details.data.claim_number);
        this.cookieService.set('claimNumber', details.data.claim_number)
        this.intercom.setBillableItem(details.data.exam_procedure_name);
        this.cookieService.set('billableItem', details.data.exam_procedure_name)
      }, error => {

      })
    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name"]
        this.columnsToDisplay = ['is_expand', 'file_name']
      } else {
        this.columnName = ["Ref #", "Transcriptionist", "File Name", "Action", "Rush Request?", "Document" + '\n' + "Lines", "Date Requested", "Date Received", "Download Submitted" + '\n' + "Items", "Download Compiled" + '\n' + "Document", "Further Information"]
        this.columnsToDisplay = ['request_reference_id', 'document_produced_by', 'file_name', 'actions', 'service_priority', "document_lines", "date_of_request", "date_of_communication", 'download', 'download1', 'further_info']
      }
    })
    // this.isHandset$.subscribe(res => {
    //   this.isMobile = res;
    //   if (res) {
    //     this.columnName1 = ["", "File Name", "Download"]
    //     this.columnsToDisplay1 = ['is_expand', 'file_name', 'download']
    //   } else {
    //     this.columnName1 = ["File Name", "Rush Request?", "Date Requested", "Date Received", "Download"]
    //     this.columnsToDisplay1 = ['file_name', 'service_priority', "date_of_request", "date_of_communication", 'download']
    //   }
    // })
  }


  ngOnInit() {
    this.getReport();
    // this.onDemandService.seedData('document_category').subscribe(type => {
    //   type.data.map(data => {
    //     if (data.id == 6 || data.id == 7) {
    //       this.documentList.push(data);
    //     }
    //   })
    //   this.documentType = 6;
    // })
    this.styleElement = document.createElement("style");
    this.changeColors("#E6E6E6");
  }
  styleElement: HTMLStyleElement;
  changeColors(color) {
    color = color ? color : "#E6E6E6";
    const head = document.getElementsByTagName("head")[0];
    const css = `
  .progress .mat-progress-bar-fill::after {
    background-color: ${color} !important;
  }  `;
    this.styleElement.innerHTML = "";
    this.styleElement.type = "text/css";
    this.styleElement.appendChild(document.createTextNode(css));
    head.appendChild(this.styleElement);
  }
  is_cancellation = false;
  getReport() {
    this.onDemandService.getTranscription(this.paramsId.claim_id, this.paramsId.billId).subscribe(report => {
      this.is_cancellation = report.is_cancellation;
      this.reportData = report;
      this.changeColors(report.on_demand_status_color_code);
      this.dataSource = new MatTableDataSource(report.documents)
      let inFile = [];
      let outFile = [];
      // report.documents_sent_and_received.map(file => {
      //   if (file.transmission_direction == 'IN') {
      //     inFile.push(file)
      //   } else {
      //     outFile.push(file)
      //   }

      // })
      this.dataSoruceOut = new MatTableDataSource(report.documents_sent_and_received);
      this.dataSoruceIn = new MatTableDataSource(inFile);
      this.dataSoruceOut.sort = this.sort;
      this.rushRequest = false;
      this.statusBarChanges(this.reportData.on_demand_status)
    }, error => {
      this.dataSource = new MatTableDataSource([]);
      this.dataSoruceOut = new MatTableDataSource([]);
      this.dataSoruceIn = new MatTableDataSource([])
    })
    this.allOrNone(false);
  }

  statusBarChanges(status) {
    switch (status) {
      case 'Unsent':
        this.statusBarValues = { value: 0, status: status, class: 'not-sent' }
        break;
      case 'In Progress':
        this.statusBarValues = { value: 50, status: status, class: 'sent' }
        break;
      case 'Completed':
        this.statusBarValues = { value: 100, status: status, class: 'complete' }
        break;
      case 'Error':
        this.statusBarValues = { value: 50, status: status, class: 'error' }
        break;

      default:
        this.statusBarValues = { value: 50, status: 'Error', class: 'error' }
        break;
    }
  }

  expandIdOut: any;
  expandIdIn: any;
  openElementOut(element) {
    if (this.isMobile) {
      this.expandIdOut = element.document_id;
    }

  }

  openElementIn(element) {
    if (this.isMobile) {
      this.expandIdIn = element.document_id;
    }
  }

  selectedFiles: FileList;
  selectedFile: File;
  formData = new FormData()
  file: any = [];
  errors = { file: { isError: false, error: "" } }
  addFile(event) {

    this.selectedFile = null;
    this.file = [];
    this.selectedFiles = null
    this.selectedFiles = event.target.files;
    let fileTypes = ['pdf', 'doc', 'docx', 'mp3', 'wav', 'm4a', 'wma', 'dss', 'ds2', 'dct'];


    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 3073) {
          this.fileUpload.nativeElement.value = "";
          this.errors.file.isError = true;
          this.errors.file.error = "File size is too large";
          //this.alertService.openSnackBar("File size is too large", 'error');
          return;
        }
        this.errors = { file: { isError: false, error: "" } }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
      } else {
        this.selectedFile = null;
        this.selectedFiles = null
        this.fileUpload.nativeElement.value = "";
        this.errors.file.isError = true;
        this.file = []
        this.errors.file.error = "This file type is not accepted";
        //this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }
  }
  openPopupDialogue() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { isMultiple: true, fileType: ['.pdf', '.doc', '.docx', '.mp3', '.wav', '.m4a', '.wma', '.dss', '.ds2', '.dct'], fileSize: 3073 },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.selectedFiles = result.files;
        result.files.map(res => {
          this.selectedFile = res;
          this.file.push(res.name);
        })
        this.uploadFile();
      }
    })

  }
  uploadFile() {
    if (!this.selectedFile) {
      //this.alertService.openSnackBar("Please select file", 'error');
      this.errors.file.isError = true;
      this.errors.file.error = "Please select a file";
      return;
    }
    this.formData = new FormData();
    // this.formData.append('file', this.selectedFile);
    this.formData.append('document_category_id', '6');
    this.formData.append('claim_id', this.paramsId.claim_id.toString());
    this.formData.append('bill_item_id', this.paramsId.billId.toString());
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.formData.append('file', this.selectedFiles[i]);
    }
    this.onDemandService.postDocument(this.formData).subscribe((event: HttpEvent<any>) => {
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          this.selectedFile = null;
          this.selectedFiles = null;
          // this.fileUpload.nativeElement.value = "";
          this.formData = new FormData();
          this.file = [];
          this.getReport();
          this.errors = { file: { isError: false, error: "" } }
          this.alertService.openSnackBar("File added successfully", 'success');
        }
      }
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      this.selectedFiles = null;
      this.file = [];
    })
  }

  async multipleDownload() {
    if (this.selection.selected.length == 0) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return
    }
    // this.selection.selected.map(res => {
    //   saveAs(res.file_url, res.file_name);
    // })

    // for (let i = 0; i < this.selection.selected.length; i++) {
    //   saveAs(this.selection.selected[i].file_url, this.selection.selected[i].file_name, '_self');
    //   await new Promise(r => setTimeout(r, 1000));
    // }

    let document_ids = []
    let custom_documents_ids = [];
    this.selection.selected.map(res => {
      if (res.form_number) {
        document_ids.push(res.document_id)
      } else {
        custom_documents_ids.push(res.document_id)
      }
    })

    // if (document_ids.length == 1) {
    //   saveAs(this.selection.selected[0].file_url, this.selection.selected[0].file_name, '_self');
    //   this.alertService.openSnackBar("File downloaded successfully", 'success');
    //   this.selection.clear();
    //   this.getReport();
    //   return;
    // }
    this.onDemandService.reportDownload(this.paramsId.claim_id, this.paramsId.billId, { documents_ids: document_ids, custom_documents_ids: custom_documents_ids, examiner_id: this.reportData.examiner_user_id }).subscribe(record => {
      saveAs(record.data.file_url, record.data.file_name, '_self');
      this.alertService.openSnackBar("File downloaded successfully", 'success');
      this.selection.clear();
      this.getReport();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })

  }

  inOutdownload(data, element, status?) {
    console.log(data)
    this.claimService.updateActionLog({ type: "report", "document_category_id": 6, "claim_id": this.claim_id, "billable_item_id": this.billable_item_id, "documents_ids": [element.document_id] }).subscribe(res => {
    })
    if (status == 'received') {
      let sendData: any;
      let d_ids = []
      data.map(dd => {
        d_ids.push(dd.document_id)
      })
      sendData = {
        "claim_id": this.paramsId.claim_id,
        "billable_item_id": this.paramsId.billId,
        "document_category_id": 6,
        "on_demand_service_request_id": element.id,
        "documents_ids": d_ids
      }
      this.onDemandService.getZipFile(sendData).subscribe(res => {
        saveAs(res.file_url, res.file_name);
      })
    } else {
      saveAs(data.file_url, data.file_name);
    }
  }

  onDemandSubmit() {
    // return;
    let document_ids = []
    let custom_documents_ids = []
    this.selection.selected.map(res => {
      if (res.form_number) {
        document_ids.push(res.document_id)
      } else {
        custom_documents_ids.push(res.document_id)
      }
    })
    if (document_ids.length == 0) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return
    }
    let data = {
      claim_id: this.paramsId.claim_id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      service_description: "",
      documents_ids: document_ids,
      custom_documents_ids: custom_documents_ids,
      document_category_id: this.reportData.documents[0].document_category_id,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: this.reportData.documents[0].service_request_type_id,
      service_provider_id: this.reportData.documents[0].service_provider_id, // default 3
      examiner_detail_id: this.reportData.examiner_detail_id,
      examiner_user_id: this.reportData.examiner_user_id
    }
    this.onDemandService.requestCreate(data).subscribe(record => {
      this.alertService.openSnackBar("Transcribe and Compile created successfully", 'success');
      this.getReport();
    }, error => {
      if (typeof (error.error.message) == 'object') {
        let timezone = moment.tz.guess();
        let date = moment(error.error.message.requested_on.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
        this.alertService.openSnackBar(error.error.message.message + ' ' + date, 'error');
        return;
      }
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }


  deleteDocument(data) {
    this.openDialogDelete('delete', data);
  }

  openDialogDelete(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.original_file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.onDemandService.deleteDocument(data.document_id).subscribe(res => {
          this.getReport();
          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }

  docChange(e) {
    this.fileUpload.nativeElement.value = "";
    this.selectedFile = null;
    this.selectedFiles = null;
    this.file = [];
  }


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

  allOrNone(status) {
    if (!status) {
      this.selection.clear()
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row))
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.file_name + 1}`;
  }
}
