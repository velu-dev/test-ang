import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { User } from 'src/app/shared/model/user.model';
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
  styleUrls: ['./billing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BillingComponent implements OnInit {
  // displayedColumns: string[] = ['bill_no', 'claim_id', 'claimant_first_name', 'examiner_first_name', 'paid_amt', 'bill_paid_status', 'action'];
  // dataSource: MatTableDataSource<[]>;
  filterValue: string;

  dataSource: any;
  columnName = []
  displayedColumns = [];
  expandedElement: User | null;
  isMobile = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private claimService: ClaimService,
    private breadcrumbService: BreadcrumbService,
    public router: Router) {
    console.log()
    this.breadcrumbService.set(this.router.url, "Billing");
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.claimService.getBillings().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Bill #", "Action"]
        this.displayedColumns = ['is_expand', 'bill_no', 'action']
      } else {
        this.columnName = ["Bill #", "Claim #", "Claimant Name", "Examiner", "Bill Total", "Status", "Action"]
        this.displayedColumns = ['bill_no', 'claim_no', 'claimant_first_name', "examiner_first_name", "paid_amt", "status", "action"]
      }
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

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element;
    }
  }
}
