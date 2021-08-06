import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { IntercomService } from 'src/app/services/intercom.service';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
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
export const MY_CUSTOM_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'MM-DD-YYYY hh:mm A Z',
  datePickerInput: 'MM-DD-YYYY hh:mm A Z',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
@Component({
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.scss'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }, { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }]
})
export class BillingInfoComponent implements OnInit, OnDestroy {
  billingTimelineInfo = [{ status_name: "Submitted to Claim Manager", date: "07-03-2021", time: "12:04 PM", status: true }, { status_name: "Accepted by Clearinghouse", date: "07-04-2021", time: "12:04 PM", status: true }, { status_name: "Accepted for Processing", date: "07-05-2021", time: "12:04 PM", status: true }]
  
  // { status_name: "Sent to Claims Administrator", date: "07-06-2021", time: "12:04 PM", status: true }, { status_name: "Closed", date: "07-09-2021", time: "12:04 PM", status: true }]
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() review: string;
  @Input() cancellation: boolean;
  isDOS = false;
  incompleteInformation: any;
  isIncompleteError: any = true;
  isExpandDetail = true;
  payerResponse: any = { old_response: [], new_response: [] };
  styleElement: HTMLStyleElement;
  subscription: any;
  dateofServiceForm: FormGroup;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, public billingService: BillingService, private intercom: IntercomService, private alertService: AlertService) {
    this.subscription = this.intercom.getBillDiagnosisChange().subscribe(res => {
      this.getIncomplete();
    })

    this.subscription = this.intercom.getBillingDetails().subscribe(res => {
      this.examinerId = res.examiner_id;
      this.billingData = res;
      this.ngOnInit();
    })
  }
  is_cancellation = false;
  ngAfterContentInit() {
    this.is_cancellation = this.cancellation;
    if (this.review != 'First') {
      this.dateofServiceForm.disable();
    } else {
      this.dateofServiceForm.enable();
    }
  }
  getIncomplete() {
    this.billingService.getIncompleteInfo(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, { isPopupValidate: false }).subscribe(res => {
      this.isIncompleteError = true;
    }, error => {
      this.isIncompleteError = false;
      this.incompleteInformation = error.error.data;
    })
  }
  examinerId = null;
  ngOnInit() {
    this.dateofServiceForm = this.formBuilder.group({
      claim_id: [this.paramsId.claim_id],
      date_of_service: [null]
    });
    this.styleElement = document.createElement("style");
    this.changeColors("#cccccc");
    this.billingService.getIncompleteInfo(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, { isPopupValidate: false }).subscribe(res => {
      this.isIncompleteError = true;
    }, error => {
      this.isIncompleteError = false;
      this.incompleteInformation = error.error.data;
    })
    this.dateofServiceForm.patchValue({
      claim_id: this.paramsId.claim_id,
      date_of_service: this.billingData.date_of_service
    })
    this.previousDateOfService = this.billingData.date_of_service;
    this.payerResponse['new_response'] = this.billingData.new_response;
    this.payerResponse['old_response'] = this.billingData.old_response;
    // for (let payer in this.billingData.payor_response_messages) {
    //   if (this.billingData.payor_response_messages[payer].payor_response_status == 'R') {
    //     if (this.billingData.payor_response_messages[payer].payor_response_message.length) {
    //       for (let arr in this.billingData.payor_response_messages[payer].payor_response_message) {
    //         this.billingData.payor_response_messages[payer].payor_response_message[arr]._attributes.status_date = this.billingData.payor_response_messages[payer].status_date;

    //       }

    //     } else {
    //       this.billingData.payor_response_messages[payer].payor_response_message._attributes.status_date = this.billingData.payor_response_messages[payer].status_date;
    //       this.payerResponse['new_response'] = this.billingData.new_response;
    //       this.payerResponse['old_response'] = this.billingData.old_response;
    //     }
    //   }
    // }

    this.changeColors(this.billingData.bill_status_color_code ? this.billingData.bill_status_color_code : '#E6E6E6')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeColors(color) {
    const head = document.getElementsByTagName("head")[0];
    const css = `
  .progress-status .mat-progress-bar-fill::after {
    background-color: ${color} !important;
  }  `;
    this.styleElement.innerHTML = "";
    this.styleElement.type = "text/css";
    this.styleElement.appendChild(document.createTextNode(css));
    head.appendChild(this.styleElement);
  }
  saveClicked() {
    if (!this.dateofServiceForm.get('date_of_service').value) {
      this.alertService.openSnackBar("Please select date of service", 'error')
      return
    }
    let data = { "examiner_id": this.billingData.examiner_id, "claimant_id": this.paramsId.claimant_id, "claim_id": this.paramsId.claim_id, "date_of_service": moment(this.dateofServiceForm.get('date_of_service').value).format("YYYY-MM-DD") }
    this.billingService.getOverlap(data).subscribe(res => {
      if (res.data) {
        if (res.data.is_overlap) {
          const dialogRef = this.dialog.open(AlertDialogueComponent, {
            width: '500px',
            data: { title: 'Date of Service', message: "There is already a billable item for this claim and date of service.", cancel: true, proceed: true, type: "info", info: true }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result.data) {
              this.dosSubmit();
            }
          })
        } else {
          this.dosSubmit();
        }
      }
    })
  }

  previousDateOfService = '';
  dosSubmit() {
    if (this.dateofServiceForm.get('date_of_service').value)
      this.dateofServiceForm.get('date_of_service').patchValue(moment(this.dateofServiceForm.get('date_of_service').value).format("YYYY-MM-DD"))
    this.billingService.createDateofService(this.dateofServiceForm.value, this.paramsId.billId).subscribe(res => {
      console.log(res.data)
      this.previousDateOfService = res.data[0].date_of_service || '';
      this.alertService.openSnackBar(res.message, "success");;
      this.getIncomplete();
    }, error => {
      this.alertService.openSnackBar(error.message.message, 'error');
    })
  }
  onCancleClick() {
    const dialogRef = this.dialog.open(AlertDialogueComponent, {
      width: '500px',
      data: { title: 'Date of Service', message: "Date of service going to empty. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.dateofServiceForm.patchValue({
          date_of_service: ""
        });
        this.dosSubmit();
      } else {
        this.dateofServiceForm.patchValue({
          date_of_service: this.previousDateOfService
        });
      }
    })
  }
  isFeedbackOpened = false;
  openFeedback() {
    this.isFeedbackOpened = true;
  }
}
