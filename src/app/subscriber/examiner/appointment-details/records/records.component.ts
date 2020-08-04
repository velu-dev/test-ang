import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
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
  selection = new SelectionModel();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSoruceOut: any;
  columnsToDisplay = [];
  dataSoruceIn : any;
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;

  paramsId: any;
  rocardData: any;
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
      this.rocardData = record;
      this.rocardData.documets_sent_and_received = [{
        "document_transmit_mode": "IMMEDIATE",
        "date_of_request": "2020-07-28T06:34:04.253Z",
        "service_priority": "rush",
        "on_demand_service_request_id": 65,
        "on_demand_services_request_docs_id": 120,
        "transmitted_file_name": "1051031960_VenkatesanMariyappan_M_1021001733_transcription_01_20200728_173404_393_XP.docx",
        "document_id": 2180,
        "transmission_direction": "OUT",
        "date_of_communication": "2020-07-28T06:34:04.394Z",
        "file_name": "429c227ae4b7b36490be80509b850ff6-1595484870265.docx",
        "file_url": "https://d3qlsnvvobb6z6.cloudfront.net/organization_10_111301101232/claims/IMEDEPO/4b98ebcc35be73dbe47d54af20856198.docx?Expires=1596109913&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kM3Fsc252dm9iYjZ6Ni5jbG91ZGZyb250Lm5ldC9vcmdhbml6YXRpb25fMTBfMTExMzAxMTAxMjMyL2NsYWltcy9JTUVERVBPLzRiOThlYmNjMzViZTczZGJlNDdkNTRhZjIwODU2MTk4LmRvY3giLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTYxMDk5MTN9fX1dfQ__&Signature=gJKckKiGjQe8beAVJXEWmGPNYwGth~yP1QEJkF~hrWo8glyfR~HslkTWy0wHNl66Fz20WdJOlw4E0rh9wZbA-af-s4sPhCB7QFrZECuzbrtriclYT6rCCxCHE6SWcZ~pKBm7bQOpEPY-93Gb1msmda6GdNZn6JVTS1BwoEzmCjikx7zt1CY06l5xHqUWw5ZWqsjXlmadBXOxHWGEYPCQQ9lzZhUBHBHXTwm7HNsa0By8F9dHaR4ovW9DxumyRCvvFbxRzuXdJ7rqCl0gLT26cHlx6i4ybHupEc-NkMjnwsx8OJo0fAT-vHBFxLfKn4vZ7XjCGiNonAWwcGBVQZk1lQ__&Key-Pair-Id=APKAJQ63EA47SVC6S4KQ"
      },
      {
        "document_transmit_mode": "IMMEDIATE",
        "date_of_request": "2020-07-28T06:34:04.253Z",
        "service_priority": "rush",
        "on_demand_service_request_id": 65,
        "on_demand_services_request_docs_id": 121,
        "transmitted_file_name": "1051031960_VenkatesanMariyappan_M_1021001733_transcription_02_20200728_173406_286_XP.xlsx",
        "document_id": 2181,
        "transmission_direction": "OUT",
        "date_of_communication": "2020-07-28T06:34:06.287Z",
        "file_name": "Non-Admin-Users (8)-1595484890589.xlsx",
        "file_url": "https://d3qlsnvvobb6z6.cloudfront.net/organization_10_111301101232/claims/IMEDEPO/36f732448b0ec15202c95f23ab978d16.xlsx?Expires=1596109913&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kM3Fsc252dm9iYjZ6Ni5jbG91ZGZyb250Lm5ldC9vcmdhbml6YXRpb25fMTBfMTExMzAxMTAxMjMyL2NsYWltcy9JTUVERVBPLzM2ZjczMjQ0OGIwZWMxNTIwMmM5NWYyM2FiOTc4ZDE2Lnhsc3giLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTYxMDk5MTN9fX1dfQ__&Signature=fYAOODi9Vkzk7-kk-orl8qtx~Uu9dy~VhQXw~5PxVXzf5doC1l-ofjD36MWyorPyg-tdIlxFdaREaO78G4yyDcHhAIeM7OZ9fqQlOQa1xuDZPWuz~lnPRqp6nJl2OQcuRsf5pBBfRwDqW8Xzr11svskXCQtZsN07SJSmLwUVRWm-SB~c4gojSf9UKa56-HPs2Bzjm7LjX6znwE3ikr7-fMFG2r-L64qn8UuHjEpPwr7uFl2rk1Ely66aXZPZCCnw-cZHpZ9h4ChgUFe4wcp-BfAcUdpTUBeWdtwFMcDl2PctlUlnO-FsC12tbK9K~ZVMEecReF7hMsI036HFJYLHlA__&Key-Pair-Id=APKAJQ63EA47SVC6S4KQ"
      },
      {
        "document_transmit_mode": "IMMEDIATE",
        "date_of_request": "2020-07-28T06:34:04.253Z",
        "service_priority": "rush",
        "on_demand_service_request_id": 65,
        "on_demand_services_request_docs_id": 122,
        "transmitted_file_name": "1051031960_VenkatesanMariyappan_M_1021001733_transcription_03_20200728_173407_913_XP.pdf",
        "document_id": 100,
        "transmission_direction": "OUT",
        "date_of_communication": "2020-07-28T06:34:07.913Z",
        "file_name": "claimant-page-1589969682480.pdf",
        "file_url": "https://d3qlsnvvobb6z6.cloudfront.net/organization_10_111301101232/claims/RT/779c72745c523473cda9925a6d64d89e.pdf?Expires=1596109913&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kM3Fsc252dm9iYjZ6Ni5jbG91ZGZyb250Lm5ldC9vcmdhbml6YXRpb25fMTBfMTExMzAxMTAxMjMyL2NsYWltcy9SVC83NzljNzI3NDVjNTIzNDczY2RhOTkyNWE2ZDY0ZDg5ZS5wZGYiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTYxMDk5MTN9fX1dfQ__&Signature=JmBj7JWjHxbzMQKKqlvmilI2KYwyKtPVM1xO3c~zCOs~0f7FTsW6DxivPBw6PSJXW2yH6~y~H3Dr1AXzq7xqyfVatEBqbdC62UUcmve0bQRnQK~U80EoBQk6arH52E7yBgGRx9JBOPAJ~EiBwGbAVMZTA7haNllLEq6z2Bimv7hUkbu8YNtB9iYa5vyCbFmURn-V6VJNy1wmmQHqERuRZUaJwcghYY-3Rz3rfWMsy7tmtUJR1TCwA45naMLVSzYG5vzfBlXW7DI72iCHAkHKgMvNdBluq0uWYt6t-DhwHNcBAVPEJjqy2~kvy9G9-oqRMPINRjwuMRjeazQU~~DMDA__&Key-Pair-Id=APKAJQ63EA47SVC6S4KQ"
      }
      ]
      this.dataSource = new MatTableDataSource(record.documets)
      this.dataSoruceOut = new MatTableDataSource(record.documets_sent_and_received);
      this.dataSoruceIn = new MatTableDataSource(record.documets_sent_and_received)
    }, error => {
      this.dataSource = new MatTableDataSource([])
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

  download(data) {
    saveAs(data.file_url, data.file_name);
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
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
