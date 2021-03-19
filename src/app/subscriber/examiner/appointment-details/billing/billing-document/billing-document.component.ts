import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-billing-document',
  templateUrl: './billing-document.component.html',
  styleUrls: ['./billing-document.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      state('void', style({ height: '0px', minHeight: '0' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingDocumentComponent implements OnInit {
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  columnsNameDoc = [];
  columnsToDisplayDoc = [];
  dataSourceDocList = new MatTableDataSource([]);
  expandIdDoc: any;
  expandedElement;
  constructor(private claimService: ClaimService, public billingService: BillingService, private alertService: AlertService) {
    if (this.isMobile) {
      this.columnsNameDoc = ["", "File Name"]
      this.columnsToDisplayDoc = ['is_expand', 'file_name']
    } else {
      this.columnsNameDoc = ["", "Ref #", "File Name", "Action", "Date", "Recipients", "Download" + '\n' + "Sent Documents", "Further Information"]
      this.columnsToDisplayDoc = ['doc_image', 'request_reference_id', 'file_name', 'action', "date", "recipients", 'download', 'payor_response_message']
    }
  }

  ngOnInit() {
    this.dataSourceDocList = new MatTableDataSource(this.billingData.documets_sent_and_received);
  }


  openElementDoc(element) {
    if (this.isMobile) {
      if (this.expandIdDoc && this.expandIdDoc == element.document_id) {
        this.expandIdDoc = null;
      } else {
        this.expandIdDoc = element.document_id;
      }
    }
  }

  downloadDocumet(element, details?) {
    this.billingService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.claimService.updateActionLog({ type: "billing", "document_category_id": 8, "claim_id": this.paramsId.claim_id, "billable_item_id": this.paramsId.billId, "documents_ids": [element.document_id ? element.document_id : details.document_id] }).subscribe(res => {
      })
      saveAs(res.signed_file_url, element.file_name);
      // this.getBillingDetails();
    })
  }


}
