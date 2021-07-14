import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
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
  onError(e) {
    console.log(e)
  }
  zoomValue = 0.5;
  zoomIn() {
    this.zoomValue = this.zoomValue + 0.5
  }
  zoomOut() {
    this.zoomValue = this.zoomValue - 0.5
  }
  onNoClick(): void {
    this.dialogRef.close({ data: false });
  }
  download() {
    saveAs(this.data.pdf, this.data.name)
  }
}
export interface DialogData {
  name: string;
}