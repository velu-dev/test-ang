import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
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
  filterValue: string;
  isMobile = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private breakpointObserver: BreakpointObserver, private claimService: ClaimService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.claimService.getBilling().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngOnInit() {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
