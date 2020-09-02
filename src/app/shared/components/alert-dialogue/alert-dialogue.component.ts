import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-alert-dialogue',
  templateUrl: './alert-dialogue.component.html',
  styleUrls: ['./alert-dialogue.component.scss']
})
export class AlertDialogueComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlertDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {

  }
  onClick(status): void {
    this.dialogRef.close({ data: status })
  }

}
export interface DialogData {
  message: string,
  yes: string,
  no: string
}