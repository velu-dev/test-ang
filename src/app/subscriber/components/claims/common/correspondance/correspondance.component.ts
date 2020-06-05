import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { saveAs } from 'file-saver';

export interface PeriodicElement {
  name: string;
  uploaded_on: string;
  action: string;
}
@Component({
  selector: 'app-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss']
})
export class CorrespondanceComponent implements OnInit {
  displayedColumns: string[] = ['name', 'uploaded_on', 'action'];
  correspondance: FormGroup;
  @Input('state') states;
  correspondForm: FormGroup;
  correspondenceSource: any = [];
  @Input('claimId') claimId;
  documents_ids = [];
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  file:any = null;
  note:string = null;
  constructor(private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.correspondForm = this.formBuilder.group({
      file: ['', Validators.compose([Validators.required])],
      note: ['', Validators.compose([Validators.required])]
    });

    this.claimService.getcorrespondence(this.claimId).subscribe(correspondRes => {
      console.log(correspondRes);
      this.correspondenceSource = new MatTableDataSource(correspondRes['data'])
    }, error => {
      console.log(error);
    })
  }

  selectedFile: File;
  uploadFile(event) {
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.selectedFile = event.target.files[0];
      console.log(" this.selectedFile", this.selectedFile);
      this.file = event.target.files[0].name;
    } else {
      this.selectedFile = null;
      //this.errorMessage = 'This file type is not accepted';
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }

  correspondFormSubmit() {
    // console.log(this.correspondForm.value)
    // console.log(this.claimId)
    // if (this.correspondForm.invalid) {
    //   this.correspondForm.get('note').markAsTouched();
    //   this.correspondForm.get('file').markAsTouched();
    //   return;
    // }
    if(this.file == null || this.note == null ||  this.note.trim() == ''){
      return;
    }
    let formData = new FormData()
    formData.append('file', this.selectedFile);
    formData.append('notes', this.note);
    if (this.claimId) {
      formData.append('claim_id', this.claimId)
    }
    this.claimService.postcorrespondence(formData).subscribe(data => {
      let details = {
        id: data['data'].id,
        file_name: data['data'].file_name,
        notes: this.note,
        updatedAt: data['data'].createdAt,
        exam_report_file_url: data['data'].exam_report_file_url
      }
      const tabledata = this.correspondenceSource.data ? this.correspondenceSource.data : this.correspondenceSource.data = [];
      tabledata.push(details);
      this.correspondenceSource = new MatTableDataSource(tabledata);
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      this.file = null;
      this.note = '';
      //this.correspondForm.reset();
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      console.log(error);
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  deletecorrespondence(id) {
    this.openDialog('delete', id);
  }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.claimService.deleteCorrespondence(data).subscribe(deleteRes => {
          let type = this.correspondenceSource.data.findIndex(element => element.id == data);
          const tabledata = this.correspondenceSource.data;
          tabledata.splice(type, 1);
          this.documents_ids.splice(type, 1)
          this.correspondenceSource = new MatTableDataSource(tabledata);
          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          console.log(error);
        })
      }
    })
  }

  download(data) {
    saveAs(data.exam_report_file_url, data.file_name);
  }
}
