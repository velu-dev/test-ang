import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { saveAs } from 'file-saver';
import { IntercomService } from 'src/app/services/intercom.service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

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
export class BillingDocumentComponent implements OnInit, OnDestroy {
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() billType: any;
  columnsNameDoc = [];
  columnsToDisplayDoc = [];
  dataSource1: any;
  columnsToDisplays = [];
  columnNames = [];
  dataSourceDocList = new MatTableDataSource([]);
  expandIdDoc: any;
  expandedElement;
  subscription: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private claimService: ClaimService, public billingService: BillingService, private alertService: AlertService, private intercom: IntercomService, private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (this.isMobile) {
        this.columnsNameDoc = ["", "File Name"]
        this.columnsToDisplayDoc = ['is_expand', 'file_name']
      } else {
        this.columnsNameDoc = ["", "Ref #", "File Name", "Action", "Date", "Recipients", "Download" + '\n' + "Sent Documents", "Further Information"]
        this.columnsToDisplayDoc = ['doc_image', 'request_reference_id', 'file_name', 'action', "date", "recipients", 'download', 'payor_response_message']
      }
      this.isMobile = res;
      if (res) {
        this.columnNames = ["", "Ref #"]
        this.columnsToDisplays = ['is_expand', 'request_reference_id']
      } else {
        this.columnNames = ["Ref #", "Receiver Name", "Tracking Number", "Details"]
        this.columnsToDisplays = ['request_reference_id', 'receiver_name', "tracking_number", "more"]
      }
    });
    this.subscription = this.intercom.getBillDocChange().subscribe(res => {
      this.getDocument();
    })
  }

  ngOnInit() {
    this.getDocument();
  }

  getDocument() {
    this.billingService.getSendRecDocument(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, this.billType).subscribe(document => {
      this.dataSourceDocList = new MatTableDataSource(document.data);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  openElementDoc(element) {
    if (this.isMobile) {
      if (this.expandIdDoc && this.expandIdDoc == element.on_demand_service_request_id) {
        this.expandIdDoc = null;
      } else {
        this.expandIdDoc = element.on_demand_service_request_id;
      }
    }
  }
  expandId2: any;
  openElement2(element) {
    if (this.isMobile) {
      this.expandId2 = element.id;
    }
  }
  downloadDocumet(element, details?) {
    this.billingService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.claimService.updateActionLog({ type: "billing", "document_category_id": 8, "claim_id": this.paramsId.claim_id, "billable_item_id": this.paramsId.billId, "documents_ids": [element.document_id ? element.document_id : details.document_id] }).subscribe(res => {
      })
      saveAs(res.signed_file_url, element.file_name);
      this.getDocument();
    })
  }


}
// const ELEMENT_DATA = [
//   { "id": 132, "request_reference_id": "46895", "receiver_name": "dfasdad", "tracking_number": "", "more": "" }
// }