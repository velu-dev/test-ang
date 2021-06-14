import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as globals from '../../../globals'
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
  file_upload = "/assets/images/cloud-upload.svg"
  pdf = '/assets/images/pdf.svg'
  files = []
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  //   this.isMultiple = data.isMultiple
  //   dialogRef.disableClose = true;
  //   this.onDropZoneEnter = this.onDropZoneEnter.bind(this);
  //   this.onDropZoneLeave = this.onDropZoneLeave.bind(this);
  //   this.onUploaded = this.onUploaded.bind(this);
  //   this.onProgress = this.onProgress.bind(this);
  //   this.onUploadStarted = this.onUploadStarted.bind(this);
  }
  // onDropZoneEnter(e) {
  //   if (e.dropZoneElement.id === "dropzone-external")
  //     this.isDropZoneActive = true;
  // }

  // onDropZoneLeave(e) {
  //   if (e.dropZoneElement.id === "dropzone-external")
  //     this.isDropZoneActive = false;
  // }

  // onUploaded(e) {
  //   const file = e.file;
  //   const fileReader = new FileReader();
  //   fileReader.onload = () => {
  //     this.isDropZoneActive = false;
  //     this.imageSource = fileReader.result as string;
  //     console.log(this.imageSource)
  //   }
  //   fileReader.readAsDataURL(file);
  //   console.log(file)
  //   this.textVisible = false;
  //   this.progressVisible = false;
  //   this.progressValue = 0;
  // }

  // onProgress(e) {
  //   console.log(e)
  //   this.progressValue = e.bytesLoaded / e.bytesTotal * 100;
  // }

  // onUploadStarted(e) {
  //   this.files.push(e.file);
  //   this.imageSource = "";
  //   this.progressVisible = true;
  // }
  // uploadChunk(file, uploadInfo) {
  //   console.log(file, uploadInfo)
  // }
  ngOnInit() {

  }
  // okProceed() {
  //   this.dialogRef.close(
  //     { data: true, files: this.files }
  //   );
  // }
  // remove(i) {
  //   this.files.splice(i, 1)
  // }
  // onNoClick(): void {
  //   this.dialogRef.close({ data: false });
  // }
  // onYesClick(): void {
  //   this.dialogRef.close(
  //     { data: true }
  //   );
  // }

}
export interface DialogData {
  name: string;
}