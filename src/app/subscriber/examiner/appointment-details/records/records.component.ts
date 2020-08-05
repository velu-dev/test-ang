import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map, delay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';

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


  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private onDemandService: OnDemandService) {


    this.route.params.subscribe(param => {
      console.log(param)
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
    //this.onDemandService.getRecords().subscribe()

    this.onDemandService.getRecords(this.paramsId.id, this.paramsId.billId).subscribe(record => {
      console.log(record, "record")
      this.recordData = record;
      record.documets.map(data => {
        data.page_number = null;
        data.isEdit = false;
        data.oldPage = 0;
      })
      this.dataSource = new MatTableDataSource(record.documets)
      let inFile = [];
      let outFile = [];
      record.documets_sent_and_received.map(file => {
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
  addFile(event) {

    console.log(event.target.files)
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'mp3']

    for (let i = 0; i < this.selectedFiles.length; i++) {
      let lists = this.selectedFiles[i];
      console.log(lists);
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar("This file too long", 'error');
          return;
        }
        this.selectedFile = this.selectedFiles[i];
      } else {
        //this.selectedFile = null;
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }
  }

  multipleDownload() {
    console.log(this.selection.selected);
    this.selection.selected.map(res => {
      saveAs(res.file_url, res.file_name);
    })
  }

  inOutdownload(data) {
    console.log(data)
    saveAs(data.file_url, data.file_name);
  }

  onDemandSubmit() {
    let document_ids = []
    this.selection.selected.map(res => {
      document_ids.push(res.document_id)
    })
    console.log(this.rushRequest)
    if (document_ids.length == 0) {
      return
    }
    let data = {
      claim_id: this.paramsId.id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      service_description: "",
      document_ids: document_ids,
      document_type_id: this.recordData.documets[0].document_type_id,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: this.recordData.documets[0].service_request_type_id,
      service_provider_id: this.recordData.documets[0].service_provider_id // default 3
    }
    console.log(data);
    this.onDemandService.requestCreate(data).subscribe(record => {
      console.log(record)
    }, error => {
      console.log(error)
    })
  }

  pageNumberSave(element) {
    console.log(element)
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

const ELEMENT_DATA2 = [
  { "id": 143, "file_name": "Record Set 1", "request_rush": "Yes", "request_date": "01-02-2020", "Download": "" },
  { "id": 143, "file_name": "Record Set 2", "request_rush": "Yes", "request_date": "01-02-2020", "Download": "" },
  { "id": 143, "file_name": "Record Set 3", "request_rush": "Yes", "request_date": "01-02-2020", "Download": "" },
];

const ELEMENT_DATA3 = [
  { "id": 143, "file_name": "Record Summary File Name", "rush_request": "No", "request_date": "01-02-2020", "received_date": "01-02-2020", "Download": "" },
];
