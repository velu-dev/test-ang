import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IntercomService } from 'src/app/services/intercom.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';

@Component({
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})
export class BillingInfoComponent implements OnInit, OnDestroy {
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() review: string;
  incompleteInformation: any;
  isIncompleteError: any = true;
  isExpandDetail = true;
  payerResponse: any = [];
  styleElement: HTMLStyleElement;
  subscription: any;
  constructor(public billingService: BillingService, private intercom: IntercomService) {
    this.subscription = this.intercom.getBillDiagnosisChange().subscribe(res => {
      this.billingService.getIncompleteInfo(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, { isPopupValidate: false }).subscribe(res => {
        this.isIncompleteError = true;
      }, error => {
        this.isIncompleteError = false;
        this.incompleteInformation = error.error.data;
      })
    })
  }

  ngOnInit() {
    this.styleElement = document.createElement("style");
    this.changeColors("#cccccc");
    this.billingService.getIncompleteInfo(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, { isPopupValidate: false }).subscribe(res => {
      this.isIncompleteError = true;
    }, error => {
      this.isIncompleteError = false;
      this.incompleteInformation = error.error.data;
    })

    for (let payer in this.billingData.payor_response_messages) {
      if (this.billingData.payor_response_messages[payer].payor_response_status == 'R') {
        if (this.billingData.payor_response_messages[payer].payor_response_message.length) {
          for (let arr in this.billingData.payor_response_messages[payer].payor_response_message) {
            this.billingData.payor_response_messages[payer].payor_response_message[arr]._attributes.status_date = this.billingData.payor_response_messages[payer].status_date;
            this.payerResponse.push(this.billingData.payor_response_messages[payer].payor_response_message[arr]._attributes);
          }

        } else {
          this.billingData.payor_response_messages[payer].payor_response_message._attributes.status_date = this.billingData.payor_response_messages[payer].status_date;
          this.payerResponse.push(this.billingData.payor_response_messages[payer].payor_response_message._attributes);
        }
      }
    }

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

}
