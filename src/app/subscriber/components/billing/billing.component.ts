import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { User } from 'src/app/shared/model/user.model';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
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
  role = this.cookieService.get('role_id');
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
    public router: Router,
    private cookieService: CookieService,
    private _location: Location,
    private intercom: IntercomService) {
    if (+this.role == 4) {
      this._location.back();
      return;
    }
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.claimService.getBillings().subscribe(res => {
      res.data.map(data => {
        data['bill_no'] = data.agent_short_code + data.bill_no;
        data['examiner_name'] = data.examiner_last_name + " " + data.examiner_first_name + " " + (data.examiner_suffix ? ',' + data.examiner_suffix : '');
        data['claimant_name'] = data.claimant_last_name + " " + data.claimant_first_name
        data['claimant_date_of_birth'] = moment(data.claimant_date_of_birth).format('MM-DD-YYYY')
      })
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Bill #", "Status"]
        this.displayedColumns = ['is_expand', 'bill_no', 'status']
      } else {
        this.columnName = ["Bill #", "Submission", "Claim #", "Claimant Name", "Date of Birth", "Examiner", "Bill Total", "Status"]
        this.displayedColumns = ['bill_no', 'bill_submission_type', 'claim_number', 'claimant_name', "claimant_date_of_birth", "examiner_name", "paid_amt", "status"]
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
    if (this.isMobile)
      if (this.expandId && this.expandId == element) {
        this.expandId = null;
      } else {
        this.expandId = element;
      }
  }

  gotoBilling(e) {
    this.intercom.setClaimant(e.claimant_first_name + ' ' + e.claimant_last_name);
    this.cookieService.set('claimDetails', e.claimant_first_name + ' ' + e.claimant_last_name)
    this.intercom.setClaimNumber(e.claim_number);
    this.cookieService.set('claimNumber', e.claim_number)
    this.intercom.setBillableItem(e.exam_procedure_name);
    this.cookieService.set('billableItem', e.exam_procedure_name)//response.data.exam_procedure_name
    this.intercom.setBillNo(e.bill_no);
    this.cookieService.set('billNo', e.bill_no)

    //this.router.navigateByUrl(this.router.url + '/' + e.claim_id + '/' + e.billable_item_id + '/' + 'edit-billing' + '/' + e.bill_id)
    this.router.navigateByUrl(this.router.url + '/claimant/' + e.claimant_id + '/claim/' + e.claim_id + '/billable-item/' + e.billable_item_id + '/billing/' + e.bill_id + '/' + (e.bill_submission_type ? e.bill_submission_type.toLowerCase() : 'first'))
  }



}
