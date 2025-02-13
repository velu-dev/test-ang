import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
import { AlertService } from 'src/app/shared/services/alert.service';
import { BillingAlertComponent } from 'src/app/shared/components/billingalert/billing-alert.component';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import * as moment from 'moment-timezone';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoryComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource: any;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  paramsId: any;
  historyData: any;
  rushRequest: any;
  inFile: any = [];
  historyTrackingDatasource: any;
  columnsToDisplays = [];
  columnNames = [];
  ids: any;
  statusBarValues = { value: null, status: '', class: '' }
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('MatSortTracking', { static: true }) sortTracking: MatSort;
  is_cancellation = false;
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private onDemandService: OnDemandService, private alertService: AlertService, private intercom: IntercomService,
    public dialog: MatDialog, private cookieService: CookieService, public router: Router, private claimService: ClaimService) {

    this.route.params.subscribe(param => {
      this.paramsId = param;
      console.log(param);
      this.ids = {
        claimant_id: param.claimant_id,
        claim_id: param.claim_id,
        billable_item_id: param.billId
      }
      this.onDemandService.getBreadcrumbDetails(this.ids).subscribe(details => {
        console.log(details.data);
        this.intercom.setClaimant(details.data.claimant.first_name + ' ' + details.data.claimant.last_name);
        this.cookieService.set('claimDetails', details.data.claimant.first_name + ' ' + details.data.claimant.last_name)
        this.intercom.setClaimNumber(details.data.claim_number);
        this.cookieService.set('claimNumber', details.data.claim_number)
        this.intercom.setBillableItem(details.data.exam_procedure_name);
        this.cookieService.set('billableItem', details.data.exam_procedure_name);
        if (details.data.procedure_type == "Deposition") {
          this.router.navigate(['**']);
        } else if (details.data.procedure_type == "Supplemental") {
          this.router.navigate(['**']);
        }

      }, error => {

      })

    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'summary_download']
      } else {
        this.columnName = ["Ref #", "Date Requested", "File Name", "Rush Request?", "Date Received", "Download History Template", "Download Completed History"]
        this.columnsToDisplay = ['request_reference_id', "date_of_request", 'file_name', 'service_priority', "date_of_communication", 'history_document_download', 'summary_download']
      }
      this.isMobile = res;
      if (res) {
        this.columnNames = ["", "Phone Number"]
        this.columnsToDisplays = ['is_expand', 'phone_number']
      } else {
        this.columnNames = ["Historian", "Phone Number", "Call Start Time", "Call End Time", "Narration", "Created Date Time", "Cancel Reason", "Cancel Notes"]
        this.columnsToDisplays = ['historian', 'phone_number', 'call_start_time', "call_end_time", "narration", 'created_date_time', 'cancel_reason', 'cancel_notes']
      }
    })

  }

  ngOnInit() {
    this.getHistory();
    this.getHistoryCallTracking();
    this.styleElement = document.createElement("style");
    this.changeColors("#E6E6E6");
  }
  styleElement: HTMLStyleElement;
  changeColors(color) {
    color = color ? color : "#E6E6E6";
    const head = document.getElementsByTagName("head")[0];
    const css = `
  .progress .mat-progress-bar-fill::after {
    background-color: ${color} !important;
  }  `;
    this.styleElement.innerHTML = "";
    this.styleElement.type = "text/css";
    this.styleElement.appendChild(document.createTextNode(css));
    head.appendChild(this.styleElement);
  }
  isMedicalhistoryShow: boolean = false;
  getHistory() {
    this.inFile = [];
    this.onDemandService.getHistory(this.paramsId.claim_id, this.paramsId.billId).subscribe(history => {
      this.is_cancellation = history.is_cancellation;
      this.historyData = history;
      if (this.historyData.on_demand_status_id == null || this.historyData.on_demand_status_id == 7 || this.historyData.on_demand_status_id == 9 || this.historyData.on_demand_status_id == 10 || this.historyData.on_demand_status_id == 25) {
        this.isMedicalhistoryShow = true;
      } else {
        this.isMedicalhistoryShow = false;
      }
      this.changeColors(history.on_demand_status_color_code);
      this.historyData.documents_sent_and_received.map(inFile => {
        this.inFile.push(inFile);
      })
      this.dataSource = new MatTableDataSource(this.inFile);
      this.dataSource.sort = this.sort;

      this.statusBarChanges(this.historyData.on_demand_status_id)
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

  getHistoryCallTracking() {
    this.onDemandService.getHistoryCallTracking(this.paramsId.claim_id, this.paramsId.billId).subscribe(history => {
      this.historyTrackingDatasource = new MatTableDataSource(history.data ? history.data : []);
      this.historyTrackingDatasource.sort = this.sortTracking;
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }


  statusBarChanges(status) {
    switch (status) {
      case 7:
        this.statusBarValues = { value: 0, status: status, class: 'not-sent' }
        break;
      case 8:
        this.statusBarValues = { value: 50, status: status, class: 'sent' }
        break;
      case 9:
        this.statusBarValues = { value: 100, status: status, class: 'complete' }
        break;
      case 10:
        this.statusBarValues = { value: 50, status: status, class: 'error' }
        break;
      case 11:
        this.statusBarValues = { value: 50, status: status, class: 'error' }
        break;

      default:
        this.statusBarValues = { value: 50, status: 'Error', class: 'error' }
        break;
    }
  }


  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element.document_id) {
        this.expandId = null;
      } else {
        this.expandId = element.document_id;
      }

  }
  expandId1: any;
  openElement1(element) {
    if (this.isMobile) {
      this.expandId1 = element.id;
    }
  }


  onDemandSubmit() {
    if (!this.historyData.examiner_detail_id) {
      this.alertService.openSnackBar('Please assign examiner', 'error');
      return;
    }

    let data = {
      claim_id: this.paramsId.claim_id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      //service_description: "",
      document_category_id: 2,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: 2,
      examiner_detail_id: this.historyData.examiner_detail_id,
      examiner_user_id: this.historyData.examiner_user_id
      //service_provider_id: this.historyData.documets[0].service_provider_id // default 3
    }
    // this.onDemandService.requestCreate(data).subscribe(history => {
    //   this.rushRequest = false;
    //   this.alertService.openSnackBar("Medical History Questionnaire On Demand created successfully", 'success');
    // }, error => {
    //   this.alertService.openSnackBar(error.error.message, 'error');
    // })

    this.onDemandService.OnDemandhistory(data).subscribe(history => {

      this.rushRequest = false;
      saveAs(history.data.file_url, history.data.file_name, "_self");
      // this.download({ file_url: history.data.file_url, file_name: history.data.file_name })
      this.alertService.openSnackBar("Medical History Questionnaire On Demand created successfully", 'success');
      this.getHistory();
    }, error => {
      if (error.error && error.error.error && error.error.error.data && error.error.error.data.length) {
        console.log(error)
        const dialogRef = this.dialog.open(BillingAlertComponent, {
          width: '500px',
          data: { title: 'Incomplete Information', incompleteInformation: error.error.error.data, ok: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          return
        })
        return;
      }
      if (typeof (error.error.message) == 'object') {
        let timezone = moment.tz.guess();
        let date = moment(error.error.message.requested_on.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
        this.alertService.openSnackBar(error.error.message.message + ' ' + date, 'error');
        return;
      }
      this.alertService.openSnackBar(error.error.message, 'error');
    })



  }
  timeZone = "";
  toPSTtime(date) {
    if (date) {
      let timezone = moment.tz.guess();
      // return moment.tz(date, 'YYYY/MM/DD', 'America/Los_Angeles').format('MM-DD-YYYY hh:mm A z');
      return moment(date).tz("America/Los_Angeles").format('MM-DD-YYYY hh:mm A z');
    }
  }
  downloadSentFile(data) {
    console.log(data)
    saveAs(data.send.file_url, data.send.file_name, "_self");
  }
  download(data) {
    this.claimService.updateActionLog({ type: "history", "document_category_id": 3, "claim_id": this.ids.claim_id, "billable_item_id": this.ids.billable_item_id, "documents_ids": [data.document_id] }, false).subscribe(log => {
    })
    data.received.map(res => {
      saveAs(res.file_url, res.file_name, "_self");
    })

  }

}
