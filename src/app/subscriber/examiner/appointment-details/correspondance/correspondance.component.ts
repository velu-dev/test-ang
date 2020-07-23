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
  { name: 'Appointment Notification Letter' },
  { name: 'QME 110 - QME Appointment Notification Form' },
  { name: 'QME 122 - AME or QME Declaration of Service of Medical Legal Report' },
  { name: 'QME 123 - QME or AME Conflict of Interest Disclosure Form' },
  { name: 'Claimant Questionnaire' },
];


export interface PeriodicElement1 {
  name: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Claimant' },
  { name: 'Claims Adjuster' },
  { name: 'Applicant Attorney' },
  { name: 'Defence Attorney' },
  { name: 'Employer' },
  { name: 'DEU Office' },
];
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

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', "download"]
      } else {
        this.columnName = ["File Name", "Action", "Date", "Recipients", "Download"]
        this.columnsToDisplay = ['file_name', 'action', "date", "recipients", 'download']
      }
    })
  }

  ngOnInit() {
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
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }



  displayedColumns1: string[] = ['select', 'name'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA1);
  selection1 = new SelectionModel<PeriodicElement1>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection1. */
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.dataSource1.data.forEach(row => this.selection1.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel1(row?: PeriodicElement1): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }

  }
}

const ELEMENT_DATA2 = [
  { "id": 143, "file_name": "Appointment Notification Letter", "action": "Mailed On Demand", "date": "01-02-2020", "recipients": "Claimant, Claims Adjuster, Applicant Attorney, Defense Attorney, Employer, DEU Office", "Download":"" },
  { "id": 234, "file_name": "QME 110 - QME Appointment Notification Form", "action": "Downloaded", "date": "01-02-2020", "recipients": "-", "Download":"" },
  { "id": 345, "file_name": "QME 122 - AME or QME Declaration of Service of…", "action": "Downloaded", "date": "01-02-2020", "recipients": "-", "Download":"" },
];
