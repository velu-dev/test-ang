import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'action'];
  dataSource: any = new MatTableDataSource([]);;
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  columnsToDisplay = [];
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;
  paramsId: any;
  dataSoruceOut: any;
  dataSoruceIn: any;
  rushRequest: any;
  reportData: any;

  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;

  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public dialog: MatDialog,
    private onDemandService: OnDemandService) {


    this.route.params.subscribe(param => {
      this.paramsId = param;
    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', "download"]
      } else {
        this.columnName = ["File Name", "Request Rush", "Request Date", "Download"]
        this.columnsToDisplay = ['file_name', 'service_priority', "date_of_request", 'download']
      }
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName1 = ["", "File Name", "Download"]
        this.columnsToDisplay1 = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName1 = ["File Name", "Rush Request?", "Date Requested", "Date Received", "Download"]
        this.columnsToDisplay1 = ['file_name', 'service_priority', "date_of_request", "date_of_communication", 'download']
      }
    })
  }


  ngOnInit() {
    this.getReport();
  }
  getReport() {
    this.onDemandService.getTranscription(this.paramsId.id, this.paramsId.billId).subscribe(report => {
      this.reportData = report;
      this.dataSource = new MatTableDataSource(report.documets)
      let inFile = [];
      let outFile = [];
      report.documets_sent_and_received.map(file => {
        if (file.transmission_direction == 'IN') {
          inFile.push(file)
        } else {
          outFile.push(file)
        }

      })
      this.dataSoruceOut = new MatTableDataSource(outFile);
      this.dataSoruceIn = new MatTableDataSource(inFile)
    }, error => {
      this.dataSource = new MatTableDataSource([]);
      this.dataSoruceOut = new MatTableDataSource([]);
      this.dataSoruceIn = new MatTableDataSource([])
    })
  }

  expandIdOut: any;
  expandIdIn: any;
  openElementOut(element) {
    if (this.isMobile) {
      this.expandIdOut = element.document_id;
    }

  }

  openElementIn(element) {
    if (this.isMobile) {
      this.expandIdIn = element.document_id;
    }
  }

  selectedFiles: FileList;
  selectedFile: File;
  formData = new FormData()
  file: any = [];
  addFile(event) {
    this.selectedFiles = event.target.files;
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'mp3']

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar("This file too long", 'error');
          return;
        }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
      } else {
        //this.selectedFile = null;
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.alertService.openSnackBar("Please select file", 'error');
      return;
    }

   // this.formData.append('file', this.selectedFile);
    this.formData.append('document_category_id', '7');
    this.formData.append('claim_id', this.paramsId.id.toString());
    this.formData.append('bill_item_id', this.paramsId.billId.toString());
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.formData.append('file', this.selectedFiles[i]);
    }
    this.onDemandService.postDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.selectedFiles = null;
      this.fileUpload.nativeElement.value = "";
      this.formData = new FormData();
      this.file = [];
      this.getReport();
      this.alertService.openSnackBar("File added successfully!", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      this.selectedFiles = null;
    })
  }

  multipleDownload() {
    if (this.selection.selected.length == 0) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return
    }
    this.selection.selected.map(res => {
      saveAs(res.file_url, res.file_name);
    })
  }

  inOutdownload(data) {
    saveAs(data.file_url, data.file_name);
  }

  onDemandSubmit() {
    let document_ids = []
    this.selection.selected.map(res => {
      document_ids.push(res.document_id)
    })
    if (document_ids.length == 0) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return
    }
    let data = {
      claim_id: this.paramsId.id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      service_description: "",
      document_ids: document_ids,
      document_category_id: this.reportData.documets[0].document_category_id,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: this.reportData.documets[0].service_request_type_id,
      service_provider_id: this.reportData.documets[0].service_provider_id // default 3
    }
    this.onDemandService.requestCreate(data).subscribe(record => {
      this.alertService.openSnackBar("Transcribe and Compile created successfully!", 'success');
      this.getReport();
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

 
  deleteDocument(data) {
    this.openDialogDelete('delete', data);
  }

  openDialogDelete(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.onDemandService.deleteDocument(data.document_id).subscribe(res => {
          this.getReport();
          this.alertService.openSnackBar("File deleted successfully!", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  allOrNone(status) {
    if (!status) {
      this.selection.clear()
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row))
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.file_name + 1}`;
  }
}
