import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map, delay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RecordsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'doc_pages', 'action'];
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSoruceOut: any;
  columnsToDisplay = [];
  dataSoruceIn: any;
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;

  paramsId: any;
  recordData: any;
  rushRequest: any;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  statusBarValues = { value: null, status: '', class: '' }

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
        this.columnName = ["", "File Name"]
        this.columnsToDisplay = ['is_expand', 'file_name']
      } else {
        this.columnName = ["","File Name", "Document Pages", "Rush Request?", "Date Requested ", "Date Received", "Download Record Document", "Download Record Summary"]
        this.columnsToDisplay = ['doc_image','file_name', 'no_of_units', 'service_priority', "date_of_request", "date_of_communication", 'download', 'download1']
      }
    })

    // this.isHandset$.subscribe(res => {
    //   this.isMobile = res;
    //   if (res) {
    //     this.columnName1 = ["", "File Name", "Download"]
    //     this.columnsToDisplay1 = ['is_expand', 'file_name', 'download']
    //   } else {
    //     this.columnName1 = ["File Name", "Rush Request?", "Date Requested", "Date Received", "Download"]
    //     this.columnsToDisplay1 = ['file_name', 'service_priority', "date_of_request", "date_of_communication", 'download']
    //   }
    // })
  }

  ngOnInit() {
    //this.onDemandService.getRecords().subscribe()
    this.getRecord();

  }

  getRecord() {
    this.onDemandService.getRecords(this.paramsId.claim_id, this.paramsId.billId).subscribe(record => {
      this.recordData = record;
      record.documets.map(data => {
        data.page_number = data.no_of_units;
        data.isEdit = false;
        data.oldPage = data.no_of_units;
      })
      this.dataSource = new MatTableDataSource(record.documets)
      let inFile = [];
      let outFile = [];
      // record.documets_sent_and_received.map(file => {
      //   if (file.transmission_direction == 'IN') {
      //     inFile.push(file)
      //   } else {
      //     outFile.push(file)
      //   }

      // })
      this.dataSoruceOut = new MatTableDataSource(record.documets_sent_and_received);
      this.dataSoruceIn = new MatTableDataSource(inFile)
      this.rushRequest = false;
      this.statusBarChanges(this.recordData.on_demand_status)
    }, error => {
      this.dataSource = new MatTableDataSource([]);
      this.dataSoruceOut = new MatTableDataSource([]);
      this.dataSoruceIn = new MatTableDataSource([]);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
    this.allOrNone(false);
  }

  statusBarChanges(status) {
    switch (status) {
      case 'Unsent':
        this.statusBarValues = { value: 0, status: status, class: 'not-sent' }
        break;
      case 'In Progress':
        this.statusBarValues = { value: 50, status: status, class: 'sent' }
        break;
      case 'Completed':
        this.statusBarValues = { value: 100, status: status, class: 'complete' }
        break;
      case 'Error':
        this.statusBarValues = { value: 50, status: status, class: 'error' }
        break;

      default:
        this.statusBarValues = { value: 0, status: 'Error', class: 'error' }
        break;
    }
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
  errors = { file: { isError: false, error: "" } }
  addFile(event) {
    this.selectedFiles = null
    this.file = []
    this.selectedFiles = event.target.files;
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.errors.file.isError = true;
          this.errors.file.error = "This file too long";
          //this.alertService.openSnackBar("This file too long", 'error');
          return;
        }
        this.errors = { file: { isError: false, error: "" } }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
      } else {
        this.selectedFile = null;
        this.selectedFiles = null
        this.fileUpload.nativeElement.value = "";
        this.errors.file.isError = true;
        this.errors.file.error = "This file type is not accepted";
        this.file = []
        //this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.errors.file.isError = true;
      this.errors.file.error = "Please select file";
      //this.alertService.openSnackBar("Please select file", 'error');
      return;
    }

    this.formData.append('document_category_id', '4');
    this.formData.append('claim_id', this.paramsId.claim_id.toString());
    this.formData.append('bill_item_id', this.paramsId.billId.toString());

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.formData.append('file', this.selectedFiles[i]);
    }

    //return;
    this.onDemandService.postDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.selectedFiles = null;
      this.fileUpload.nativeElement.value = "";
      this.formData = new FormData();
      this.file = [];
      this.getRecord();
      this.errors = { file: { isError: false, error: "" } }
      this.alertService.openSnackBar("File added successfully!", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      this.selectedFiles = null;
      this.file = [];
    })
  }

  async multipleDownload() {
    if (this.selection.selected.length == 0) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return
    }
    // this.selection.selected.map(res => {
    //   saveAs(res.file_url, res.file_name);
    // })

    // for (let i = 0; i < this.selection.selected.length; i++) {
    //   saveAs(this.selection.selected[i].file_url, this.selection.selected[i].file_name, '_self');
    //   await new Promise(r => setTimeout(r, 1000));
    // }
    let document_ids = []
    this.selection.selected.map(res => {
      document_ids.push(res.document_id)
    })
    if (document_ids.length == 1) {
      saveAs(this.selection.selected[0].file_url, this.selection.selected[0].file_name, '_self');
      this.alertService.openSnackBar("File downloaded successfully", 'success');
      this.selection.clear();
      return;
    }
    this.onDemandService.recordDownload(this.paramsId.claim_id, this.paramsId.billId, { documents_ids: document_ids }).subscribe(record => {
      saveAs(record.data.file_url, record.data.file_name, '_self');
      this.selection.clear();
      this.alertService.openSnackBar("File downloaded successfully", 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })

  }

  inOutdownload(data) {
    saveAs(data.file_url, data.file_name);
  }

  onDemandSubmit() {
    // return;
    let document_ids = []
    this.selection.selected.map(res => {
      document_ids.push(res.document_id)
    })
    if (document_ids.length == 0) {
      this.alertService.openSnackBar("Please select a file", 'error');
      return
    }
    let data = {
      claim_id: this.paramsId.claim_id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      service_description: "",
      document_ids: document_ids,
      document_category_id: this.recordData.documets[0].document_category_id,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: this.recordData.documets[0].service_request_type_id,
      service_provider_id: this.recordData.documets[0].service_provider_id // default 3
    }
    this.onDemandService.requestCreate(data).subscribe(record => {
      this.alertService.openSnackBar("Mail On Demand created successfully!", 'success');
    }, error => {
      console.log(error)
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
          this.getRecord();
          this.alertService.openSnackBar("File deleted successfully!", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }

  pageNumberSave(element) {
    if (!(element.page_number >= 0 && element.page_number <= 10000)) {
      this.alertService.openSnackBar("Page number should be  0 to 10000", 'error');
      let data = this.dataSource.data;
      data.map(data => {
        if (data.document_id == element.document_id) {
          data.isEdit = false;
          data.page_number = data.oldPage
        }
      })
      this.dataSource = new MatTableDataSource(data)
      return
    }
    let page_data = {
      document_id: element.document_id,
      bill_item_id: this.paramsId.billId,
      claim_id: this.paramsId.claim_id,
      no_of_units: element.page_number
    }
    this.onDemandService.documentUnit(page_data).subscribe(page => {
      let data = this.dataSource.data;
      data.map(data => {
        // data.page_number = data.no_of_units;
        if (data.document_id == element.document_id) {
          data.isEdit = false;
          data.oldPage = element.page_number;
        }
      })
      this.dataSource = new MatTableDataSource(data)
      //this.dataSource = new MatTableDataSource(record.documets)
      this.alertService.openSnackBar("Page number updated successfully!", 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
