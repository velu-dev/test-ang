import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PDFViewerComponent implements OnInit {
  pdfSrc = "";
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PDFViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pdfSrc = data.pdf;
  }
  ngOnInit() {

  }
}
export interface DialogData {
  name: string;
}