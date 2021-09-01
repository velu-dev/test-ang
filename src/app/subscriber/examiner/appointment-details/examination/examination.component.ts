import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { HttpEvent } from '@angular/common/http';
export interface PeriodicElement {
  name: string;
}

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExaminationComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  displayedColumns: string[] = ['select', 'form_name'];
  selection = new SelectionModel<any>(true, []);
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
  claim_id: any;
  billableId: any;
  examinationDocuments: any;
  uploadedDocument: any = new MatTableDataSource([]);
  isIME: boolean = false;
  constructor(private claimService: ClaimService, private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private ondemandService: OnDemandService, private alertService: AlertService, public dialog: MatDialog, private intercom: IntercomService,
    private cookieService: CookieService, public router: Router) {
    this.route.params.subscribe(params => {
      this.claim_id = params.claim_id;
      this.billableId = params.billId;
      let ids = {
        claimant_id: params.claimant_id,
        claim_id: params.claim_id,
        billable_item_id: params.billId
      }
      this.ondemandService.getBreadcrumbDetails(ids).subscribe(details => {
        this.intercom.setClaimant(details.data.claimant.first_name + ' ' + details.data.claimant.last_name);
        this.cookieService.set('claimDetails', details.data.claimant.first_name + ' ' + details.data.claimant.last_name)
        this.intercom.setClaimNumber(details.data.claim_number);
        this.cookieService.set('claimNumber', details.data.claim_number)
        this.intercom.setBillableItem(details.data.exam_procedure_name);
        this.cookieService.set('billableItem', details.data.exam_procedure_name);
        if (details.data && details.data.exam_procedure_name.includes('IME')) {
          this.isIME = true;
        }
        if (details.data.procedure_type == "Deposition") {
          this.router.navigate(['**']);
        } else if (details.data.procedure_type == "Supplemental") {
          this.router.navigate(['**']);
        }
      }, error => {

      })
      this.getData();
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name"]
        this.columnsToDisplay = ['is_expand', 'file_name']
      } else {
        this.columnName = ["", "File Name", "Date Uploaded", "Action"]
        this.columnsToDisplay = ['doc_image', 'file_name', "updatedAt", 'action']
      }
    })
  }
  isLoading: any = false;
  alldocuments: any;
  billingData: any;
  getData() {
    this.isLoading = true;
    this.ondemandService.getBilling(this.claim_id, this.billableId).subscribe(res => {
      this.billingData = res;
      this.examinationDocuments = new MatTableDataSource(res.documents);
      this.isLoading = false;
    }, error => {
      return
    })
    this.ondemandService.listUploadedDocs(this.claim_id, this.billableId).subscribe(res => {
      if (res.status)
        if (res.data) {
          this.alldocuments = res.data;
          this.uploadedDocument = new MatTableDataSource(res.data);
          this.uploadedDocument.sort = this.sort;
        }
    })

  }
  ngOnInit() {
  }
  downloadForms() {
    if (this.selection.selected.length == 0) {
      this.alertService.openSnackBar('Please select Document(s)', "error");
      return;
    }
    let documents_ids = []
    let custom_documents_ids = []
    this.selection.selected.map(res => {
      if (res.form_number) {
        documents_ids.push(res.id)
      } else {
        custom_documents_ids.push(res.id)
      }
    })
    let ids = { documents_ids: documents_ids, custom_documents_ids: custom_documents_ids, examiner_detail_id: this.billingData.examiner_detail_id }
    this.ondemandService.downloadBillingDoc(this.claim_id, this.billableId, ids).subscribe(res => {
      if (res.status) {
        res.data.map(data => {
          this.download(data.exam_report_file_url, data.file_name)
        })
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    })
  }
  download(url, name) {
    saveAs(url, name);
  }
  allOrNone(status) {
    if (!status) {
      this.selection.clear()
    } else {
      this.examinationDocuments.data.forEach(row => this.selection.select(row))
    }
  }
  selectedFile: File;
  selectedFiles: FileList;
  file: any = [];
  error = { status: false, message: "" };
  addFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFile = null;
    this.file = [];
    let fileTypes = ['pdf', 'doc', 'docx']
    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar("File size is too large", 'error');
          return;
        }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
        this.error.status = false;
        this.error.message = "";
      } else {
        //this.selectedFile = null;
        this.fileUpload.nativeElement.value = "";
        this.error = { status: true, message: "This file type is not accepted" };
        // this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }
  }
  openPopupDialogue() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { isMultiple: true, fileType: ['.pdf', '.doc', '.docx'], fileSize: 3073 },
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
    let formData = new FormData();
    if (!this.selectedFile) {
      this.error.status = true;
      this.error.message = "Please select a file";
      return;
    }

    // this.formData.append('file', this.selectedFile);
    formData.append('claim_id', this.claim_id);
    formData.append('bill_item_id', this.billableId.toString());
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file', this.selectedFiles[i]);
    }
    this.ondemandService.uploadExaminationDocument(formData).subscribe((event: HttpEvent<any>) => {
      let res = event['body'];
      let progress = this.ondemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          if (res.status) {
            this.alertService.openSnackBar(res.message, 'success');
            this.selectedFile = null;
            // this.fileUpload.nativeElement.value = "";
            formData = new FormData();
            this.file = [];
            // this.alldocuments.push(res.data);
            // this.uploadedDocument = new MatTableDataSource(this.alldocuments);
            // this.uploadedDocument.sort = this.sort;
            this.getData();
            this.error = { status: false, message: "" };
          }
          else {
            this.alertService.openSnackBar(res.message, "error")
          }
        }
      }
    })
  }
  downloadDocument(element) {
    this.alertService.openSnackBar("File downloaded successfully", "success");
    this.claimService.updateActionLog({ type: "examination", "document_category_id": 5, "claim_id": this.claim_id, "billable_item_id": this.billableId, "documents_ids": [element.id] }).subscribe(res => {

    })
    saveAs(element.exam_report_file_url, element.file_name, '_self');
  }
  removeDocument(element) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: "delete", address: true, title: element.file_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.ondemandService.removeDocument(element.id, 5).subscribe(res => {
          if (res.status) {
            let i = 0;
            this.alldocuments.map(dd => {
              if (dd.id == element.id) {
                this.alldocuments.splice(i, 1)
              }
              i = i + 1;
            })
            this.uploadedDocument = new MatTableDataSource(this.alldocuments);
            this.uploadedDocument.sort = this.sort;
            this.alertService.openSnackBar(res.message, "success")
            this.getData();
          } else {
            this.alertService.openSnackBar(res.message, "error")
          }
        })
      } else {
        return;
      }
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.examinationDocuments.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.examinationDocuments.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }

  }
}