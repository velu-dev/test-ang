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
  //columnsToDisplay = [];
  //IcdDataSource = new MatTableDataSource([]);
  expandedElement;
  isMobile = false;
  // columnName = [];
  columnsToDisplay1 = [];
  expandedElement1;
  columnName1 = [];
  isMobile1 = false;
  // documentsData: any = new MatTableDataSource([]);
  //columnsToDisplay2 = [];
  expandedElement2;
  //columnName2 = [];
  //dataSourceDocList = new MatTableDataSource([]);
  // columnsToDisplayDoc = [];
  // expandedElement3;
  // columnsNameDoc = [];
  filterValue: string;
  // file: any;
  //documentType: any;
  paramsId: any = {};
  billingId: number;
  //documentList: any;
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
  paymentStatus: any;
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
        this.cookieService.set('billableItem', details.data.exam_procedure_name)
      }, error => {

      })
      if (!param.billingId) {
        this.billingService.billCreate(param.claim_id, param.billId).subscribe(bill => {
          console.log(bill)
          this.billingId = bill.data.bill_id
          this.paramsId['billingId'] = bill.data.bill_id;
        }, error => {
          this.logger.error(error)
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

  }
  tabIndex: number;
  tabchange(index) {
    this.tabIndex = index
    if (index == 0) {
      console.log(this.firstBillId)
      this.billingId = +this.firstBillId;
      let ids = {}
      ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.firstBillId };
      this.paramsId = ids;
      this.billingData = null;
      this.getBillingDetails();
    }
    if (index == 1) {
      if ((this.billingData && this.billingData.second_bill_id) || this.secondBillId) {
        this.secondBillId = this.secondBillId;
        this.billingId = +this.secondBillId;
        let ids = {}
        ids = { claimant_id: this.paramsId.claimant_id, claim_id: this.paramsId.claim_id, billId: this.paramsId.billId, billingId: this.secondBillId };
        this.paramsId = ids;
        this.getBillingDetails();
        this.billingData = null;
      } else {
        this.createSecondBill();
      }
    }
  }

  openAuto(e, trigger: MatAutocompleteTrigger) {
    e.stopPropagation()
    trigger.openPanel();
  }

  add(event: MatChipInputEvent, group: FormGroup): void {
    return;
  }

  // openDialog(status?: boolean, group?): void {
  //   const dialogRef = this.dialog.open(BillingPaymentDialog, {
  //     width: '800px',
  //     data: { status: status, id: group ? group.get('post_payment_id').value : null, billingId: this.billingId, claimId: this.paramsId.claim_id, billableId: this.paramsId.billId }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // this.getBillLineItem();
  //     }
  //   });
  // }

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
        this.getBillingDetails();
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
    })
  }

  ngOnInit() {
    this.tabIndex = 0;
    this.getBillingDetails();
    //table
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });

  }

  billTypestatus = false;
  getBillingDetails() {

    this.billingService.getBilling(this.paramsId.claim_id, this.paramsId.billId, this.billingId).subscribe(billing => {
      if (billing.data) {
        this.billingData = billing.data;
        if (!billing.data) {
          return;
        }

        if (this.billingData && this.billingData.bill_no) {
          this.intercom.setBillNo('CMBN' + this.billingData.bill_no);
          this.cookieService.set('billNo', 'CMBN' + this.billingData.bill_no)
        } else {
          this.intercom.setBillNo('Bill');
        }
        console.log(this.billingData.bill_id)
        if (this.billingData.second_bill_id) {
          this.secondBillId = this.billingData.second_bill_id
          if (!this.billTypestatus) {
            this.tabchange(1);
            this.billTypestatus = true;
          }
        }

      }
    }, error => {
      this.logger.error(error)
    })
  }


  getPaymentStatus(value) {
    this.paymentStatus = value;
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
  constructor(
    public dialogRef: MatDialogRef<billingOnDemandDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public billingService: BillingService,
    private alertService: AlertService) {
    dialogRef.disableClose = true;
    this.states = data.states
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
      this.selection1.clear()
      rec.data.map(doc => {
        if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
          this.selection1.select(doc);
        }
      })
      this.recipients = new MatTableDataSource(rec.data);
    })
  }


  download(data) {
    saveAs(data.exam_report_file_url, data.file_name);
    this.alertService.openSnackBar("File downloaded successfully", "success");
  }

  billingOnDemand() {
    this.billingService.getIncompleteInfo(this.data.claimId, this.data.billableId, { isPopupValidate: true }).subscribe(res => {

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
          selected_recipients.push(res)
          if (res.recipient_type.toLowerCase() != 'claimant') {
            recipientsDocuments_ids.push(res.data.id)
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
          console.log(result)
          if (result.data) {
            if (addressEmpty) {
              const dialogRef = this.dialog.open(AlertDialogueComponent, {
                width: '500px',
                data: { title: 'Bill on demand', message: "Recipient address seems to be incomplete. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result.data) {
                  this.billingService.onDemandBilling(data).subscribe(bill => {
                    this.data.on_demand_progress_status = 'In Progress';
                    this.data.last_bill_on_demand_request_date = new Date();
                    if (bill.data.exam_report_signed_file_url) {
                      recipientsDocuments_ids = [];
                      this.selection1.clear();
                      this.recipientsData.map(doc => {
                        if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
                          this.selection1.select(doc);
                        }
                      })
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
                } else {
                  return;
                }
              })
            } else {
              this.billingService.onDemandBilling(data).subscribe(bill => {
                this.data.on_demand_progress_status = 'In Progress';
                this.data.last_bill_on_demand_request_date = new Date();
                if (bill.data.exam_report_signed_file_url) {
                  recipientsDocuments_ids = [];
                  this.selection1.clear();
                  this.recipientsData.map(doc => {
                    if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
                      this.selection1.select(doc);
                    }
                  })
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
            this.billingService.onDemandBilling(data).subscribe(bill => {
              this.data.on_demand_progress_status = 'In Progress';
              this.data.last_bill_on_demand_request_date = new Date();
              if (bill.data.exam_report_signed_file_url) {
                recipientsDocuments_ids = [];
                this.selection1.clear();
                this.recipientsData.map(doc => {
                  if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
                    this.selection1.select(doc);
                  }
                })
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
          } else {
            return;
          }
        })
      } else {
        this.billingService.onDemandBilling(data).subscribe(bill => {
          if (bill.data.exam_report_signed_file_url) {
            recipientsDocuments_ids = [];
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
    }, error => {
      const dialogRef = this.dialog.open(BillingAlertComponent, {
        width: '500px',
        data: { title: 'Incomplete Information', incompleteInformation: error.error.data, ok: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        return
      })
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
    this.billingService.getIncompleteInfo(this.data.claimId, this.data.billableId, { isPopupValidate: true }).subscribe(res => {
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

  downloadMethod() {
    let selected_recipients = []
    this.selection1.selected.map(res => {
      if (res.type == "custom") {
        selected_recipients.push(res)
      } else {
        selected_recipients.push(res.data)

      }

    })
    this.billingService.billingDownloadAll(this.data.claimId, this.data.billableId, this.data.billingId, { selected_recipients: selected_recipients }).subscribe(doc => {
      saveAs(doc.data.file_url, doc.data.file_name, '_self');
      this.onDemandStatus = true;
      this.alertService.openSnackBar("Document(s) downloaded successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
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
  constructor(
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

