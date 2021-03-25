import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as globals from '../../../globals';
@Component({
  selector: 'app-regulation-dialogue',
  templateUrl: './regulation-dialogue.component.html',
  styleUrls: ['./regulation-dialogue.component.scss']
})
export class RegulationDialogueComponent implements OnInit {

  info = globals.info
  alert = globals.alert
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegulationDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

  }
  onClick(status?): void {
    this.dialogRef.close({ data: status })
  }

}
export interface DialogData {
  title: string,
  data: []
}