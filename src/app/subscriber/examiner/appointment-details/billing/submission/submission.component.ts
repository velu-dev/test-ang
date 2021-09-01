import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { saveAs } from 'file-saver';
import { billingOnDemandDialog } from '../billing.component';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
import { IntercomService } from 'src/app/services/intercom.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { HttpEvent } from '@angular/common/http';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      state('void', style({ height: '0px', minHeight: '0' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SubmissionComponent implements OnInit {
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() review: string;
  @Input() states: string;
  @Input() billType: any;
  @Input() isIME: boolean;
  @Output() getBillingDetails = new EventEmitter();
  billDocumentList: any;
  documentsData: any = new MatTableDataSource([]);
  selectedFile: File;
  formData = new FormData()
  selectedFiles: FileList;
  errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  file: any;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  documentType: any;
  columnName2 = [];
  columnsToDisplay2 = [];
  expandedElement;
  regulation = regulation;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @Input() cancellation: boolean;
  constructor(public billingService: BillingService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private intercom: IntercomService,
    public userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private cookieService: CookieService,
    private onDemandService: OnDemandService
  ) { }

  ngOnInit() {
    this.getBillDocument();
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (this.isMobile) {
        this.columnName2 = ["", "Description"]
        this.columnsToDisplay2 = ['is_expand', 'file_name']
      } else {
        this.columnName2 = ["", "Description", "Partial Document", "Completed Document", "Action"]
        this.columnsToDisplay2 = ['doc_image', 'file_name', 'partial', 'complete', "action"]
      }
    });
  }
  is_cancellation = false;
  ngAfterContentInit() {
    this.is_cancellation = this.cancellation;
  }
  is_ondemand_created: boolean = false;
  getBillDocument() {
    this.billingService.getBillDocument(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, this.billType).subscribe(doc => {
      this.billDocumentList = doc.data
      if (doc.data) {
        this.intercom.setBillableItem(doc.data.exam_procedure_name);
        this.cookieService.set('billableItem', doc.data.exam_procedure_name)
        if (doc.data.document_list) {
          this.is_ondemand_created = doc.data.is_ondemand_created;
          this.documentsData = new MatTableDataSource(doc.data.document_list);
        }
      }
    }, error => {
      this.documentsData = new MatTableDataSource([]);
    })
  }


  addFile(file, status?) {
    this.selectedFiles = null;
    this.selectedFile = null;
    this.file = []
    this.selectedFiles = file;
    console.log(file, status)
    let fileTypes = ['pdf', 'doc', 'docx']

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB

        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar(this.selectedFiles[i].name + " file too long", 'error');
          return;
        }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
        if (status && this.selectedFiles.length == i + 1) {
          this.uploadFile(status)
        }
      } else {
        this.alertService.openSnackBar(this.selectedFiles[i].name + " file is not accepted", 'error');
        this.selectedFile = null;
        this.selectedFiles = null;
        this.fileUpload.nativeElement.value = "";
      }
    }

  }
  openUploadPopUp(isMultiple, type, data?, callback?, fileSize?) {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { name: 'make this card the default card', address: true, isMultiple: isMultiple, fileType: type, fileSize: fileSize },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        if (callback == 'addCompleteDoc') {
          this.addCompleteDoc(result.files, data)
        } else if (callback == 'addFile') {
          this.addFile(result.files, true)
        }
      }
    })
  }
  uploadFile(status?) {
    if (!this.selectedFile) {
      this.errors.file.isError = true;
      this.errors.file.error = "Please select a file";
      return;
    }
    this.formData.append('document_category_id', '8');
    this.formData.append('claim_id', this.paramsId.claim_id);
    this.formData.append('bill_item_id', this.paramsId.billId.toString());
    this.formData.append('bill_id', this.paramsId.billingId.toString());

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.formData.append('file', this.selectedFiles[i]);
    }
    // console.log(this.selectedFiles);
    // return
    this.billingService.uploadCustomDoc(this.formData).subscribe((event: HttpEvent<any>) => {
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          this.selectedFile = null;
          this.fileUpload.nativeElement.value = "";
          this.documentType = null;
          this.formData = new FormData();
          this.file = "";
          if (status) {
            this.getBillDocument();
          } else {
            //this.getDocumentData();
          }

          this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
          this.alertService.openSnackBar("File added successfully", 'success');
        }
      }
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  expandId2: any = -1;
  openElementBill(element) {
    if (this.isMobile)
      if (this.expandId2 && this.expandId2 == element) {
        this.expandId2 = null;
      } else {
        this.expandId2 = element;
      }
  }

  VMC1500Submit() {
    this.billingService.generateCMS1500Form(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, this.billType).subscribe(cms => {
      saveAs(cms.cms_1500_signed_file_url, cms.cms_1500_file_name, '_self');
      this.alertService.openSnackBar("CMS1500 generated successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  openBillOnDemand(): void {
    const dialogRef = this.dialog.open(billingOnDemandDialog, {
      width: '800px',
      data: {
        billingId: this.paramsId.billingId, claimId: this.paramsId.claim_id, billableId: this.paramsId.billId,
        states: this.states, on_demand_progress_status: this.billingData.on_demand_progress_status, is_w9_form: this.billingData.is_w9_form,
        last_bill_on_demand_request_date: this.billingData.last_bill_on_demand_request_date, billType: this.billType, is_on_demand_resubmission: this.billingData.is_on_demand_resubmission
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBillDocument()
      this.getBillingDetails.emit(true);
      this.intercom.setAttorneyAddressChanges(true);
      if (result) {
        this.intercom.setBillDocChange(true);
      }
    });
  }

  deleteDocument(data, status?) {
    this.openDialogDocument('remove', data, status);
  }

  openDialogDocument(dialogue, data, status?) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.billingService.deleteDocument(data.id).subscribe(res => {
          if (status) {
            this.getBillDocument();
          } else {
            //this.getDocumentData();
          }

          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }
  openPopup(title, value) {
    let data = this.userService.getRegulation(value)
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: title, regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  docSelectedFile: File;
  docFormData = new FormData()
  addCompleteDoc(file, pid) {
    this.docSelectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx'];
    if (fileTypes.includes(file[0].name.split('.').pop().toLowerCase())) {
      var FileSize = file[0].size / 1024 / 1024; // in MB
      if (FileSize > 501) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: file[0].name, message: "File size is too large. Contact your organization's Simplexam Admin", yes: false, ok: true, no: false, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
        })
        // this.alertService.openSnackBar(file[0].name + " file too long", 'error');
        return;
      }
      this.file = file[0].name;
      this.docSelectedFile = file[0];
      this.BillingCompleteDocSubmit(pid)
    } else {
      this.docSelectedFile = null;
      this.alertService.openSnackBar(file[0].name + " file is not accepted", 'error');
    }

  }

  BillingCompleteDocSubmit(pid) {
    this.docFormData = new FormData()
    if (pid.form_name && pid.form_name.toLowerCase() == 'report') {
      this.docFormData.append('isReportUpload', 'true');
    } else {
      this.docFormData.append('isReportUpload', 'false');
    }
    this.docFormData.append('file', this.docSelectedFile);
    this.docFormData.append('form_id', pid.id);
    this.docFormData.append('claim_id', this.paramsId.claim_id.toString());
    this.docFormData.append('bill_item_id', this.paramsId.billId.toString());
    this.billingService.postBillingCompleteDoc(this.docFormData).subscribe((event: HttpEvent<any>) => {
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          this.alertService.openSnackBar("File added successfully", 'success');
          this.getBillDocument();
        }
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  getGenerateBillingForm(id) {
    this.billingService.generateBillingForm(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, id).subscribe(billing => {
      saveAs(billing.data.exam_report_file_url, billing.data.file_name);
      this.alertService.openSnackBar("File downloaded successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  download(element) {
    this.billingService.downloadOndemandDocuments({ file_url: element.exam_report_file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      saveAs(res.signed_file_url, element.file_name);
    })
  }

  downloadMethod() {
    this.billingService.billingDownloadAll(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, this.billType, {}).subscribe(doc => {
      saveAs(doc.data.file_url, doc.data.file_name, '_self');
      this.alertService.openSnackBar("Document(s) downloaded successfully", "success");
      this.intercom.setBillDocChange(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }


}
