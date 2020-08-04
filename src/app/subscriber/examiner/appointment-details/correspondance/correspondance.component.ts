import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import * as globals from '../../../../globals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-billing-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingCorrespondanceComponent implements OnInit {

  displayedColumns: string[] = ['select', 'form_name'];
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  default_select = globals.default_select
  sentDocuments: any;
  documents: any;
  recipients: any;
  // dataSource2 = ELEMENT_DATA2;
  columnsToDisplay = [];
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;
  displayedColumns1: string[] = ['select', 'recipient_type'];
  selection1 = new SelectionModel<any>(true, []);
  claim_id: any;
  billableId: any;
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private onDemandService: OnDemandService, public dialog: MatDialog, private alertService: AlertService) {
    this.route.params.subscribe(params => {
      this.claim_id = params.id;
      this.billableId = params.billId;
      this.onDemandService.getCorrespondingData(this.claim_id, this.billableId).subscribe(res => {
        this.documents = new MatTableDataSource(res.documets);
        this.recipients = new MatTableDataSource(res.recipient);
      })
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName = ["File Name", "Action", "Date", "Recipients", "Download"]
        this.columnsToDisplay = ['file_name', 'action', "date", "recipients", 'download']
      }
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName1 = ["", "File Name", "Download"]
        this.columnsToDisplay1 = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName1 = ["File Name", "Action", "Date", "Recipients", "Download"]
        this.columnsToDisplay1 = ['file_name', 'action', "date", "recipients", 'download']
      }
    })
  }
  isAllSelected() {
    if (this.documents.data) {
      const numSelected = this.selection.selected.length;
      const numRows = this.documents.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.documents.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.form_name + 1}`;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected1() {
    if (this.recipients.data) {
      const numSelected = this.selection1.selected.length;
      const numRows = this.recipients.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection1. */
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.recipients.data.forEach(row => this.selection1.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel1(row?: any): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.recipient_type + 1}`;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CustomDialog, {
      width: '800px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  ngOnInit() {
  }
  downloadForms() {
    let ids: any;
    ids = this.selection.selected.map(({ id }) => id);
    this.onDemandService.downloadCorrespondanceForm(this.claim_id, this.billableId, { documents_ids: ids }).subscribe(res => {
      if (res.status) {
        let data = res.data;
        data.map(doc => {
          this.download(doc.exam_report_file_url, doc.file_name);
        })
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    })
  }
  download(url, name) {
    saveAs(url, name);
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }

  }
  expandId1: any;
  openElement1(element) {
    if (this.isMobile) {
      this.expandId1 = element.id;
    }

  }
}

@Component({
  selector: 'custom-dialog',
  templateUrl: 'custom-dialog.html',
})
export class CustomDialog {

  constructor(
    public dialogRef: MatDialogRef<CustomDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}