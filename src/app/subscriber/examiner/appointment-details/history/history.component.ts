import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
import { AlertService } from 'src/app/shared/services/alert.service';
import { BillingAlertComponent } from 'src/app/shared/components/billingalert/billing-alert.component';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import * as moment from 'moment-timezone';
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
  statusBarValues = { value: null, status: '', class: '' }
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private onDemandService: OnDemandService, private alertService: AlertService, private intercom: IntercomService,
    public dialog: MatDialog, private cookieService: CookieService, public router: Router) {

    this.route.params.subscribe(param => {
      this.paramsId = param;
      console.log(param);
      let ids = {
        claimant_id: param.claimant_id,
        claim_id: param.claim_id,
        billable_item_id: param.billId
      }
      this.onDemandService.getBreadcrumbDetails(ids).subscribe(details => {
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
        this.columnsToDisplay = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName = ["Ref #", "Date Requested", "File Name", "Rush Request?", "Date Received", "Download"]
        this.columnsToDisplay = ['request_reference_id', "date_of_request", 'file_name', 'service_priority', "date_of_communication", 'download']
      }
    })
  }

  ngOnInit() {
    this.getHistory();
  }

  getHistory() {
    this.onDemandService.getHistory(this.paramsId.claim_id, this.paramsId.billId).subscribe(history => {
      this.historyData = history;
      this.historyData.documets_sent_and_received.map(inFile => {
        if (inFile.transmission_direction == 'IN') {
          this.inFile.push(inFile)
        }

      })
      this.dataSource = new MatTableDataSource(this.inFile);

      this.statusBarChanges(this.historyData.on_demand_status)
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

  statusBarChanges(status) {
    switch (status) {
      case 'Unsent':
        this.statusBarValues = { value: 0, status: status, class: 'not-sent' }
        break;
      case 'In Progress':
        this.statusBarValues = { value: 50, status: status, class: 'sent' }
        break;
      case 'Completed':
        this.statusBarValues = { value: 100, status: status, class: 'complete' }
        break;
      case 'Error':
        this.statusBarValues = { value: 50, status: status, class: 'error' }
        break;

      default:
        this.statusBarValues = { value: 0, status: 'Error', class: 'error' }
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

  onDemandSubmit() {

    if (!this.paramsId.examiner) {
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
      examiner_id: this.paramsId.examiner
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
      this.download({ file_url: history.data.file_url, file_name: history.data.file_name })
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

  download(data) {
    saveAs(data.file_url, data.file_name, "_self");
  }

}
