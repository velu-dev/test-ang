import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';

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

  displayedColumns: string[] = ['select', 'name', 'action'];
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource2 = ELEMENT_DATA2;
  columnsToDisplay = [];
  dataSource3 = ELEMENT_DATA3;
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;

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

  constructor(private breakpointObserver: BreakpointObserver,private onDemandService:OnDemandService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', "download"]
      } else {
        this.columnName = ["File Name", "Request Rush", "Request Date", "Download"]
        this.columnsToDisplay = ['file_name', 'request_rush', "request_date", "download"]
      }
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName1 = ["", "File Name", "Download"]
        this.columnsToDisplay1 = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName1 = ["File Name", "Rush Request?", "Date Requested", "Date Received", "Download"]
        this.columnsToDisplay1 = ['file_name', 'rush_request', "request_date", "received_date", 'download']
      }
    })
  }

  ngOnInit() {
    //this.onDemandService.getRecords().subscribe()
  }
  expandId: any;
  expandId1: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
      this.expandId1 = element.id;
    }

  }
}

const ELEMENT_DATA2 = [
  { "id": 143, "file_name": "Record Set 1", "request_rush": "Yes", "request_date": "01-02-2020", "Download":"" },
  { "id": 143, "file_name": "Record Set 2", "request_rush": "Yes", "request_date": "01-02-2020", "Download":"" },
  { "id": 143, "file_name": "Record Set 3", "request_rush": "Yes", "request_date": "01-02-2020", "Download":"" },
];

const ELEMENT_DATA3 = [
  { "id": 143, "file_name": "Record Summary File Name", "rush_request": "No", "request_date": "01-02-2020", "received_date": "01-02-2020", "Download": "" },
];
