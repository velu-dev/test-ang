import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
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

export interface DiagnosisList {
  code: string;
  name: string;

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
  displayedColumns3: string[] = ['code', 'name', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  dataSource3 = new MatTableDataSource(ELEMENT_DATA3);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  myControl = new FormControl();
  options: string[] = ['123456', 'M Venkat', 'M Rajan'];
  diaCodes = new FormControl();
  codes: string[] = [
    'K50.00 - Crohn disease of small intestine without complications',
    'K50.011 - Crohns disease of small intestine with rectal bleeding',
    'K50.00 - Crohn disease of small intestine without complications',
    'K50.011 - Crohns disease of small intestine with rectal bleeding',
    'K50.00 - Crohn disease of small intestine without complications',
    'K50.011 - Crohns disease of small intestine with rectal bleeding',
    'K50.00 - Crohn disease of small intestine without complications',
    'K50.011 - Crohns disease of small intestine with rectal bleeding',
    'K50.00 - Crohn disease of small intestine without complications',
    'K50.011 - Crohns disease of small intestine with rectal bleeding',
  ];
  filteredOptions: Observable<string[]>;
  filteredICD: Observable<[]>;
  icdCtrl = new FormControl();
  constructor(private claimService: ClaimService) {
    this.filteredICD = this.icdCtrl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.claimService.getICD10(value)));
  }

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

const ELEMENT_DATA3: DiagnosisList[] = [
  { code: 'K50.00 ', name: 'Crohn disease of small intestine without complications' },
  { code: 'K50.011 ', name: 'Crohns disease of small intestine with rectal bleeding' },
];


