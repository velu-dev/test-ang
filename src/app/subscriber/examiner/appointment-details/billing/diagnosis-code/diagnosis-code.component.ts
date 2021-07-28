import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { IntercomService } from 'src/app/services/intercom.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { Location } from '@angular/common';
import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-diagnosis-code',
  templateUrl: './diagnosis-code.component.html',
  styleUrls: ['./diagnosis-code.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      state('void', style({ height: '0px', minHeight: '0' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DiagnosisCodeComponent implements OnInit {
  icdCtrl = new FormControl();
  icdSearched = false;
  filteredICD: any = [];
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() cancellation: any;
  icdExpandID: any;
  IcdDataSource = new MatTableDataSource([]);
  columnsToDisplay = [];
  columnName = [];
  expandedElement;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private logger: NGXLogger,
    private claimService: ClaimService,
    private breakpointObserver: BreakpointObserver,
    private alertService: AlertService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public billingService: BillingService,
    private fb: FormBuilder,
    private intercom: IntercomService,
    private _location: Location,
    private cookieService: CookieService) { }
  is_cancellation = false;
  ngAfterContentInit() {
    this.is_cancellation = this.cancellation;
  }
  isPaymentresponseCreated: boolean = false;
  ngOnInit() {
    this.intercom.getPaymentReview().subscribe(res => {
      this.isPaymentresponseCreated = res > 0 ? true : false;
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (this.isMobile) {
        this.columnName = ["", "Code", "Action"]
        this.columnsToDisplay = ['is_expand', 'code', 'action']
      } else {
        this.columnName = ["Code", "Name", "Action"]
        this.columnsToDisplay = ['code', 'name', 'action']
      }
    });

    this.icdData = this.billingData && this.billingData.billing_diagnosis_code ? this.billingData.billing_diagnosis_code : [];
    this.IcdDataSource = new MatTableDataSource(this.icdData);
    this.IcdDataSource.sort = this.sort;

    this.claimService.getICD10('a').subscribe(icd => {
      this.filteredICD = icd[3];
    });

    this.icdCtrl.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(value => { this.claimService.getICD10(value).subscribe(val => this.filteredICD = val[3]) });
  }
  icdData = [];
  selectedIcd = { code: "", name: "" };
  selectICD(icd) {
    this.selectedIcd = { code: icd[0], name: icd[1] }
    this.addIcd()

  }
  addIcd() {
    if (this.icdData && this.icdData.length >= 12) {
      this.icdCtrl.reset();
      this.alertService.openSnackBar("Maximum 12 Diagnosis Codes will be allowed here!", 'error');
      return
    }

    if (this.selectedIcd.code != '') {
      let icdStatus = true;
      if (this.icdData.length) {
        for (var j in this.icdData) {
          if (this.icdData[j].code == this.selectedIcd.code && this.icdData[j].name == this.selectedIcd.name) {
            icdStatus = false;
          }
        }
      }
      if (!icdStatus) {
        this.icdCtrl.reset();
        this.alertService.openSnackBar("Diagnosis code already added!", 'error');
        return
      }
      this.filteredICD = [];
      this.icdData = this.IcdDataSource.data;
      this.icdData.push(this.selectedIcd)
      let data = { id: this.paramsId.billingId, claim_id: this.paramsId.claim_id, billable_item_id: this.paramsId.billId, diagnosis_code: this.icdData }
      this.billingService.updateDiagnosisCode(data).subscribe(code => {
        if (this.icdData.length == 1) {
          this.intercom.setBillDiagnosisChange(true);
        }
        this.IcdDataSource = new MatTableDataSource(this.icdData);
        this.selectedIcd = { code: "", name: "" };
        this.alertService.openSnackBar("ICD data added successfully", "success");
        this.icdCtrl.reset();
        this.filteredICD = [];
        this.logger.log("icd 10 data", this.icdData)
      }, error => {
        this.logger.error(error)
      })

    }
  }

  removeICD(icd) {
    this.openDialogDiagnosis('remove', icd);
  }

  openDialogDiagnosis(dialogue, icd) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: icd.code + " - " + icd.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        let index = 0;
        this.icdData.map(res => {
          if (res.code == icd.code) {
            this.icdData.splice(index, 1);
            let data = { claim_id: this.paramsId.claim_id, billable_item_id: this.paramsId.billId, id: this.paramsId.billingId, diagnosis_code: this.icdData }
            this.billingService.updateDiagnosisCode(data).subscribe(code => {
              if (this.icdData.length == 0) {
                this.intercom.setBillDiagnosisChange(true);
              }
              this.IcdDataSource = new MatTableDataSource(this.icdData);
              this.selectedIcd = { code: "", name: "" };
              this.alertService.openSnackBar("ICD data removed successfully", "success");
              this.icdCtrl.reset();
            }, error => {
              this.logger.error(error)
            })
          }
          index = index + 1;
        })
      }
    })
  }

  openElement(element) {
    if (this.isMobile)
      if (this.icdExpandID && this.icdExpandID == element.code) {
        this.icdExpandID = null;
      } else {
        this.icdExpandID = element.code;
      }
  }


}
