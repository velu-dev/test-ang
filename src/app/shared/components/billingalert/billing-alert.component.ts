import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as globals from './../../../globals';
@Component({
  selector: 'app-billing-alert',
  templateUrl: './billing-alert.component.html',
  styleUrls: ['./billing-alert.component.scss']
})
export class BillingAlertComponent implements OnInit {

  error = globals.error
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BillingAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close({ data: false });
  }
  // onYesClick(): void {
  //   this.dialogRef.close(
  //     { data: true }
  //   );
  // }
}
