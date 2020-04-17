import { Component, OnInit, Inject } from '@angular/core';
import * as globals from '../../../globals';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';

export interface PeriodicElement {
  doc_image: string;
  doc_name: string;
  date: Date;
  action: string;
}
@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

  displayedColumns = ['doc_image', 'doc_name', 'date', 'action'];
  dataSource = ELEMENT_DATA;

  xls = globals.xls
  xls_1 = globals.xls_1
  docx = globals.docx
  pdf = globals.pdf
  uploadFile: any;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openClaimant(): void {
    const dialogRef = this.dialog.open(ClaimantPopupComponent, {
      width: '800px',
      data: { name: "", animal: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openClaim(): void {
    const dialogRef = this.dialog.open(ClaimPopupComponent, {
      width: '800px',
      data: { name: "", animal: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openBillableItem() {
    const dialogRef = this.dialog.open(BillableitemPopupComponent, {
      width: '800px',
      data: { name: "", animal: "" }
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  cancleClick(): void {
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  cancleClick(): void {
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  cancleClick(): void {
    this.dialogRef.close();
  }

  uploadFile(event) {

  }


}

const ELEMENT_DATA: PeriodicElement[] = [
  { doc_image: 'xls', doc_name: 'Phasellus aliquam turpis sit amet sem eleifend pretium.xls', date: new Date(), action: '' },
  { doc_image: 'docx', doc_name: 'Rajan Mariappan.docx', date: new Date(), action: '' },
  { doc_image: 'pdf', doc_name: 'Ganesan Marappa.pdf', date: new Date(), action: '' },
  { doc_image: 'pdf', doc_name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.pdf', date: new Date(), action: '' },
  { doc_image: 'xls', doc_name: 'Sarath Selvaraj.xls', date: new Date(), action: '' },
];