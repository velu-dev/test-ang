import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import * as globals from '../../../globals';

export interface PeriodicElement {
  item: string;
  procedure_code: string;
  modifer: string;
  units: string;
  charge: string;
  fee_schedule: string;
}
export interface DocList {
  name: string;
  type: string;

}

export interface PaymantList {
  item: string;
  procedure_code: string;
  modifer: string;
  units: string;
  charge: string;
  fee_schedule: string;
  payment: string;
  balance: string;
}
@Component({
  selector: 'app-new-billing',
  templateUrl: './new-billing.component.html',
  styleUrls: ['./new-billing.component.scss']
})
export class NewBillingComponent implements OnInit {
  docx = globals.docx;
  displayedColumns: string[] = ['item', 'procedure_code', 'modifer', 'units', 'charge', 'fee_schedule'];
  displayedColumns1: string[] = ['name', 'type'];
  displayedColumns2: string[] = ['item', 'procedure_code', 'modifer', 'units', 'charge', 'fee_schedule', 'payment', 'balance'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  myControl = new FormControl();
  options: string[] = ['123456', 'M Venkat', 'M Rajan'];
  filteredOptions: Observable<string[]>;
  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}

const ELEMENT_DATA: PeriodicElement[] = [
  { item: 'QME Examination', procedure_code: 'ML 101', modifer: '93', units: '', charge: '$ 2200.00', fee_schedule: '$ 2200.00', },
  { item: 'Report pages', procedure_code: '', modifer: '', units: '', charge: '$ 2200.00', fee_schedule: '$ 2200.00', }
];

const ELEMENT_DATA1: DocList[] = [
  { name: 'steveson-123ABC-QME.pdf', type: 'Report' },
  { name: 'submission-cover-letter-8765543.pdf', type: 'Attachment' },
];

const ELEMENT_DATA2: PaymantList[] = [
  { item: 'QME Examination', procedure_code: 'ML 101', modifer: '93', units: '1', charge: '$ 2200.00', fee_schedule: '$ 2200.00', payment: '$ 0', balance: '$ 2200.00' },
  { item: 'Report pages', procedure_code: '', modifer: '', units: '', charge: '$ 2200.00', fee_schedule: '$ 2200.00', payment: '$ 0', balance: '$ 2200.00' }
];

