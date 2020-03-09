import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
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