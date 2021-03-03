import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { SubscriberService } from '../../service/subscriber.service';

export interface PeriodicElement {
  claimant: string;
  examiner: string;
  exam_procedure_type: string;
  standing: string;
  dos: string;
  critical: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DashboardComponent implements OnInit {
  role: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource: any //new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  procedureTypeStatus = []
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public router: Router, private logger: NGXLogger, private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private subscriberService: SubscriberService,
    private intercom: IntercomService) {
    this.subscriberService.getDashboardData().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_first_name', "critical"]
      } else {
        this.columnName = ["", "Claimant", "Date of Birth", "Examiner", "Exam Procedure Type", "Standing", "Date of Service /" + '\n' + "Date Item Received", "Due Date", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_first_name', 'date_of_birth', 'examiner_first_name', "exam_procedure_name", "standing", 'appointment_scheduled_date_time', 'due_date', 'critical']
      }
    })
  }

  ngOnInit() {
    this.role = this.cookieService.get('role_id')
    switch (this.role) {
      case '1':
        this.router.navigate(["/admin"]);
        break;
      case '2':
        this.router.navigate(["/subscriber/dashboard"]);
        break;
      case '3':
        this.router.navigate(["/subscriber/manager/dashboard"]);
        break;
      case '4':
        this.router.navigate(["/subscriber/staff/dashboard"]);
        break;
      case '11':
        this.router.navigate(["/subscriber/examiner/dashboard"]);
        break;
      case '12':
        this.router.navigate(["/subscriber/staff/dashboard"]);
        break;
      default:
        this.router.navigate([""]);
        break;
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
  navigate(menu) {
    this.router.navigate([this.router.url + menu])
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/new-intake'])
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
    this.router.navigate(['subscriber/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id + '/' + type + examiner_id])
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
    this.router.navigate(['subscriber/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id])
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