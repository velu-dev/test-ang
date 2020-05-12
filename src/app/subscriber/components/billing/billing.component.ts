import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
export interface PeriodicElement {
  bill_no: string;
  claim_no: string;
  claimant_name: string;
  examinar: string;
  bill_total: string;
  status: string;
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  displayedColumns: string[] = ['bill_no', 'claim_no', 'claimant_name', 'examinar', 'bill_total', 'status', 'action'];
  dataSource: MatTableDataSource<[]>;
  dataSource1 = ELEMENT_DATA;
  filterValue: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


const ELEMENT_DATA: PeriodicElement[] = [
  { bill_no: '50504949', claim_no: '123xyz45	', claimant_name: 'Steve S. Steveson', examinar: 'Rames Jim, MD', bill_total: '$ 45200.00', status: 'Paid' },
  { bill_no: '50504949', claim_no: '123xyz45	', claimant_name: 'Steve S. Steveson', examinar: 'Rames Jim, MD', bill_total: '$ 45200.00', status: 'Partially Paid' },
  { bill_no: '50504949', claim_no: '123xyz45	', claimant_name: 'Steve S. Steveson', examinar: 'Rames Jim, MD', bill_total: '$ 45200.00', status: 'Rejected' },
  { bill_no: '50504949', claim_no: '123xyz45	', claimant_name: 'Steve S. Steveson', examinar: 'Rames Jim, MD', bill_total: '$ 45200.00', status: 'Paid' },
  { bill_no: '50504949', claim_no: '123xyz45	', claimant_name: 'Steve S. Steveson', examinar: 'Rames Jim, MD', bill_total: '$ 45200.00', status: 'Rejected' },
];
