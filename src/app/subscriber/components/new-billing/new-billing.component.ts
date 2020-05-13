import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
export interface PeriodicElement {
  item: string;
  procedure_code: string;
  modifer: string;
  units: string;
  charge: string;
  fee_schedule: string;
}
@Component({
  selector: 'app-new-billing',
  templateUrl: './new-billing.component.html',
  styleUrls: ['./new-billing.component.scss']
})
export class NewBillingComponent implements OnInit {
  displayedColumns: string[] = ['item', 'procedure_code', 'modifer', 'units', 'charge', 'fee_schedule'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
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
  { item: 'QME Examination', procedure_code: '', modifer: '', units: '', charge: '$ 2200.00', fee_schedule: '$ 2200.00', },
  { item: 'Report pages', procedure_code: '', modifer: '', units: '', charge: '$ 2200.00', fee_schedule: '$ 2200.00', }
];
