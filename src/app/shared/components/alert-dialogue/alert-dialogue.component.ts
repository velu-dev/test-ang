import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as globals from './../../../globals';
@Component({
  selector: 'app-alert-dialogue',
  templateUrl: './alert-dialogue.component.html',
  styleUrls: ['./alert-dialogue.component.scss']
})
export class AlertDialogueComponent implements OnInit {

  info = globals.info
  alert = globals.alert
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlertDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }
  
  ngOnInit() {

  }
  onClick(status): void {
    this.dialogRef.close({ data: status })
  }

}
export interface DialogData {
  message: string,
  yes: string,
  proceed: string,
  no: string,
  type: string,
  cancel: boolean
}