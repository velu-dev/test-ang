import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as globals from '../../../globals'
import { AlertService } from '../../services/alert.service';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  info = globals.info
  alert = globals.alert

  isDropZoneActive = false;
  imageSource = "";
  textVisible = true;
  progressVisible = false;
  progressValue = 0;
  isMultiple = false
  fileSize = 0;
  fileType = [];
  file_upload = "/assets/images/cloud-upload.svg"
  pdf = '/assets/images/pdf.svg'
  files = [];
  constructor(
    private alertService: AlertService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data)
    this.isMultiple = data.isMultiple;
    this.fileType = data.fileType;
    this.fileSize = data.fileSize * 1024 * 1024;
    dialogRef.disableClose = true;
    this.onDropZoneEnter = this.onDropZoneEnter.bind(this);
    this.onDropZoneLeave = this.onDropZoneLeave.bind(this);
    this.onUploaded = this.onUploaded.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onUploadStarted = this.onUploadStarted.bind(this);
  }
  onDropZoneEnter(e) {
    if (e.dropZoneElement.id === "dropzone-external")
      this.isDropZoneActive = true;
  }

  onDropZoneLeave(e) {
    console.log(e)
    if (e.dropZoneElement.id === "dropzone-external")
      this.isDropZoneActive = false;
  }

  onUploaded(e) {

    console.log(e.file)
    var FileSize = e.file.size / 1024 / 1024; // in MB
    let actualFileSize = (this.fileSize / (1024 * 1024));
    if (FileSize > actualFileSize) {
      this.error = "File size is too large. Contact your organization's Simplexam Admin";
      return
    }
    const file = e.file;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.isDropZoneActive = false;
      this.imageSource = fileReader.result as string;
      console.log(this.imageSource)
    }
    fileReader.readAsDataURL(file);
    console.log(file)
    this.textVisible = false;
    this.progressVisible = false;
    this.progressValue = 0;
  }

  onProgress(e) {
    var FileSize = e.file.size / 1024 / 1024; // in MB
    let actualFileSize = (this.fileSize / (1024 * 1024));
    if (FileSize > actualFileSize) {
      this.error = "File size is too large. Contact your organization's Simplexam Admin";
      return
    }
    this.progressValue = e.bytesLoaded / e.bytesTotal * 100;
  }
  error = "";
  fileName = [];
  onUploadStarted(e) {
    console.log(e.file)
    if (this.fileType.includes(('.' + e.file.name.split('.').pop().toLowerCase()))) {
      var FileSize = e.file.size / 1024 / 1024; // in MB
      let actualFileSize = (this.fileSize / (1024 * 1024));
      if (FileSize > actualFileSize) {
        this.error = "File size is too large. Contact your organization's Simplexam Admin";
        return
      } else {
        this.error = "";
      }
    } else {
      this.error = "<b>Uploaded file format is not accepted</b> " + ' ( ' + e.file.name + ' ).';
      return
    }
    this.error = "";
    if (this.isMultiple) {
      if (this.fileName.includes(e.file.name)) {
        this.alertService.openSnackBar('File is already exist!', 'error')
        return
      }
      this.fileName.push(e.file.name);
      this.files.push(e.file);
    } else {
      this.files = [];
      this.files.push(e.file);
    }

    this.imageSource = "";
    this.progressVisible = true;
  }
  uploadChunk(file, uploadInfo) {
    console.log(file, uploadInfo)
  }
  ngOnInit() {

  }
  okProceed() {
    this.dialogRef.close(
      { data: true, files: this.files }
    );
  }
  remove(i) {
    this.files.splice(i, 1)
  }
  onNoClick(): void {
    this.dialogRef.close({ data: false });
  }
  onYesClick(): void {
    this.dialogRef.close(
      { data: true }
    );
  }

}
export interface DialogData {
  name: string;
}