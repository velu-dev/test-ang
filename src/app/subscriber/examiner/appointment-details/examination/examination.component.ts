import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Depression/Anxiety Inventories' },
  { name: 'Diagnostic Requisition' },
  { name: 'Disability Inventories' },
  { name: 'DWC-AD 100 (DEU 100)' },
  { name: 'Pain Drawing' },
  { name: 'Pain Inventories' },
  { name: 'Personality Inventories' },
  { name: 'Physical Exam Templates by Body Region' },
];


export interface PeriodicElement1 {
  name: string;
}

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExaminationComponent implements OnInit {
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  displayedColumns: string[] = ['select', 'form_name'];
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  claim_id: any;
  billableId: any;
  examinationDocuments: any;
  uploadedDocument: any;
  file: any;
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private ondemandService: OnDemandService, private alertService: AlertService, public dialog: MatDialog) {
    this.route.params.subscribe(params => {
      console.log(params)
      this.claim_id = params.id;
      this.billableId = params.billId;
      this.getData();
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'action']
      } else {
        this.columnName = ["File Name", "Date Uploaded", "Action"]
        this.columnsToDisplay = ['file_name', "updatedAt", 'action']
      }
    })
  }
  isLoading: any = false;
  getData() {
    this.isLoading = true;
    this.ondemandService.getBilling(this.claim_id, this.billableId).subscribe(res => {
      this.examinationDocuments = new MatTableDataSource(res.documets);
      this.isLoading = false;
    }, error => {
      return
    })
    this.ondemandService.listUploadedDocs(this.claim_id, this.billableId).subscribe(res => {
      if (res.status)
        this.uploadedDocument = new MatTableDataSource(res.data);
    })

  }
  ngOnInit() {
  }
  downloadForms() {
    let ids = { documents_ids: this.selection.selected.map(res => res['id']) }
    this.ondemandService.downloadBillingDoc(this.claim_id, this.billableId, ids).subscribe(res => {
      if (res.status) {
        res.data.map(data => {
          this.download(data.exam_report_file_url, data.file_name)
        })
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    })
  }
  download(url, name) {
    saveAs(url, name);
  }
  selectedFile: File;
  formData = new FormData()
  error = { status: false, message: "" };
  addFile(event) {
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.error.status = true;
        this.error.message = "This file too long";
        return;
      }
      this.error.status = false;
      this.error.message = "";
      this.file = event.target.files[0].name;
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
      this.error.status = true;
      this.error.message = "This file type is not accepted";
    }
  }
  uploadFile() {
    if (!this.selectedFile) {
      this.error.status = true;
      this.error.message = "Please select file";
      return;
    }

    this.formData.append('file', this.selectedFile);
    this.formData.append('claim_id', this.claim_id);
    this.formData.append('bill_item_id', this.billableId.toString());
    this.ondemandService.uploadExaminationDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.formData = new FormData();
      this.file = "";
      this.getData();
    })
  }
  downloadDocument(element) {
    saveAs(element.exam_report_file_url, element.file_name);
  }
  removeDocument(element) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: "delete" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.ondemandService.removeDocument(element.id).subscribe(res => {
          if (res.status) {
            this.alertService.openSnackBar(res.message, "success")
            this.getData();
          } else {
            this.alertService.openSnackBar(res.message, "error")
          }
        })
      } else {
        return;
      }
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.examinationDocuments.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.examinationDocuments.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }

  }
}