import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as globals from '../../../globals';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  info = globals.info
  alert = globals.alert
  file_upload = globals.file_upload
  pdf = globals.pdf

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {

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