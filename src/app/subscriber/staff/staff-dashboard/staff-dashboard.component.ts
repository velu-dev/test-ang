import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { SubscriberService } from '../../service/subscriber.service';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class StaffDashboardComponent implements OnInit {
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
  role: any;
  procedureTypeStatus = [];
  dashboardData = [];
  selectedTile = "";
  totalCount: any = {};
  criticalCount: any = {};
  allData = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public router: Router, private breakpointObserver: BreakpointObserver, private subscriberService: SubscriberService, private intercom: IntercomService, private cookieService: CookieService, private alertService: AlertService) {
    // this.subscriberService.getDashboardData().subscribe(res => {
    //   this.dataSource = new MatTableDataSource(res.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    // })
    this.subscriberService.getDashboardData({}).subscribe(res => {
      res.data.splitted_record.map(total => {
        this.totalCount[total.type] = total.total_count
        this.criticalCount[total.type] = total.critical_count
      })
      this.dashboardData = res.data.splitted_record;
      this.selectedTile = status;
      this.selectedData = res.data.all_record.length;
      this.allData = res.data.all_record;
      this.dataSource = new MatTableDataSource(res.data.all_record);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_first_name', "is_critical"]
      } else {
        this.columnName = ["", "Claimant", "Date of Birth", "Examiner", "Exam Procedure Type", "Standing", "Date of Service /" + '\n' + "Date Item Received", "Standing Due Date", "Report Submission" + '\n' + "Due Date", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_first_name', 'date_of_birth', 'examiner_first_name', "exam_procedure_name", "standing", 'appointment_scheduled_date_time', 'due_date', 'report_submission_due_date', 'is_critical']
      }
    })
    this.role = this.cookieService.get('role_id')
  }

  ngOnInit() {
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/staff/new-intake'])
    }
  }
  isExpandAll = false;
  expandAll() {
    this.expandId = null;
    this.isCloseId = null;
    this.isCloseIds = [];
    this.isExpandAll = this.isExpandAll ? false : true;
    // if (!this.isExpandAll) {
    //   this.isExpandAll = true;
    // } else {
    //   this.isExpandAll = false;
    // }
  }
  expandId: any;
  isCloseId: any;
  isCloseIds = [];
  isExpandIds = [];
  openElement(element, ind) {
    if (this.isExpandAll) {
      if (this.isCloseIds.includes(ind)) {
        let index = this.isCloseIds.indexOf(ind)
        this.isCloseIds.splice(index, 1)
      } else {
        this.isCloseId = ind;
        this.isCloseIds.push(ind);
        console.log()
        if (this.isCloseIds.length == this.selectedData) {
          this.isExpandAll = false;
        }
      }
      this.expandId = null;
    } else {
      this.isCloseId = null;
      this.isExpandAll = false;
      if (this.expandId && this.expandId == ind) {
        this.expandId = null;
      } else {
        this.isExpandIds = []
        this.expandId = ind;
        this.isExpandIds.push(ind);
        if (this.isExpandIds.length == this.selectedData) {
          this.isExpandAll = true;
        }
        let index = this.isCloseIds.indexOf(ind)
        this.isCloseIds.splice(index, 1)
      }
    }

  }
  selectedData: any;
  getDashboardData(status?) {
    var filteredData = [];
    if (status == 'claimants_without_claims') {
      this.isHandset$.subscribe(res => {
        this.isMobile = res;
        if (res) {
          this.columnName = ["", "Claimant", "Date of Birth", "Phone"];
          this.columnsToDisplay = ["is_expand", "claimant_first_name", "date_of_birth", "phone_no_1"];
        } else {
          this.columnName = ["", "Claimant", "Date of Birth", "Phone"];
          this.columnsToDisplay = ["is_expand", "claimant_first_name", "date_of_birth", "phone_no_1"];
        }
      })
    }
    if (status == 'claims_without_billable_item') {
      this.isHandset$.subscribe(res => {
        this.isMobile = res;
        if (res) {
          this.columnName = ["", "Claimant", "Exam Type"];
          this.columnsToDisplay = ["is_expand", "claimant_first_name", "exam_type_code"];
        } else {
          this.columnName = ["", "Claimant", "Exam Type", "Claim Number", "Body Parts"];
          this.columnsToDisplay = ["is_expand", "claimant_first_name", "exam_type_code", "claim_number", "body_parts"];
        }
      })
    }
    if (status == "awaiting_appointment_details" || status == "submit_correspondence" || status == "confirm_appointment" || status == "bill_report" || status == "collect_on_payment" || status == 'collect_bills' || status == 'closed_bills') {
      this.isHandset$.subscribe(res => {
        this.isMobile = res;
        if (res) {
          this.columnName = ["", "Claimant", "Critical"]
          this.columnsToDisplay = ['is_expand', 'claimant_first_name', "is_critical"]
        } else {
          this.columnName = ["", "Claimant", "Date of Birth", "Examiner", "Exam Procedure Type", "Standing", "Date of Service /" + '\n' + "Date Item Received", "Standing Due Date", "Report Submission" + '\n' + "Due Date", "Critical"]
          this.columnsToDisplay = ['is_expand', 'claimant_first_name', 'date_of_birth', 'examiner_first_name', "exam_procedure_name", "standing", 'appointment_scheduled_date_time', 'due_date', 'report_submission_due_date', 'is_critical']
        }
      })
    }
    if (this.selectedTile == status) {
      this.selectedTile = "";
      filteredData = this.allData;
    } else {
      this.selectedTile = status;
      this.dashboardData.map(res => {
        if (res.type == status) {
          filteredData = res.data;
          return true
        }
      })
    }
    if (status == 'claims_without_billable_item') {
      filteredData.map(filter => {
        filter['body_parts'] = filter.body_parts ? filter.body_parts[0].body_part_name : "";
      })
    }
    this.selectedData = filteredData.length;
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
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
    if (type == "correspondence" || type == "history") {
      examiner_id = element.examiner_id != null ? "/" + String(element.examiner_id) : "";
      this.router.navigate(['subscriber/staff/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id + '/' + type + examiner_id])
    } else if (type == "billing") {
      let bill_id = element.bill_id != null ? "/" + String(element.bill_id) : "";
      this.router.navigate(['subscriber/staff/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id + '/' + type + bill_id])
    } else {
      this.router.navigate(['subscriber/staff/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id + '/' + type])
    }
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
    if (billable_id) {
      this.router.navigate(['subscriber/staff/claimants/claimant/' + claimant_id + '/claim/' + claim_id + '/billable-item/' + billable_id])
    } else {
      if (this.selectedTile == 'claimants_without_claims') {
        this.router.navigate(['subscriber/staff/claimants/claimant/' + claimant_id])
      } else if (this.selectedTile == 'claims_without_billable_item') {
        this.router.navigate(['subscriber/staff/claimants/claimant/' + claimant_id + '/claim/' + claim_id])
      } else {
        this.alertService.openSnackBar("Billable Item ID Not Found", "error");
      }
    }
  }
  dispalySimpleservice(type): any {
    if (type == "Evaluation" || type == "Reevaluation") {
      return this.procedureTypeStatus = [
        { name: "Appointment Notification", status: 'correspondence_status', progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
        { name: "History", status: 'history_status', progress_name: 'history', icon: "fa fa-history", for: ["E"], url: "/history" },
        { name: "Records", status: 'record_status', progress_name: 'records', icon: "far fa-list-alt", for: ["E", "S"], url: "/records" },
        { name: "Examination Documents", status: 'examination_status', progress_name: 'examination', icon: "far fa-edit", for: ["E"], url: "/examination" },
        { name: "Transcription & Compilation", status: 'reports_status', progress_name: 'reports', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
        { name: "Billing", status: 'bill_on_demand_status', progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
    } else if (type == "Deposition") {
      return this.procedureTypeStatus = [
        { name: "Appointment Notification", status: 'correspondence_status', progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
        { name: "Transcription & Compilation", status: 'reports_status', progress_name: 'reports', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
        { name: "Billing", status: 'bill_on_demand_status', progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
    } else if (type == "Supplemental" || type == "IMERecords") {
      return this.procedureTypeStatus = [
        { name: "Appointment Notification", status: 'correspondence_status', progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
        { name: "Records", status: 'record_status', progress_name: 'records', icon: "far fa-list-alt", for: ["E", "S"], url: "/records" },
        { name: "Transcription & Compilation", status: 'reports_status', progress_name: 'reports', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
        { name: "Billing", status: 'bill_on_demand_status', progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
    }
  }
}
