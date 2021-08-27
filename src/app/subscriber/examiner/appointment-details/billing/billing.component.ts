import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map, startWith, debounceTime, switchMap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { NGXLogger } from 'ngx-logger';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSort } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
// import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { AddAddress } from '../correspondance/correspondance.component';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { BillingAlertComponent } from 'src/app/shared/components/billingalert/billing-alert.component';
import * as moment from 'moment-timezone';
import { Location } from '@angular/common';

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM-dd-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export const PICK_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
@Component({
  selector: 'app-billable-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      state('void', style({ height: '0px', minHeight: '0' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})


export class BilllableBillingComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  expandedElement;
  isMobile = false;
  columnsToDisplay1 = [];
  expandedElement1;
  columnName1 = [];
  isMobile1 = false;
  expandedElement2;
  filterValue: string;
  paramsId: any;
  billingId: number;
  eaxmProcuderalCodes: any;
  procuderalCodes: any;
  modifiers: any;
  billingData: any;
  payors: any;

  //table
  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;

  visible = true;
  selectable = true;
  removable = true;
  states: any;
  role = this.cookieService.get('role_id');
  firstBillId: string;
  secondBillId: string;
  independentBillId: string;
  sbrPaymentStatus: any;
  ibrPaymentStatus: any;
  review: any = 'First';
  voidType: any;
  paidStatusData: any;
  tabIndex: number = 0;
  isIME: boolean = false;
  constructor(private logger: NGXLogger, private claimService: ClaimService, private breakpointObserver: BreakpointObserver,
    private alertService: AlertService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public billingService: BillingService,
    private fb: FormBuilder,
    private intercom: IntercomService,
    private _location: Location,
    private cookieService: CookieService) {
    if (+this.role == 4) {
      this._location.back();
      return;
    }
    this.intercom.setBillNo('Bill');
    this.cookieService.set('billNo', null)
    this.route.params.subscribe(param => {
      this.paramsId = param;
      let ids = {
        claimant_id: param.claimant_id,
        claim_id: param.claim_id,
        billable_item_id: param.billId
      }
      this.billingService.getBreadcrumbDetails(ids).subscribe(details => {
        this.intercom.setClaimant(details.data.claimant.first_name + ' ' + details.data.claimant.last_name);
        this.cookieService.set('claimDetails', details.data.claimant.first_name + ' ' + details.data.claimant.last_name)
        this.intercom.setClaimNumber(details.data.claim_number);
        this.cookieService.set('claimNumber', details.data.claim_number)
        this.intercom.setBillableItem(details.data.exam_procedure_name);
        this.cookieService.set('billableItem', details.data.exam_procedure_name);
        if (details.data && details.data.exam_procedure_name.includes('IME')) {
          this.isIME = true;
        }
      }, error => {

      })
      if (!param.billingId) {
        this.billingService.billCreate(param.claim_id, param.billId).subscribe(bill => {
          console.log(bill)
          this.billingId = bill.data.bill_id
          let params = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: bill.data.bill_id }
          this.paramsId = params;
          this.getBillIds()
        }, error => {
          this.logger.error(error)
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      } else {
        this.billingId = param.billingId
      }
      this.firstBillId = param.billingId
      this.logger.log(this.billingId, "billing id")

    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })

    this.billingService.seedData("state").subscribe(res => {
      this.states = res.data;
    })

    this.billingService.seedData('void_type_seed_data').subscribe(data => {
      this.voidType = data.data;
    })

    this.billingService.seedData('response_type_seed_data').subscribe(data => {
      this.paidStatusData = data.data;
    })
  }

  openAuto(e, trigger: MatAutocompleteTrigger) {
    e.stopPropagation()
    trigger.openPanel();
  }

  add(event: MatChipInputEvent, group: FormGroup): void {
    return;
  }

  openBillOnDemand(): void {
    const dialogRef = this.dialog.open(billingOnDemandDialog, {
      width: '800px',
      data: {
        billingId: this.billingId, claimId: this.paramsId.claim_id, billableId: this.paramsId.billId,
        states: this.states, on_demand_progress_status: this.billingData.on_demand_progress_status, is_w9_form: this.billingData.is_w9_form,
        last_bill_on_demand_request_date: this.billingData.last_bill_on_demand_request_date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBillingDetails(true);
      }
    });
  }



  createSecondBill() {
    this.billingService.createSecondBill(this.billingId, this.paramsId.claim_id, this.paramsId.billId).subscribe(second => {
      this.billingId = second.data.bill_id;
      this.secondBillId = second.data.bill_id;
      let ids = {}
      ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.secondBillId };
      this.paramsId = ids;
      this.getBillingDetails();
      this.billingData = null;
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  createIBR() {
    this.billingService.createIBR(this.paramsId.claim_id, this.paramsId.billId, this.BillIds.first_bill_id, this.secondBillId).subscribe(second => {
      this.billingId = second.data.bill_id;
      this.independentBillId = second.data.bill_id;
      let ids = {}
      ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.independentBillId };
      this.paramsId = ids;
      this.getBillingDetails();
      this.billingData = null;
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  BillIds: any;
  ngOnInit() {

    //table
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    if (this.paramsId.billingId) {
      this.getBillIds()
    }

  }

  getBillIds() {
    this.billingService.getSubmission(this.paramsId.claim_id, this.paramsId.billId).subscribe(submission => {
      console.log(submission.data);
      this.BillIds = submission.data;
      let tabIndex = 0;
      if (submission.data.independent_bill_id) {
        this.billingId = submission.data.independent_bill_id;
        this.independentBillId = submission.data.independent_bill_id;
        this.firstBillId = submission.data.first_bill_id;
        this.secondBillId = submission.data.second_bill_id;
        tabIndex = 2;
      }
      else if (submission.data.second_bill_id) {
        this.billingId = submission.data.second_bill_id;
        this.secondBillId = submission.data.second_bill_id;
        this.firstBillId = submission.data.first_bill_id;
        tabIndex = 1;
      }
      else if (submission.data.first_bill_id) {
        this.billingId = submission.data.first_bill_id;
        this.firstBillId = submission.data.first_bill_id;
        tabIndex = 0;
        this.getBillingDetails();
      }
      if (this.paramsId.submissionType) {
        if(this.paramsId.submissionType === 'independent') {
          tabIndex = 2;
        } else if(this.paramsId.submissionType === 'second') {
          tabIndex = 1;
        } else {
          tabIndex = 0;
        }
        this.tabchange(tabIndex)
      }
      this.tabIndex = tabIndex;
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }


  tabchange(index) {
    console.log(index, "tab change")
    this.tabIndex = index
    if (index == 0) {
      this.billingData = null;
      console.log(this.firstBillId)
      this.billingId = +this.firstBillId;
      let ids = {}
      ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.firstBillId };
      this.paramsId = ids;
      this.getBillingDetails();
      this.review = 'First'
    }
    if (index == 1) {
      console.log(index, this.secondBillId)
      this.billingData = null;
      if (this.secondBillId) {
        this.billingId = +this.secondBillId;
        let ids = {}
        ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.secondBillId };
        this.paramsId = ids;
        this.getBillingDetails();
      } else {
        this.createSecondBill();
      }
      this.review = 'Second'
    }

    if (index == 2) {
      this.billingData = null;
      if (this.independentBillId) {
        this.billingId = +this.independentBillId;
        let ids = {}
        ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.independentBillId };
        this.paramsId = ids;
        this.getBillingDetails();
      } else {
        this.createIBR();
      }

      this.review = 'Independent'
    }
  }

  is_cancellation = false;
  getBillingDetails(status?) {
    this.billingService.getBilling(this.paramsId.claim_id, this.paramsId.billId, this.billingId).subscribe(billing => {
      console.log("billing data", billing)
      if (billing.data) {
        this.is_cancellation = billing.data.is_cancellation;
        this.billingData = billing.data;
        if (!billing.data) {
          return;
        }
        if (status) {
          this.intercom.setBillingDetails(this.billingData)
        }
        if (this.billingData && this.billingData.bill_no) {
          this.intercom.setBillNo('CMBN' + this.billingData.bill_no);
          this.cookieService.set('billNo', 'CMBN' + this.billingData.bill_no)
        } else {
          this.intercom.setBillNo('Bill');
        }
      }
    }, error => {
      this.logger.error(error)
    })
  }


  getPaymentStatus(value) {
    if (this.tabIndex == 1) {
      this.ibrPaymentStatus = value
    } else {
      this.sbrPaymentStatus = value;
    }

  }



  expandId1: any;

  downloadDocumet(element, details?) {
    this.billingService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.claimService.updateActionLog({ type: "billing", "document_category_id": 8, "claim_id": this.paramsId.claim_id, "billable_item_id": this.paramsId.billId, "documents_ids": [element.document_id ? element.document_id : details.document_id] }).subscribe(res => {
      })
      saveAs(res.signed_file_url, element.file_name);
      this.getBillingDetails();
    })
  }


}

///Blling end


//recipient select
@Component({
  selector: 'bill-on-demand-dialog',
  templateUrl: 'bill-on-demand-dialog.html',
})
export class billingOnDemandDialog {
  recipients: any = new MatTableDataSource([]);
  selection1 = new SelectionModel<any>(true, []);
  displayedColumns1: string[] = ['select', 'recipient_type'];
  states: any;
  onDemandStatus: boolean = false;
  is_cancellation = false;
  constructor(
    public dialogRef: MatDialogRef<billingOnDemandDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public billingService: BillingService,
    private alertService: AlertService) {
    dialogRef.disableClose = true;
    this.states = data.states
    console.log(data)
    this.getBillRecipient();
  }

  onNoClick(): void {
    this.dialogRef.close(this.onDemandStatus);
  }

  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.recipients.data.forEach(row => this.selection1.select(row));
  }

  isAllSelected1() {
    if (this.recipients.data) {
      const numSelected = this.selection1.selected.length;
      const numRows = this.recipients.data.length;
      return numSelected === numRows;
    }
  }

  checkboxLabel1(row?: any): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.recipient_type + 1}`;
  }

  allOrNone1(status) {
    if (!status) {
      this.selection1.clear()
    } else {
      this.recipients.data.forEach(row => this.selection1.select(row))
    }
  }

  openCustomRecipient(): void {
    const dialogRef = this.dialog.open(BillingCustomRecipient, {
      width: '800px',
      data: { claim_id: this.data.claimId, billable_id: this.data.billableId, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBillRecipient();
      }
    });
  }

  isEditRecipient: boolean = false;
  editRecipient(element) {
    this.isEditRecipient = true;
    const dialogRef = this.dialog.open(BillingCustomRecipient, {
      width: '800px',
      data: { claim_id: this.data.claimId, billable_id: this.data.billableId, data: element, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBillRecipient();
      }
    });
  }

  deleteRecipient(element) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: "remove this recipient", address: true, title: element.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.billingService.removeRecipient(element.id, { request_type: "billing", claim_id: this.data.claimId, billable_item_id: this.data.billableId }).subscribe(res => {
          if (res.status) {
            this.getBillRecipient();
            this.alertService.openSnackBar(res.message, "success")
          } else {
            this.alertService.openSnackBar(res.message, "error")
          }
        });
      } else {
        return;
      }
    });
  }
  recipientsData: any;
  getBillRecipient() {
    this.billingService.getBillRecipient(this.data.claimId, this.data.billableId).subscribe(rec => {
      this.recipientsData = rec.data;
      let secondRecData = []
      this.selection1.clear()
      rec.data.map(doc => {
        if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
          if (this.data.billType == 2) { //Bill stype Second
            secondRecData.push(doc);
          }
          this.selection1.select(doc);
        }
      })
      // let tableData = this.data.billType == 2 ? secondRecData : this.recipientsData;
      this.recipients = new MatTableDataSource(this.recipientsData);
    })
  }


  download(data, directDownload = false) {
    // if (this.selection1.selected.length > 1 && this.data.billType === 2 && !directDownload) {
    //   this.showSecondBillReviewAlert(() => this.download(data, true));
    //   return;
    // }
    saveAs(data.exam_report_file_url, data.file_name);
    this.alertService.openSnackBar("File downloaded successfully", "success");
  }

  billingOnDemand() {
    this.billingService.getIncompleteInfo(this.data.claimId, this.data.billableId, this.data.billingId, { isPopupValidate: true }).subscribe(res => {

      if (this.selection1.selected.length == 0) {
        this.alertService.openSnackBar('Please select Recipient(s)', "error");
        return;
      }

      if (this.selection1.selected.length > 12) {
        this.alertService.openSnackBar('Maximum 12 Recipients Allowed', "error");
        return;
      }
      let selected_recipients = []
      let recipientsDocuments_ids: any = [];
      let addressEmpty = false;
      let isClaimant = false;
      let isInsurance = false;
      let isInsuranceAddress = false;
      this.selection1.selected.map(res => {
        if (res.type == "custom") {
          recipientsDocuments_ids.push(res.id)
          selected_recipients.push(res)
        } else {
          if (!res.message) {
            selected_recipients.push(res);
          }
          if (res.recipient_type.toLowerCase() != 'claimant') {
            if (!res.message) {
              recipientsDocuments_ids.push(res.data.id)
            }
          } else {
            isClaimant = true
          }
        }
        if (res.message) {
          addressEmpty = true;
        }

        if (res.recipient_type && res.recipient_type == 'Insurance Company') {
          isInsurance = true
        }

        if (res.recipient_type && res.recipient_type == 'Insurance Company' && res.message) {
          isInsuranceAddress = true
        }
      })
      if (!isInsurance) {
        this.alertService.openSnackBar('Please select Insurance Company', "error");
        return;
      }
      if (isInsuranceAddress) {
        this.alertService.openSnackBar('Insurance Company address is mandatory', "error");
        return;
      }

      let data = {
        claim_id: this.data.claimId,
        document_category_id: 8,
        billable_item_id: this.data.billableId,
        service_request_type_id: 5,
        bill_id: this.data.billingId,
        //documents_ids: [1753, 1755],
        recipients_id: recipientsDocuments_ids,
        isClaimant: isClaimant,
        selected_recipients: selected_recipients
      }
      if (!this.data.is_w9_form) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Bill on demand', message: "W9 Form not included. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            if (addressEmpty) {
              const dialogRef = this.dialog.open(AlertDialogueComponent, {
                width: '500px',
                data: { title: 'Bill on demand', message: "Recipient address seems to be incomplete. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result.data) {
                  if (this.data.billType == 1) {
                    this.firstBillOnDemand(data);
                  } else if (this.data.billType == 2) {
                    this.secondBillOnDemand(data);
                  }

                } else {
                  return;
                }
              })
            } else {
              if (this.data.billType == 1) {
                this.firstBillOnDemand(data);
              } else if (this.data.billType == 2) {
                this.secondBillOnDemand(data);
              }

            }
          }
        })
        return
      }

      if (addressEmpty) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Bill on demand', message: "Recipient address seems to be incomplete. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            if (this.data.billType == 1) {
              this.firstBillOnDemand(data);
            } else if (this.data.billType == 2) {
              this.secondBillOnDemand(data);
            }

          } else {
            return;
          }
        })
      } else {
        if (this.data.billType == 1) {
          this.firstBillOnDemand(data);
        } else if (this.data.billType == 2) {
          this.secondBillOnDemand(data);
        }

      }
    }, error => {
      const dialogRef = this.dialog.open(BillingAlertComponent, {
        width: '500px',
        data: { title: 'Incomplete Information', message: "Without the information listed above the bill will be rejected.<br/>Please, enter the missing information.", incompleteInformation: error.error.data, warning: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        return
      })
    })
  }

  firstBillOnDemand(data) {
    this.billingService.onDemandBilling(data).subscribe(bill => {
      if (bill.data.exam_report_signed_file_url) {
        this.selection1.clear();
        this.recipientsData.map(doc => {
          if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
            this.selection1.select(doc);
          }
        })
        this.data.on_demand_progress_status = 'In Progress';
        this.data.last_bill_on_demand_request_date = new Date();
        this.download({ exam_report_file_url: bill.data.exam_report_signed_file_url, file_name: bill.data.exam_report_csv_file_name })
      }
      if (bill.data.bill_on_demand_signed_zip_file_url) {
        this.download({ exam_report_file_url: bill.data.bill_on_demand_signed_zip_file_url, file_name: bill.data.bill_on_demand_zip_file_name })

      }

      if (bill.data.dtm_file_url) {
        this.download({ exam_report_file_url: bill.data.dtm_file_url, file_name: bill.data.dtm_file_name })
      }
      this.onDemandStatus = true;
      this.alertService.openSnackBar("Billing On Demand created successfully", 'success');
    }, error => {
      if (typeof (error.error.message) == 'object') {
        let timezone = moment.tz.guess();
        let date = moment(error.error.message.requested_on.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
        this.alertService.openSnackBar(error.error.message.message + ' ' + date, 'error');
        return;
      }
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  secondBillOnDemand(data) {
    if (this.selection1.selected.length > 1 && this.data.billType === 2) {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: "500px",
        data: {
          title: "Recipients",
          type: 'info',
          proceed: true,
          cancel: true,
          message: 'Only the Insurance Company requires the request for Second Bill Review'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res.data) {
          this.billondemand(data);
        }
      });
    } else {
      this.billondemand(data);
    }
  }
  billondemand(data) {
    this.billingService.secondBillOnDemand(data).subscribe(secondbill => {

      if (secondbill.data.exam_report_signed_file_url) {
        this.selection1.clear();
        this.recipientsData.map(doc => {
          if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
            this.selection1.select(doc);
          }
        })
        this.data.on_demand_progress_status = 'In Progress';
        this.data.last_bill_on_demand_request_date = new Date();
        this.download({ exam_report_file_url: secondbill.data.exam_report_signed_file_url, file_name: secondbill.data.exam_report_csv_file_name })
      }
      if (secondbill.data.bill_on_demand_signed_zip_file_url) {
        this.download({ exam_report_file_url: secondbill.data.bill_on_demand_signed_zip_file_url, file_name: secondbill.data.bill_on_demand_zip_file_name })

      }

      if (secondbill.data.dtm_file_url) {
        this.download({ exam_report_file_url: secondbill.data.dtm_file_url, file_name: secondbill.data.dtm_file_name })
      }
      this.onDemandStatus = true;
      this.alertService.openSnackBar("Billing On Demand created successfully", 'success');
    }, error => {
      if (typeof (error.error.message) == 'object') {
        let timezone = moment.tz.guess();
        let date = moment(error.error.message.requested_on.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
        this.alertService.openSnackBar(error.error.message.message + ' ' + date, 'error');
        return;
      }
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  typeIfRecipient = "";
  openAddAddress(element): void {
    this.typeIfRecipient = element.recipient_type;
    const dialogRef = this.dialog.open(AddAddress, {
      width: '800px',
      data: { type: this.typeIfRecipient, data: element.data, state: this.states }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getBillRecipient();
    });
  }

  downloadAll() {
    // if (this.billingData.documets_sent_and_received.length == 0) {
    //   this.alertService.openSnackBar("Document not found", "error");
    //   return;
    // }
    if (this.selection1.selected.length > 12) {
      this.alertService.openSnackBar('Maximum 12 Recipients Allowed', "error");
      return;
    }
    this.billingService.getIncompleteInfo(this.data.claimId, this.data.billableId, this.data.billingId, { isPopupValidate: true }).subscribe(res => {
      if (!this.data.is_w9_form) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Bill on demand', message: "W9 Form not included. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.downloadMethod();
          }
        })
        return
      } else {
        this.downloadMethod()
      }
    }, error => {
      const dialogRef = this.dialog.open(BillingAlertComponent, {
        width: '500px',
        data: { title: 'Incomplete Information', incompleteInformation: error.error.data, ok: false, cancel: true, proceed: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          this.downloadMethod();
        }
      })
    })
  }

  downloadMethod(directDownload = false) {
    if (this.selection1.selected.length > 1 && this.data.billType === 2 && !directDownload) {
      this.showSecondBillReviewAlert(() => this.downloadMethod(true));
      return;
    }
    let selected_recipients = []
    this.selection1.selected.map(res => {
      if (res.type == "custom") {
        selected_recipients.push(res)
      } else {
        selected_recipients.push(res.data)

      }

    })
    this.billingService.billingDownloadAll(this.data.claimId, this.data.billableId, this.data.billingId, this.data.billType, { selected_recipients: selected_recipients }).subscribe(doc => {
      saveAs(doc.data.file_url, doc.data.file_name, '_self');
      this.onDemandStatus = true;
      this.alertService.openSnackBar("Document(s) downloaded successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  showSecondBillReviewAlert(callbackAfterClosed: () => void) {
    const dialogRef = this.dialog.open(AlertDialogueComponent, {
      width: "500px",
      data: {
        title: "Recipients",
        type: 'info',
        proceed: true,
        cancel: true,
        message: 'Only the Insurance Company requires the request for Second Bill Review'
      }
    });
    dialogRef.afterClosed().subscribe((res) => res.data ? callbackAfterClosed() : null);
  }

}

//bill recipient Add/Edit
@Component({
  selector: 'billing-custom-recipient',
  templateUrl: 'billing-custom-recipient.html',
})
export class BillingCustomRecipient {
  customReceipient: any;
  states: any = [];
  claim_id: any;
  billable_id: any;
  isEdit: any = false;
  recipientData = {};
  streetbillcustomAddressList = [];
  isbillcustomAddressError = false;
  isbillcustomAddressSearched = false;
  constructor(
    public claimService: ClaimService,
    public dialogRef: MatDialogRef<BillingCustomRecipient>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, public billingService: BillingService,
    private alertService: AlertService) {
    this.billingService.seedData("state").subscribe(res => {
      this.states = res.data;
    })
    dialogRef.disableClose = true;
    this.claim_id = data['claim_id'];
    this.billable_id = data['billable_id'];
    this.isEdit = data['isEdit'];
  }
  ngOnInit() {
    this.customReceipient = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      street1: [null, Validators.required],
      street2: [null],
      city: [null, Validators.required],
      state_id: [null, Validators.required],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'), Validators.required])],
    })
    if (this.isEdit) {
      if (this.data["data"].zip_code_plus_4) {
        this.data["data"].zip_code = this.data["data"].zip_code + '-' + this.data["data"].zip_code_plus_4;
      }
      this.data['data'].state_id = this.data['data'].state;
      this.changeState(this.data['data'].state, this.data['data'].state_code);
      this.customReceipient.patchValue(this.data["data"]);
    }

    this.customReceipient.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isbillcustomAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetbillcustomAddressList = address.suggestions;
            this.isbillcustomAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isbillcustomAddressError = true;
            this.streetbillcustomAddressList = [];
          })
        else
          this.streetbillcustomAddressList = [];
      })
  }
  recipientState = {};
  changeState(state, state_code?) {
    if (state_code) {
      this.recipientState = state_code;
      return;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.recipientState = res.state_code;
      }
    })
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })

    this.customReceipient.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state_id: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  saveClick() {
    Object.keys(this.customReceipient.controls).forEach((key) => {
      if (this.customReceipient.get(key).value && typeof (this.customReceipient.get(key).value) == 'string')
        this.customReceipient.get(key).setValue(this.customReceipient.get(key).value.trim())
    });
    if (this.customReceipient.invalid) {
      return
    }
    this.billingService.postBillRecipient(this.claim_id, this.billable_id, this.customReceipient.value).subscribe(res => {
      if (res.status) {
        this.alertService.openSnackBar(res.message, "success");
        this.dialogRef.close(res)
      } else {
        this.alertService.openSnackBar(res.message, "error");
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

