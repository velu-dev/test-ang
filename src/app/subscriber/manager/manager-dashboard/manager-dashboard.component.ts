import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { SubscriberService } from '../../service/subscriber.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManagerDashboardComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource = new MatTableDataSource([]);
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  procedureTypeStatus = []
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public router: Router, private breakpointObserver: BreakpointObserver, private subscriberService: SubscriberService, private cookieService: CookieService, private intercom: IntercomService) {
    this.subscriberService.getDashboardData().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "critical"]
      } else {
        this.columnName = ["", "Claimant", "Date of Birth", "Examiner", "Exam Procedure Type", "Standing", "Date of Service /" + '\n' + "Date Item Received", "Due Date", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', 'date_of_birth', 'examiner_name', "exam_procedure_name", "standing", 'date_of_service', 'due_date', 'critical']
      }
    })
  }

  ngOnInit() {
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/manager/new-intake'])
    }
  }
  isExpandAll = false;
  expandAll() {
    if (!this.isExpandAll) {
      this.isExpandAll = true;
    } else {
      this.isExpandAll = false;
      this.expandId = null;
    }
  }
  expandId: any;
  openElement(element) {
    this.isExpandAll = false;
    if (this.expandId && this.expandId == element.appointment_id) {
      this.expandId = null;
    } else {
      this.expandId = element.appointment_id;
    }
  }
  openExtract(element, type) {
    this.intercom.setClaimant(element.claimant_first_name + ' ' + element.claimant_last_name);
    this.cookieService.set('claimDetails', element.claimant_first_name + ' ' + element.claimant_last_name)
    this.intercom.setClaimNumber(element.claim_number);
    this.cookieService.set('claimNumber', element.claim_number)
    this.intercom.setBillableItem(element.exam_procedure_name);
    this.cookieService.set('billableItem', element.exam_procedure_name);
    // this.intercom.setBillNo(e.bill_no);// When add billing enable this
    // this.cookieService.set('billNo', e.bill_no)
    let claimant_id = element.claimant_id;
    let claim_id = element.claim_id;
    let billable_id = element.billable_item_id;
    let examiner_id = "";
    if (type == "correspondence" || type == "history" || type == "billing")
      examiner_id = element.examiner_id != null ? "/" + String(element.examiner_id) : "";
    this.router.navigate(['subscriber/manager/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id + '/' + type + examiner_id])
  }

  navigateBillableItem(element) {
    this.intercom.setClaimant(element.claimant_first_name + ' ' + element.claimant_last_name);
    this.cookieService.set('claimDetails', element.claimant_first_name + ' ' + element.claimant_last_name)
    this.intercom.setClaimNumber(element.claim_number);
    this.cookieService.set('claimNumber', element.claim_number)
    this.intercom.setBillableItem(element.exam_procedure_name);
    this.cookieService.set('billableItem', element.exam_procedure_name);
    let claimant_id = element.claimant_id;
    let claim_id = element.claim_id;
    let billable_id = element.billable_item_id;
    this.router.navigate(['subscriber/manager/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id])
  }
  dispalySimpleservice(type): any {
    if (type == "Evaluation" || type == "Reevaluation") {
      return this.procedureTypeStatus = [
        { name: "Correspondence", status: 'correspondence_status', progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
        { name: "History", status: 'history_status', progress_name: 'history', icon: "fa fa-history", for: ["E"], url: "/history" },
        { name: "Records", status: 'record_status', progress_name: 'records', icon: "far fa-list-alt", for: ["E", "S"], url: "/records" },
        { name: "Examination", status: 'examination_status', progress_name: 'examination', icon: "far fa-edit", for: ["E"], url: "/examination" },
        { name: "Report", status: 'reports_status', progress_name: 'reports', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
        { name: "Billing", status: 'bill_on_demand_status', progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
    } else if (type == "Deposition") {
      return this.procedureTypeStatus = [
        { name: "Correspondence", status: 'correspondence_status', progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
        { name: "Report", status: 'reports_status', progress_name: 'reports', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
        { name: "Billing", status: 'bill_on_demand_status', progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
    } else if (type == "Supplemental") {
      return this.procedureTypeStatus = [
        { name: "Correspondence", status: 'correspondence_status', progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
        { name: "Records", status: 'record_status', progress_name: 'records', icon: "far fa-list-alt", for: ["E", "S"], url: "/records" },
        { name: "Report", status: 'reports_status', progress_name: 'reports', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
        { name: "Billing", status: 'bill_on_demand_status', progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
    }
  }
}
