import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';

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
  constructor(public dialog: MatDialog, private examinerService: ExaminerService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.route.params.subscribe(params => this.claim_id = params.id);
  }

  ngOnInit() {
    this.examinerService.getAllExamination(this.claim_id).subscribe(response => {

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
    this.examinerService.getDocumentData(this.examinationDetails.claim_details.id).subscribe(res => {
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
  generateForm() {
    this.examinerService.getForms(this.claim_id).subscribe(res => {
      console.log(res)
    })
  }
  noteSubmit(note) {
    console.log(note);
    let data = {
      "claim_id": this.examinationDetails.claim_details.id,
      "appointment_id": this.examinationDetails.appointments.id,
      "exam_notes": note
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
