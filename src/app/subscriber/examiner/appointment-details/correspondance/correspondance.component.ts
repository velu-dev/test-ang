import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Appointment Notification Letter'},
  { name: 'QME 110 - QME Appointment Notification Form'},
  { name: 'QME 122 - AME or QME Declaration of Service of Medical Legal Report'},
  { name: 'QME 123 - QME or AME Conflict of Interest Disclosure Form'},
  { name: 'Claimant Questionnaire'},
];
@Component({
  selector: 'app-billing-correspondance',
  templateUrl: './correspondance.component.html',
  styleUrls: ['./correspondance.component.scss']
})
export class BillingCorrespondanceComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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
  constructor() { }

  ngOnInit() {
  }

}
