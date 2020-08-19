import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import * as globals from '../../../../globals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { formatDate } from '@fullcalendar/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { NGXLogger } from 'ngx-logger';
@Component({
  selector: 'app-billing-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingCorrespondanceComponent implements OnInit {
  displayedColumns: string[] = ['select', 'form_name'];
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  default_select = globals.default_select
  sentDocuments: any = new MatTableDataSource([]);
  documents: any = new MatTableDataSource([]);
  recipients: any = new MatTableDataSource([]);
  dataSource3: any = new MatTableDataSource([]);
  columnsToDisplay = [];
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;
  displayedColumns1: string[] = ['select', 'recipient_type'];
  selection1 = new SelectionModel<any>(true, []);
  claim_id: any;
  billableId: any;
  isLoading: boolean = false;
  correspondData: any;
  statusBarValues = { value: null, status: '', class: '' }
  constructor(private logger: NGXLogger, private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private onDemandService: OnDemandService, public dialog: MatDialog, private alertService: AlertService) {
    this.route.params.subscribe(params => {
      this.claim_id = params.id;
      this.billableId = params.billId;
      this.getData();
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName = ["File Name", "Action", "Date", "Recipients", "Download"]
        this.columnsToDisplay = ['file_name', 'action', "date", "recipients", 'download']
      }
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName1 = ["", "File Name", "Download"]
        this.columnsToDisplay1 = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName1 = ["File Name", "Action", "Date", "Recipients", "Download"]
        this.columnsToDisplay1 = ['file_name', 'action', "date", "recipients", 'download']
      }
    })
  }
  getData() {
    this.selection.clear();
    this.selection1.clear();
    this.onDemandService.getCorrespondingData(this.claim_id, this.billableId).subscribe(res => {
      this.correspondData = res;
      res.documets.map(doc => {
        if (doc.is_mandatory) {
          this.selection.select(doc)
        }
      })
      this.logger.log(res.recipient);
      this.documents = new MatTableDataSource(res.documets);
      this.recipients = new MatTableDataSource(res.recipient);
      this.statusBarChanges(this.correspondData.on_demand_status)
    })
  }
  isAllSelected() {
    if (!this.isLoading) {
      const numSelected = this.selection.selected.length;
      const numRows = this.documents.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.documents.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.form_name + 1}`;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected1() {
    if (this.recipients.data) {
      const numSelected = this.selection1.selected.length;
      const numRows = this.recipients.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection1. */
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.recipients.data.forEach(row => this.selection1.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel1(row?: any): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.recipient_type + 1}`;
  }
  isEditRecipient: boolean = false;
  editRecipient(element) {
    this.isEditRecipient = true;
    const dialogRef = this.dialog.open(CustomRecipient, {
      width: '800px',
      data: { claim_id: this.claim_id, billable_id: this.billableId, data: element, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CustomDocuments, {
      width: '800px',
      data: { claim_id: this.claim_id, billable_id: this.billableId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onDemandService.uploadDocument(result).subscribe(res => {
        if (res.status) {
          this.alertService.openSnackBar(res.message, "success");
          this.getData();
        } else {
          this.alertService.openSnackBar(res.message, "error");
        }
      })
      // if (result) {
      //   this.getData();
      // }
      // this.animal = result;
    });
  }
  openCustomRecipient(): void {
    const dialogRef = this.dialog.open(CustomRecipient, {
      width: '800px',
      data: { claim_id: this.claim_id, billable_id: this.billableId, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }
  ngOnInit() {
  }
  downloadForms(sign) {
    if (this.selection.selected.length > 0 && this.selection1.selected.length > 0) {
      let signHide = false;
      if (sign) {
        signHide = sign;
      }
      let documents_ids: any = [];
      let custom_documents_ids: any = [];
      this.selection.selected.map(res => {
        if (res.doc_type == "custom") {
          custom_documents_ids.push(res.id)
        } else {
          documents_ids.push(res.id)
        }
      })
      let recipientsDocuments_ids: any = [];
      let recipientsCustom_documents_ids: any = [];
      this.selection1.selected.map(res => {
        if (res.type == "custom") {
          recipientsCustom_documents_ids.push(res.id)
        } else {
          recipientsDocuments_ids.push(res.id)
        }
      })
      let docDeatils = {
        documents_ids: documents_ids,
        custom_documents_ids: custom_documents_ids,
        recipients_ids: recipientsDocuments_ids,
        custom_recipients_ids: recipientsCustom_documents_ids,
        hide_sign: signHide
      }
      this.onDemandService.downloadCorrespondanceForm(this.claim_id, this.billableId, docDeatils).subscribe(res => {
        if (res.status) {
          //this.alertService.openSnackBar(res.message, "success");
          let data = res.data;
          documents_ids = [];
          custom_documents_ids = [];
          recipientsDocuments_ids = [];
          recipientsCustom_documents_ids = [];
          this.selection.clear();
          this.selection1.clear();
          this.download(res.data.file_url, res.data.file_name);
        } else {
          this.alertService.openSnackBar(res.message, "error");
        }
      })
    }else{
      this.alertService.openSnackBar('Please select Document(s) & Recipient(s) ', "error");
    }
  }
  download(url, name) {
    saveAs(url, name, '_self');
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }

  }

  allOrNone(status) {
    if (!status) {
      this.selection.clear()
    } else {
      this.documents.data.forEach(row => this.selection.select(row))
    }
  }
  allOrNone1(status) {
    if (!status) {
      this.selection1.clear()
    } else {
      this.recipients.data.forEach(row => this.selection1.select(row))
    }
  }
  expandId1: any;
  openElement1(element) {
    if (this.isMobile) {
      this.expandId1 = element.id;
    }

  }
  removeCustomDocument(element) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: "delete", address: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.onDemandService.removeDocument(element.id).subscribe(res => {
          if (res.status) {
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
  deleteRecipient(element) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: "delete" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.onDemandService.removeRecipient(element.id).subscribe(res => {
          if (res.status) {
            this.getData();
            this.alertService.openSnackBar(res.message, "success")
          } else {
            this.alertService.openSnackBar(res.message, "error")
          }
        });
      } else {
        return;
      }
    });
  }

  statusBarChanges(status) {
    switch (status) {
      case 'Not Sent':
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
        this.statusBarValues = { value: 0, status: 'Error', class: '.error' }
        break;
    }
  }

}

@Component({
  selector: 'custom-documents',
  templateUrl: 'custom-documents.html',
})
export class CustomDocuments {
  claim_id: any;
  billable_id: any;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  constructor(
    private logger: NGXLogger,
    public dialogRef: MatDialogRef<CustomDocuments>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private alertService: AlertService, private onDemandService: OnDemandService) {
    dialogRef.disableClose = true;
    this.claim_id = data['claim_id'];
    this.billable_id = data['billable_id'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedFile: File;
  selectedFiles: FileList;
  file: any = [];
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar("This file too long", 'error');
          return;
        }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
        this.logger.info(this.file)
      } else {
        //this.selectedFile = null;
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }

  }
  isUploading = false;
  uploadFile() {
    if (!this.selectedFile) {
      this.alertService.openSnackBar("Please select file", 'error');
      return;
    }
    this.isUploading = true;
    let formData = new FormData()
    formData.append("document_category_id", "10");
    formData.append('claim_id', this.claim_id);
    formData.append('bill_item_id', this.billable_id);
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file', this.selectedFiles[i]);
    }
    this.dialogRef.close(formData);
  }
}
@Component({
  selector: 'custom-recipient',
  templateUrl: 'custom-recipient.html',
})
export class CustomRecipient {
  customReceipient: any;
  states: any = [];
  claim_id: any;
  billable_id: any;
  isEdit: any = false;
  recipientData = {};
  constructor(
    public dialogRef: MatDialogRef<CustomRecipient>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, private claimService: ClaimService,
    private alertService: AlertService, private onDemandService: OnDemandService) {
    dialogRef.disableClose = true;
    this.claim_id = data['claim_id'];
    this.billable_id = data['billable_id'];
    this.isEdit = data['isEdit'];
    this.claimService.seedData("state").subscribe(res => {
      this.states = res.data;
    })
  }
  ngOnInit() {
    this.customReceipient = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      street1: [null],
      street2: [null],
      city: [null],
      state_id: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
    })
    if (this.isEdit) {
      this.customReceipient.patchValue(this.data["data"]);
    }
  }
  saveClick() {
    Object.keys(this.customReceipient.controls).forEach((key) => {
      if (this.customReceipient.get(key).value && typeof (this.customReceipient.get(key).value) == 'string')
        this.customReceipient.get(key).setValue(this.customReceipient.get(key).value.trim())
    });
    if (this.customReceipient.invalid) {
      return
    }
    this.onDemandService.createCustomRecipient(this.claim_id, this.billable_id, this.customReceipient.value).subscribe(res => {
      if (res.status) {
        this.alertService.openSnackBar(res.message, "success");
        this.dialogRef.close(res)
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}