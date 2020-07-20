import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
export interface PeriodicElement1 {
  file_name: string;
  date: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { file_name: "Appointment Notification Letter", date: "01-02-2020" },
  { file_name: "QME 110 - QME Appointment Notification Form", date: "01-02-2020" },
  { file_name: "QME 122 - AME or QME Declaration of Service of…", date: "01-02-2020" }
];

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  displayedColumns1: string[] = ['file_name', 'date', 'action'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns = ['doc_image', 'doc_name', 'date', 'action'];
  dataSource: any = [];
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  xls = globals.xls
  xls_1 = globals.xls_1
  docx = globals.docx
  pdf = globals.pdf
  isMobile: boolean;
  claim_id: any;
  examinationDetails: any;
  collapsed = false;
  docCollapsed = false;
  noteCollapsed = false;
  documentType: any;
  documentList: any;
  documentTabData: any;
  filterValue: String;
  tabIndex = 0;
  notes: any = null;
  noteDisable: boolean = false;
  saveButtonStatus: boolean = false;
  forms = [
    { name: "QME-110", group: "QME", value: "110" },
    { name: "QME-122", group: "QME", value: "122" },
    { name: "DWCCA-10232_1", group: "DWCCA", value: "10232_1" },
    { name: "DWCCA-10232_2", group: "DWCCA", value: "10232_2" },
    { name: "DEU-100", group: "DEU", value: "100" },
    { name: "DEU-101", group: "DEU", value: "101" },
    { name: "QME-121", group: "QME", value: "121" },
    { name: "QME-AME Appointment Notification", group: "QME/AME", value: "notification" },
    { name: "SBR-1", group: "DWC", value: "SBR_1" },
    { name: "IBR-1", group: "DWC", value: "IBR_1" },
    { name: "QME-111", group: "QME", value: "111" },
    { name: "QME-112", group: "QME", value: "112" },
    { name: "DWCAD-1013336", group: "DWCAD", value: "1013336" },
    { name: "QME-123", group: "QME", value: "123" },
    // { name: "DEU-100 Spanish", group: "DEU", value: "S100" },
    // { name: "DEU-111", group: "DEU", value: "111" },
    // { name: "QME-111", group: "QME", value: "111" },
    // { name: "DWC-AD-10133.36", group: "DWC", value: "10133" },
    // { name: "DWC-SBR-1", group: "DWC", value: "SBR-1" },
    // { name: "DWC-IBR-1", group: "DWC", value: "IBR-1" },
    // { name: "QME-112", group: "QME", value: "112" },
    // { name: "QME-123", group: "QME", value: "123" },
    // { name: "QME-123-Instructions", group: "QME", value: "123-I" },
  ]
  formId = "";
  examiner_id = "";
  billableId: number;
  constructor(public dialog: MatDialog, private examinerService: ExaminerService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.route.params.subscribe(params => {
      this.claim_id = params.id;
      this.billableId = params.billId
    });
  }

  ngOnInit() {
    this.examinerService.getAllExamination(this.claim_id, this.billableId).subscribe(response => {
      this.examiner_id = response.data.appointments.examiner_id;
      this.examinationDetails = response['data']
      this.getDocumentData();
      if (response['data'].exam_notes) {
        this.notes = response['data'].exam_notes;
      } else {
        this.saveButtonStatus = true;
      }
    }, error => {
      console.log(error);
      this.dataSource = new MatTableDataSource([]);
    })

    this.examinerService.seedData('document_category').subscribe(type => {
      this.documentList = type['data']
    })
  }

  getDocumentData() {
    this.examinerService.getDocumentData(this.claim_id, this.billableId).subscribe(res => {
      this.documentTabData = res['data'];
      this.tabChanges(this.tabIndex)
    }, error => {
      console.log(error);
      this.dataSource = new MatTableDataSource([]);
    })
  }

  tabChanges(event) {
    this.tabIndex = event
    this.filterValue = '';
    this.dataSource = new MatTableDataSource([])
    let data = this.documentTabData ? this.documentTabData[this.tabNames(event)] : []
    this.dataSource = new MatTableDataSource(data)
  }

  tabNames(index) {
    switch (index) {
      case 0:
        return 'form';
      case 1:
        return 'history';
      case 2:
        return 'records';
      case 3:
        return 'report'
      case 4:
        return 'transcription';
      default:
        return 'form';
    }

  }

  selectedFile: File;
  uploadFile(event) {
    this.selectedFile = null;
    if (!this.documentType) {
      this.alertService.openSnackBar("Please select Document type", 'error');
      return;
    }
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'mp3']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.selectedFile = event.target.files[0];
      let formData = new FormData()
      formData.append('file', this.selectedFile);
      formData.append('document_type_id', this.documentType);
      formData.append('claim_id', this.claim_id);
      formData.append('bill_item_id', this.billableId.toString());
      console.log(" this.selectedFile", this.selectedFile);
      this.examinerService.postDocument(formData).subscribe(res => {
        this.selectedFile = null;
        this.fileUpload.nativeElement.value = "";
        this.documentType = null;
        this.getDocumentData();
        this.alertService.openSnackBar("File added successfully!", 'success');
      }, error => {
        this.fileUpload.nativeElement.value = "";
        this.selectedFile = null;
      })
    } else {
      this.selectedFile = null;
      //this.errorMessage = 'This file type is not accepted';
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }

  download(data) {
    saveAs(data.exam_report_file_url, data.file_name);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteDocument(data) {
    this.openDialog('delete', data);
  }
  formChanges(event) {

  }
  generateForm() {
    if (this.formId) {
      let formPre = "";
      this.forms.map(res => {
        if (res.value == this.formId) {
          formPre = res.group;
        }
      })
      let claim_id: any;
      if (this.formId == "notification" || this.formId == "111") {
        claim_id = this.claim_id + "/" + this.examiner_id;
      } else {
        claim_id = this.claim_id;
      }
      this.examinerService.getForms(claim_id, this.formId, formPre, this.billableId).subscribe(res => {
        let data = this.dataSource.data;
        data.push(res.data);
        this.dataSource = new MatTableDataSource(data)
      })
    } else {
      this.alertService.openSnackBar('Please select a form', 'error');
    }
  }
  noteSubmit(note) {
    console.log(note);
    let data = {
      // "claim_id": this.examinationDetails.claim_details.id,
      // "appointment_id": this.examinationDetails.appointments.id,
      "exam_notes": note,
      "bill_item_id": this.billableId
    }
    this.examinerService.postNotes(data).subscribe(res => {
      this.alertService.openSnackBar("Note added successfully!", 'success');
      this.saveButtonStatus = false;
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })

  }

  noteCancel() {
    this.saveButtonStatus = false;
    this.notes = this.examinationDetails.exam_notes
  }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.examinerService.deleteDocument(data.id).subscribe(res => {
          console.log(res['data']);
          this.getDocumentData();
          this.alertService.openSnackBar("File deleted successfully!", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }



  openClaimant(): void {
    const dialogRef = this.dialog.open(ClaimantPopupComponent, {
      width: '800px',
      data: this.examinationDetails,

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openClaim(): void {
    const dialogRef = this.dialog.open(ClaimPopupComponent, {
      width: '800px',
      data: this.examinationDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openBillableItem() {
    const dialogRef = this.dialog.open(BillableitemPopupComponent, {
      width: '800px',
      data: this.examinationDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
@Component({
  selector: 'claimant-dialog',
  templateUrl: 'claimant-dialog.html',
})
export class ClaimantPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ClaimantPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'claim-dialog',
  templateUrl: 'claim-dialog.html',
})
export class ClaimPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ClaimPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'billableitem-dialog',
  templateUrl: 'billableitem-dialog.html',
})
export class BillableitemPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<BillableitemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
