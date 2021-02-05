import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { ExaminerService } from 'src/app/subscriber/service/examiner.service';
import { Location } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-billing-collection',
  templateUrl: './billing-collection.component.html',
  styleUrls: ['./billing-collection.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingCollectionComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  billingData: any = new MatTableDataSource([])
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  constructor(public router: Router, private breakpointObserver: BreakpointObserver, private examinerService: ExaminerService,
    private _location: Location) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant"]
        this.columnsToDisplay = ['is_expand', 'claimant_name']
      } else {
        this.columnName = ["Claimant", "Exam Procedure Type", "Date of service", "Charge", "Date Of First Submission", "Balance Due", "Icon"]
        this.columnsToDisplay = ['claimant_name', 'procedure_type', "dos", "charge", 'bill_date', 'balance', 'icon']
      }
    })
  }

  ngOnInit() {

    this.examinerService.getDashboardBilling().subscribe(res => {
      this.billingData = new MatTableDataSource(res.data);
    }, error => {
      this.billingData = new MatTableDataSource([])
    })
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element) {
        this.expandId = null;
      } else {
        this.expandId = element;
      }
    } else {
      console.log(element)
      let billing = "";
      if (element.bill_id) {
        billing = '/billing/' + element.bill_id;
      } else {
        billing = '/billing'
      }
      //this.router.navigate(['subscriber/examiner/upcomming-billable-item/' + 'billable-item/' + element.claim_id + '/' + element.claimant_id + "/" + element.bill_item_id + billing])
      this.router.navigate(['subscriber/examiner/billing-collection/' + "claimants/claimant/" + element.claimant_id + "/claim/" + element.claim_id + "/billable-item/" + element.bill_item_id + billing])
    }
  }
  openElementDetail(element) {
    let billing = "";
    if (element.bill_id) {
      billing = '/billing/' + element.bill_id;
    } else {
      billing = '/billing'
    }
    //this.router.navigate(['subscriber/examiner/upcomming-billable-item/' + 'billable-item/' + element.claim_id + '/' + element.claimant_id + "/" + element.bill_item_id + billing])
    this.router.navigate(['subscriber/examiner/billing-collection/' + "claimants/claimant/" + element.claimant_id + "/claim/" + element.claim_id + "/billable-item/" + element.bill_item_id + billing])
  }
  applyFilter(filterValue: string) {
    this.billingData.filter = filterValue.trim().toLowerCase();
    if (this.billingData.paginator) {
      this.billingData.paginator.firstPage();
    }
  }

  back() {
    this._location.back();
  }

}
