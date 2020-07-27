import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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

  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource2 = ELEMENT_DATA2;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
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
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName = ["File Name", "Date Uploaded", "Download"]
        this.columnsToDisplay = ['file_name', "date_uploaded",'download']
      }
    })
  }

  ngOnInit() {
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }

  }
}

const ELEMENT_DATA2 = [
  { "id": 143, "file_name": "Depression/Anxiety Inventories", "date_uploaded": "01-02-2020", "Download":"" },
  { "id": 143, "file_name": "DWC-AD 100 (DEU 100)", "date_uploaded": "01-02-2020", "Download":"" },
  { "id": 143, "file_name": "Personality Inventories", "date_uploaded": "01-02-2020", "Download":"" },
];

