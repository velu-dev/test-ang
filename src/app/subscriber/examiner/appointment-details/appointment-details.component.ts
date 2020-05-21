import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  displayedColumns = ['doc_image', 'doc_name', 'date', 'action'];
  dataSource: any = [];
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  xls = globals.xls
  xls_1 = globals.xls_1
  docx = globals.docx
  pdf = globals.pdf
  isMobile: boolean;
  claim_id: number;
  examinationDetails: any;
  collapsed = false;
  documentType: any;
  documentList: any;
  documentTabData: any;
  constructor(public dialog: MatDialog, private examinerService: ExaminerService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.route.params.subscribe(params => this.claim_id = params.id);
  }

  ngOnInit() {
    this.examinerService.getAllExamination(this.claim_id).subscribe(response => {

      this.examinationDetails = response['data']
      console.log(this.examinationDetails);
      this.getDocumentData();
    }, error => {
      console.log(error);
    })

    this.examinerService.seedData('document_type').subscribe(type => {
      this.documentList = type['data']
      console.log(this.documentList)
    })
  }

  getDocumentData() {
    this.examinerService.getDocumentData(this.examinationDetails.claim_details.id).subscribe(res => {
      console.log(res['data']);
      this.documentTabData = res['data'];
      this.tabChanges(0)
    }, error => {
      console.log(error);
    })
  }

  tabChanges(event) {
    this.dataSource = new MatTableDataSource([])
    let data = this.documentTabData[this.tabNames(event)]
    this.dataSource = new MatTableDataSource(data)
  }

  tabNames(index) {
    switch (index) {
      case 0:
        return 'claim_forms';
      case 1:
        return 'claim_history';
      case 2:
        return 'record_template';
      case 3:
        return 'examiner_report'
      case 4:
        return 'examination_transcription';
      default:
        return 'claim_forms';
    }

  }

  selectedFile: File;
  uploadFile(event) {
    this.selectedFile = null;
    console.log(this.documentType)
    if (!this.documentType) {
      this.alertService.openSnackBar("Please select Document type", 'error');
      return;
    }
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

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
      formData.append('claim_id', this.examinationDetails.claim_details.id)
      console.log(" this.selectedFile", this.selectedFile);
      this.examinerService.postDocument(formData).subscribe(res => {
        this.selectedFile = null;
        this.fileUpload.nativeElement.value = "";
        this.getDocumentData();
        this.alertService.openSnackBar("File added successfully", 'success');
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
