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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
  columnsToDisplay = [];
  IcdDataSource = new MatTableDataSource([]);
  expandedElement;
  isMobile = false;
  columnName = [];
  columnsToDisplay1 = [];
  expandedElement1;
  columnName1 = [];
  isMobile1 = false;
  // dataSource2 = ELEMENT_DATA2;
  documentsData: any = new MatTableDataSource([]);
  columnsToDisplay2 = [];
  expandedElement2;
  columnName2 = [];
  dataSourceDocList = new MatTableDataSource([]);
  columnsToDisplayDoc = [];
  expandedElement3;
  columnsNameDoc = [];
  filterValue: string;
  file: any;
  documentType: any;
  paramsId: any;
  billingId: number;
  documentList: any;
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
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredmodifier: any;
  modiferList: any = ['93', '94', '95', '96'];
  @ViewChild(MatAutocompleteTrigger, { static: false }) _autoTrigger: MatAutocompleteTrigger;
  //@ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  unitTypes: any = [{ unit_type: 'Units', unit_short_code: 'UN' }, { unit_type: 'Pages', unit_short_code: 'UN' }];// { unit_type: 'Minutes', unit_short_code: 'MJ' }]
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  billDocumentList: any;
  @ViewChild('scrollBottom', { static: false }) private scrollBottom: ElementRef;
  states: any;
  incompleteInformation: any;
  isIncompleteError: any = true;
  isExpandDetail = true;
  role = this.cookieService.get('role_id');
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
        }, error => {
          this.logger.error(error)
        })
      } else {
        this.billingId = param.billingId
      }
      this.billingService.getIncompleteInfo(param.claim_id, param.billId, { isPopupValidate: false }).subscribe(res => {
        this.isIncompleteError = true;
      }, error => {
        this.isIncompleteError = false;
        this.incompleteInformation = error.error.data;
      })
      this.logger.log(this.billingId, "billing id")

    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Code", "Action"]
        this.columnsToDisplay = ['is_expand', 'code', 'action']
      } else {
        this.columnName = ["Code", "Name", "Action"]
        this.columnsToDisplay = ['code', 'name', 'action']
      }
      if (res) {
        this.columnName2 = ["", "File Name"]
        this.columnsToDisplay2 = ['is_expand', 'file_name']
      } else {
        this.columnName2 = ["", "File Name", "Download Partial Document", "Complete", "Action"]
        this.columnsToDisplay2 = ['doc_image', 'file_name', 'partial', 'complete', "action"]
      }

      if (res) {
        this.columnsNameDoc = ["", "File Name"]
        this.columnsToDisplayDoc = ['is_expand', 'file_name']
      } else {
        this.columnsNameDoc = ["", "Ref #", "File Name", "Action", "Date", "Recipients", "Download Sent Documents", "Further Information"]
        this.columnsToDisplayDoc = ['doc_image', 'request_reference_id', 'file_name', 'action', "date", "recipients", 'download', 'payor_response_message']
      }
    })

    //this.filteredmodifier = this.modiferList

    this.billingService.seedData("state").subscribe(res => {
      this.states = res.data;
    })

  }

  openAuto(e, trigger: MatAutocompleteTrigger) {
    e.stopPropagation()
    trigger.openPanel();
  }

  add(event: MatChipInputEvent, group: FormGroup): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    return;
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;

    //   if (group.value.modifierList.length > 4) {
    //     this.alertService.openSnackBar("Maximum 4 value", "error");
    //     return;
    //   }
    //   // Add our fruit
    //   if ((value || '').trim()) {
    //     let data = group.value.modifierList
    //     data.push(value.trim())
    //     group.get('modifierList').setValue(data);
    //     group.get('modifierList').updateValueAndValidity();
    //   }

    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }

    // }
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.modiferList.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }



  icdCtrl = new FormControl();
  icdSearched = false;
  filteredICD: any = [];


  openDialog(status?: boolean, group?): void {
    const dialogRef = this.dialog.open(BillingPaymentDialog, {
      width: '800px',
      data: { status: status, id: group ? group.get('post_payment_id').value : null, billingId: this.billingId, claimId: this.paramsId.claim_id, billableId: this.paramsId.billId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBillLineItem();
      }
    });
  }



  openBillOnDemand(): void {
    const dialogRef = this.dialog.open(billingOnDemandDialog, {
      width: '800px',
      // data: {name: this.name, animal: this.animal}
      data: {
        billingId: this.billingId, claimId: this.paramsId.claim_id, billableId: this.paramsId.billId,
        states: this.states, on_demand_progress_status: this.billingData.on_demand_progress_status, is_w9_form: this.billingData.is_w9_form,
        last_bill_on_demand_request_date: this.billingData.last_bill_on_demand_request_date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
      if (result) {
        this.getBillingDetails();
      }
    });
  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit() {
    this.claimService.getICD10('a').subscribe(icd => {
      this.filteredICD = icd[3];
    });

    this.icdCtrl.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(value => { this.claimService.getICD10(value).subscribe(val => this.filteredICD = val[3]) });


    // this.billingService.searchPayor({ search: null }).subscribe(payor => {
    //   this.payors = payor.data
    // });

    // this.payorCtrl.valueChanges.subscribe(res => {
    //   if (res && res.length > 2) {
    //     this.billingService.searchPayor({ search: res }).subscribe(payor => {
    //       if (payor.data) {
    //         this.payors = payor.data
    //       } else {
    //         this.payors = [];
    //       }

    //     });
    //   }
    // })

    // this.claimService.seedData('bill_ondemand_document_types').subscribe(type => {
    //   this.documentList = type['data']
    // })

    // this.claimService.getProcedureType(2).subscribe(procedure => {
    //   this.eaxmProcuderalCodes = procedure.data;
    // })

    // this.claimService.seedData('procedural_codes').subscribe(type => {
    //   this.procuderalCodes = type['data']
    // })

    // this.claimService.seedData('modifier').subscribe(type => {
    //   this.modifiers = type['data']
    // })



    // this.claimService.seedData('workcompedi_payor_details').subscribe(type => {
    //   this.payors = type['data']
    // })



    this.getDocumentData();
    this.getBillingDetails();
    this.getBillLineItem()
    this.getBillDocument();
    //table
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });

  }
  statusBarValues = { value: null, status: '', class: '' }
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

  payerResponse: any = [];
  getBillingDetails() {

    this.billingService.getBilling(this.paramsId.claim_id, this.paramsId.billId).subscribe(billing => {
      console.log("hihii", billing.data)
      if (billing.data) {
        this.billingData = billing.data;
        this.statusBarChanges(this.billingData.on_demand_progress_status);
        if (!billing.data) {
          return;
        }
        // this.payerResponse = billing.data.payor_response_messages;
        for (let payer in billing.data.payor_response_messages) {
          if (billing.data.payor_response_messages[payer].payor_response_status == 'R') {
            if (billing.data.payor_response_messages[payer].payor_response_message.length) {
              for (let arr in billing.data.payor_response_messages[payer].payor_response_message) {
                billing.data.payor_response_messages[payer].payor_response_message[arr]._attributes.status_date = billing.data.payor_response_messages[payer].status_date;
                this.payerResponse.push(billing.data.payor_response_messages[payer].payor_response_message[arr]._attributes);
              }

            } else {
              billing.data.payor_response_messages[payer].payor_response_message._attributes.status_date = billing.data.payor_response_messages[payer].status_date;
              this.payerResponse.push(billing.data.payor_response_messages[payer].payor_response_message._attributes);
            }
          }
        }

        if (!this.billingData.certified_interpreter_required) {
          let index = this.modiferList.indexOf('93');
          this.modiferList.splice(index, 1)
        }
        if (!this.billingData.is_psychological_exam) {
          let index = this.modiferList.indexOf('96');
          this.modiferList.splice(index, 1)
        }
        // this.filteredmodifier = this.modiferList
        if (this.billingData && this.billingData.bill_no) {
          this.intercom.setBillNo('CMBN' + this.billingData.bill_no);
          this.cookieService.set('billNo', 'CMBN' + this.billingData.bill_no)
        } else {
          this.intercom.setBillNo('Bill');
        }
        this.icdData = billing.data && billing.data.billing_diagnosis_code ? billing.data.billing_diagnosis_code : [];
        this.IcdDataSource = new MatTableDataSource(this.icdData);
        this.IcdDataSource.sort = this.sort;
        billing.data.documets_sent_and_received.map(doccc => {
          if (doccc.file_name == "DOCUMENTS_1140121036_BILL_20201209_051281_819.pdf") {
            this.logger.log("billing", doccc)
          }
        })

        this.dataSourceDocList = new MatTableDataSource(billing.data.documets_sent_and_received);
        // if (billing.data && billing.data.billing_line_items) {
        //   billing.data.billing_line_items.map((item, index) => {
        //     let firstData = {};
        //     this.addRow(1);
        //     let modifier = item.modifier ? item.modifier.split('-') : [];
        //     billing.data.billing_line_items[index].modifierList = modifier;
        //     firstData = {
        //       id: item.id,
        //       modifierList: modifier,
        //       item_description: item.item_description,
        //       procedure_code: item.procedure_code,
        //       modifier: item.modifier,
        //       unitType: item.unit_type,
        //       units: item.units,
        //       charge: item.charge,
        //       payment: 0,
        //       balance: 1,
        //       isEditable: [true]
        //     }
        //     if (item.is_post_payment) {
        //       this.getFormControls.controls[index].get('item_description').setValidators([]);
        //       this.getFormControls.controls[index].get('procedure_code').setValidators([]);
        //       this.getFormControls.controls[index].get('units').setValidators([]);
        //       this.getFormControls.controls[index].get('charge').setValidators([]);
        //       this.getFormControls.controls[index].get('item_description').updateValueAndValidity();
        //       this.getFormControls.controls[index].get('procedure_code').updateValueAndValidity();
        //       this.getFormControls.controls[index].get('units').updateValueAndValidity();
        //       this.getFormControls.controls[index].get('charge').updateValueAndValidity();
        //     }
        //     this.getFormControls.controls[index].patchValue(firstData)
        //     if (this.getFormControls.controls[index].status == "VALID") {
        //       this.getFormControls.controls[index].get('isEditable').setValue(false);
        //     }
        //   })

        // }
      }
    }, error => {
      this.logger.error(error)
    })
  }



  icdData = [];
  selectedIcd = { code: "", name: "" };
  selectICD(icd) {
    this.selectedIcd = { code: icd[0], name: icd[1] }
    this.addIcd()

  }
  openSnackBar() {
    this.alertService.openSnackBar("Payor changed successfully", "success");
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
        this.alertService.openSnackBar("Already added", 'error');
        return
      }
      this.filteredICD = [];
      this.icdData = this.IcdDataSource.data;
      this.icdData.push(this.selectedIcd)
      let data = { id: this.billingId, claim_id: this.paramsId.claim_id, billable_item_id: this.paramsId.billId, diagnosis_code: this.icdData }
      this.billingService.updateDiagnosisCode(data).subscribe(code => {
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
            let data = { claim_id: this.paramsId.claim_id, billable_item_id: this.paramsId.billId, id: this.billingId, diagnosis_code: this.icdData }
            this.billingService.updateDiagnosisCode(data).subscribe(code => {
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
  icdExpandID: any;
  expandId1: any;
  expandId2: any = -1;
  expandIdDoc: any;
  openElement(element) {
    if (this.isMobile)
      if (this.icdExpandID && this.icdExpandID == element.id) {
        this.icdExpandID = null;
      } else {
        this.icdExpandID = element.id;
      }
  }

  openElementBill(element) {
    if (this.isMobile)
      if (this.expandId2 && this.expandId2 == element) {
        this.expandId2 = null;
      } else {
        this.expandId2 = element;
      }
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
  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
  getDocumentData() {
    // this.billingService.getDocumentData(this.paramsId.claim_id, this.paramsId.billId).subscribe(res => {
    //   this.documentsData = new MatTableDataSource(res.data);
    // }, error => {
    //   this.documentsData = new MatTableDataSource([]);
    // })
  }

  getBillDocument() {
    this.billingService.getBillDocument(this.paramsId.claim_id, this.paramsId.billId).subscribe(doc => {
      this.billDocumentList = doc.data;
      if (doc.data) {
        if (doc.data.document_list) {
          this.documentsData = new MatTableDataSource(doc.data.document_list);
        }
      }
    }, error => {
      this.documentsData = new MatTableDataSource([]);
    })
  }

  selectedFile: File;
  formData = new FormData()
  selectedFiles: FileList;
  errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  addFile(event, status?) {
    this.selectedFiles = null;
    this.selectedFile = null;
    this.file = []
    this.selectedFiles = event.target.files;

    let fileTypes = ['pdf', 'doc', 'docx']

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB

        if (FileSize > 30) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar(this.selectedFiles[i].name + " file too long", 'error');
          return;
        }
        this.selectedFile = this.selectedFiles[i];
        this.file.push(this.selectedFiles[i].name);
        if (status && this.selectedFiles.length == i + 1) {
          this.uploadFile(status)
        }
      } else {
        this.alertService.openSnackBar(this.selectedFiles[i].name + " file is not accepted", 'error');
        this.selectedFile = null;
        this.selectedFiles = null;
        this.fileUpload.nativeElement.value = "";
      }
    }

  }
  uploadFile(status?) {
    if (!this.selectedFile) {
      this.errors.file.isError = true;
      this.errors.file.error = "Please select a file";
      return;
    }
    //this.formData.append('file', this.selectedFile);
    this.formData.append('document_category_id', '8');
    this.formData.append('claim_id', this.paramsId.claim_id);
    this.formData.append('bill_item_id', this.paramsId.billId.toString());

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.formData.append('file', this.selectedFiles[i]);
    }
    this.billingService.postDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.documentType = null;
      this.formData = new FormData();
      this.file = "";
      if (status) {
        this.getBillDocument();
      } else {
        this.getDocumentData();
      }

      this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  getGenerateBillingForm(id) {
    this.billingService.generateBillingForm(this.paramsId.claim_id, this.paramsId.billId, id).subscribe(billing => {
      saveAs(billing.data.exam_report_file_url, billing.data.file_name);
      this.alertService.openSnackBar("File downloaded successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  download(element) {
    // saveAs(data.exam_report_file_url, data.file_name, '_self');
    // this.alertService.openSnackBar("File downloaded successfully", "success");
    this.billingService.downloadOndemandDocuments({ file_url: element.exam_report_file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      saveAs(res.signed_file_url, element.file_name);
    })
  }

  downloadDocumet(element, details?) {
    this.billingService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.claimService.updateActionLog({ type: "billing", "document_category_id": 8, "claim_id": this.paramsId.claim_id, "billable_item_id": this.paramsId.billId, "documents_ids": [element.document_id ? element.document_id : details.document_id] }).subscribe(res => {
      })
      saveAs(res.signed_file_url, element.file_name);
      this.getBillingDetails();
    })
  }

  docChange(e) {
    this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } };
    this.fileUpload.nativeElement.value = "";
    this.selectedFile = null;
    this.file = null;
  }

  billingOnDemand() {
    let data = {
      claim_id: this.paramsId.claim_id,
      document_category_id: 8,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: 5,
      bill_id: this.billingId,
      //documents_ids: [1753, 1755],
      //recipients_ids: [2, 3, 4, 5]
    }

    this.billingService.onDemandBilling(data).subscribe(bill => {
      this.logger.log("onDemand", bill);
      if (bill.data.exam_report_signed_file_url) {
        this.download({ exam_report_file_url: bill.data.exam_report_signed_file_url, file_name: bill.data.exam_report_csv_file_name })
      }
      if (bill.data.bill_on_demand_signed_zip_file_url) {
        setTimeout(() => {
          this.download({ exam_report_file_url: bill.data.bill_on_demand_signed_zip_file_url, file_name: bill.data.bill_on_demand_zip_file_name })
        }, 1000);

      }
      this.alertService.openSnackBar("Billing On Demand created successfully", 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  deleteDocument(data, status?) {
    this.openDialogDocument('remove', data, status);
  }

  openDialogDocument(dialogue, data, status?) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.billingService.deleteDocument(data.id).subscribe(res => {
          if (status) {
            this.getBillDocument();
          } else {
            this.getDocumentData();
          }

          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
  }

  billing_line_items: any;
  newFeeScheduleStatus: boolean;
  getBillLineItem() {
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.billingService.getBillLineItem(this.paramsId.claim_id, this.paramsId.billId).subscribe(line => {
      if (line.data) {
        this.billing_line_items = line.data;
        this.newFeeScheduleStatus = this.billing_line_items[0].is_new_fee_schedule;
        line.data.map((item, index) => {
          let firstData = {};
          this.addRow(1);
          let modifier = item.modifier ? item.modifier.split('-') : [];
          line.data[index].modifierList = modifier;
          if (this.newFeeScheduleStatus && item.is_auto_generate && !item.is_excess_pages) {
            if (item.unit_type == 'unit') item.unit_type = 'Units';
            item.units = item.units ? item.units : 1;
            item.charge = item.charge ? item.charge : item.units * item.billing_code_details.unit_price;
            item.unit_price = item.billing_code_details.unit_price ? item.billing_code_details.unit_price : 0;
            this.filteredmodifier = item.modifier_seed_data && item.modifier_seed_data.length ? item.modifier_seed_data.map(data => data.modifier_code) : [];
            console.log(this.filteredmodifier)
          } else {
            if (item.is_excess_pages) {
              item.unit_type = item.billing_code_details.extra_unit_type == 'page' ? 'Pages' : '';
              this.filteredmodifier = []
            }
          }

          firstData = {
            id: item.id,
            modifierList: modifier,
            item_description: item.item_description,
            procedure_code: item.procedure_code,
            modifier: item.modifier,
            unitType: item.unit_type,
            units: item.units,
            charge: +item.charge,
            payment: item.payment_amount ? item.payment_amount : 0.00,
            balance: 0,
            isEditable: [true],
            unit_price: item.unit_price ? +item.unit_price : null,
            is_post_payment: item.is_post_payment,
            post_payment_id: item.post_payment_id,
            billing_code_details: item.billing_code_details,
            modifier_seed_data: item.modifier_seed_data,
            is_auto_generate: item.is_auto_generate,
            filteredmodifier: this.filteredmodifier,
            unitTotal: +item.charge,
            is_excess_pages: item.is_excess_pages
          }
          // if (item.is_post_payment) {
          //   this.getFormControls.controls[index].get('item_description').setValidators([]);
          //   this.getFormControls.controls[index].get('procedure_code').setValidators([]);
          //   this.getFormControls.controls[index].get('units').setValidators([]);
          //   this.getFormControls.controls[index].get('charge').setValidators([]);
          //   this.getFormControls.controls[index].get('item_description').updateValueAndValidity();
          //   this.getFormControls.controls[index].get('procedure_code').updateValueAndValidity();
          //   this.getFormControls.controls[index].get('units').updateValueAndValidity();
          //   this.getFormControls.controls[index].get('charge').updateValueAndValidity();
          // }
          this.getFormControls.controls[index].patchValue(firstData)
          if (this.getFormControls.controls[index].status == "VALID") {
            this.getFormControls.controls[index].get('isEditable').setValue(false);
          } else {
            if (this.newFeeScheduleStatus || this.getFormControls.controls[index].get('is_excess_pages').value) {
              this.getFormControls.controls[index].get('procedure_code').disable();
              this.getFormControls.controls[index].get('unitType').disable();
              this.getFormControls.controls[index].get('charge').disable();
            }
          }
        })

      }
    }, error => {
      this.logger.error(error)
    })
  }

  //'item', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action'
  initiateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      item_description: ['', Validators.compose([Validators.required])],
      procedure_code: ['', Validators.compose([Validators.required])],
      modifierList: [[]],
      modifier: ['', Validators.compose([Validators.pattern('^[0-9]{2}(?:-[0-9]{2})?(?:-[0-9]{2})?(?:-[0-9]{2})?$')])],
      unitType: [''],
      units: ['', Validators.compose([Validators.required, Validators.min(1), Validators.pattern('^(0|[0-9]{1,100}\d*)$')])],
      charge: ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(99999999.99)])],
      payment: [0],
      balance: [0],
      total_charge: [0],
      isEditable: [true],
      is_post_payment: [],
      post_payment_id: [],
      unit_price: [null],
      billing_code_details: [],
      modifier_seed_data: [],
      is_auto_generate: [null],
      filteredmodifier: [[]],
      modifierTotal: [0],
      unitTotal: [0],
      is_excess_pages: [null]
    });
  }

  addRow(status?: number) {
    // if (this.getFormControls.controls && this.getFormControls.controls.length >= 12) {
    //   this.alertService.openSnackBar("Maximum 12", 'error');
    //   return
    // }
    if (status != 1) {
      let newRowStatus = true
      for (var j in this.getFormControls.controls) {
        if (this.getFormControls.controls[j].status == 'INVALID') {
          newRowStatus = false;
        }
      }

      if (!newRowStatus) {
        this.alertService.openSnackBar("Please fill existing data", 'error');
        return;
      }
    }


    const control = this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
    if (status != 1) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }
  }

  deleteRow(index: number, group) {
    this.openDialogBillLine('remove', index, group);

  }

  openDialogBillLine(dialogue, index, group) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: "Billing Line Item" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        if (group.value.id) {
          this.billingService.removeBillItem(group.value.id, this.paramsId.claim_id, this.paramsId.billId,).subscribe(del => {
            this.alertService.openSnackBar("Bill Line Item removed successfully", 'success');
            const control = this.userTable.get('tableRows') as FormArray;
            control.removeAt(index);
            this.billing_line_items.splice(index, 1)
            return
          }, err => {
            this.alertService.openSnackBar(err.error.message, 'error');
          })
        } else {
          const control = this.userTable.get('tableRows') as FormArray;
          control.removeAt(index);
          this.billing_line_items.splice(index, 1)
        }
      }
    })
  }

  editRow(group: FormGroup, i) {
    group.get('isEditable').setValue(true);
    console.log(group.value.is_auto_generate)
    if (group.value.is_auto_generate && this.newFeeScheduleStatus || group.value.is_excess_pages) {
      group.get('procedure_code').disable();
      group.get('unitType').disable();
      group.get('charge').disable();
    }
  }

  doneRow(group: FormGroup, index) {
    Object.keys(group.controls).forEach((key) => {
      if (group.get(key).value && typeof (group.get(key).value) == 'string')
        group.get(key).setValue(group.get(key).value.trim())
    });
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    if (group.untouched) {
      return;
    }

    let moidfier = group.value.modifierList.toString();
    moidfier = moidfier ? moidfier.replace(/,/g, '-') : null;
    let data = {
      id: group.value.id,
      item_description: group.value.item_description,
      procedure_code: group.value.procedure_code,
      modifier: moidfier,
      units: group.value.units,
      charge: group.get('charge').value ? parseFloat(group.get('charge').value).toFixed(2) : group.get('charge').value,
      total_charge: this.calculateTotal(),
      unit_type: group.value.unitType,
      unit_short_code: this.getUnitCode(group.value.unitType)
      //payment: 0,
      //balance: 1,
      //isEditable: [false]
    }

    this.billingService.createBillLine(this.billingId, this.paramsId.billId, this.paramsId.claim_id, data).subscribe(line => {
      group.get('id').setValue(line.data.id);
      if (data.id) {
        this.alertService.openSnackBar("Bill Line Item updated successfully", 'success');
      } else {
        this.alertService.openSnackBar("Bill Line Item added successfully", 'success');
      }
      let modifier = line.data.modifier ? line.data.modifier.split('-') : [];
      this.billing_line_items[index] = line.data;
      this.billing_line_items[index].modifierList = modifier;
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
    group.get('isEditable').setValue(false);
  }

  // saveUserDetails() {
  // }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  unitChange(group, i, e) {
    if (e && group.value.is_auto_generate && this.newFeeScheduleStatus && !group.value.is_excess_pages) {
      console.log(group);
      let calculateChange = 0;
      if (group.get('modifierList').value.length) {
        group.value.modifier_seed_data.map((e, i) => {
          if (group.get('modifierList').value.includes(e.modifier_code)) {
            if (+e.price_increase > 0) {
              calculateChange += (e.price_increase / 100) * (+group.get('units').value * +group.value.billing_code_details.unit_price);
            }
          }

        });
        group.get('modifierTotal').patchValue(+calculateChange);
      }
      //group.get('charge').patchValue(+group.get('modifierTotal').value + +group.get('unitTotal').value);
      let charge = (e * group.get('unit_price').value) + +group.get('modifierTotal').value
      group.get('unitTotal').patchValue(+(e * group.get('unit_price').value))
      group.get('charge').patchValue(+charge)
    } else if (group.value.is_excess_pages) {
      let charge = +group.get('units').value * +group.value.billing_code_details.rate_for_extra_units
      group.get('charge').patchValue(+charge)
    }
  }

  getUnitCode(code) {
    if (code) {
      for (var c in this.unitTypes) {
        if (this.unitTypes[c].unit_type == code) {
          return this.unitTypes[c].unit_short_code;
        }
      }
    } else {
      return null;
    }

  }

  // submitForm() {
  //   const control = this.userTable.get('tableRows') as FormArray;
  //   this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
  // }

  cancelRow(group: FormGroup, i) {
    if (!group.value.id) {
      this.deleteRow(i, group);
      return
    }

    let data = {
      id: this.billing_line_items[i].id,
      item_description: this.billing_line_items[i].item_description,
      procedure_code: this.billing_line_items[i].procedure_code,
      modifier: this.billing_line_items[i].modifier,
      modifierList: this.billing_line_items[i].modifierList,
      units: this.billing_line_items[i].units,
      charge: this.billing_line_items[i].charge,
      unitType: this.billing_line_items[i].unit_type,
      payment: 0,
      balance: 0,
      isEditable: [false]
    }
    let modifier = data.modifier ? data.modifier.split('-') : [];
    data.modifierList = modifier;
    group.patchValue(data);
    group.get('isEditable').setValue(false);

  }

  remove(val: string, group: FormGroup, gruopindex?): void {
    const index = group.value.modifierList.indexOf(val);
    if (group.value.is_auto_generate && this.newFeeScheduleStatus && !group.value.is_excess_pages) {
      group.value.modifier_seed_data.map((e, i) => {
        if (e.modifier_code == val) {
          let modifier = e.exclude_modifiers.map((ex, ind) => {
            if (!group.get('filteredmodifier').value.includes(ex)) group.get('filteredmodifier').value.push(ex)
          })
          if (+e.price_increase > 0) {
            let calculateChange = (e.price_increase / 100) * (+group.get('units').value * +group.value.billing_code_details.unit_price);
            group.get('modifierTotal').patchValue(+group.get('modifierTotal').value - +calculateChange);
            group.get('charge').patchValue(+group.get('modifierTotal').value + +group.get('unitTotal').value);

          }
        }
      });
      console.log(group);
    }
    if (index >= 0) {
      group.get('modifierList').value.splice(index, 1);
    }
    group.get('modifierList').updateValueAndValidity();
  }

  selected(event: MatAutocompleteSelectedEvent, group: FormGroup, index?): void {
    if (group.value.modifierList.length > 0 && group.value.modifierList.includes(event.option.viewValue)) {
      this.alertService.openSnackBar("Already added", "error");
      return;
    }
    if (group.value.modifierList.length > 3) {
      this.alertService.openSnackBar("Maximum 4 value", "error");
      return;
    }
    if (group.value.is_auto_generate && this.newFeeScheduleStatus) {
      group.value.modifier_seed_data.map((e, i) => {
        if (e.modifier_code == event.option.viewValue) {
          e.exclude_modifiers.map((ex, ind) => {
            let filterIndex = group.get('filteredmodifier').value.findIndex(m => m == ex)
            group.get('filteredmodifier').value.splice(filterIndex, 1)
          });
          if (+e.price_increase > 0) {
            let calculateChange = (e.price_increase / 100) * (+group.get('units').value * +group.value.billing_code_details.unit_price);
            group.get('modifierTotal').patchValue(+group.get('modifierTotal').value + +calculateChange);
            group.get('charge').patchValue(+group.get('modifierTotal').value + +group.get('unitTotal').value);

          }
        }

      });
      console.log(group);
    }
    let modify = group.value.modifierList;
    modify.push(event.option.viewValue)
    group.get('modifierList').setValue(modify)
  }

  rowSelected(group: FormGroup) {
  }

  calculateTotal() {
    let total: any = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].get('charge').value) {
        total += parseFloat(this.getFormControls.controls[j].get('charge').value)
      }
    }
    return total.toFixed(2);
  }

  calculateTotalBal() {
    let total: any = 0;
    let payment: any = 0
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].get('charge').value) {
        total += parseFloat(this.getFormControls.controls[j].get('charge').value)
      }
      if (this.getFormControls.controls[j].get('payment').value) {
        payment += parseFloat(this.getFormControls.controls[j].get('payment').value)
      }
    }
    return (total - payment).toFixed(2);
  }

  calculateTotalPayment() {
    let total: any = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].get('payment').value) {
        total += parseFloat(this.getFormControls.controls[j].get('payment').value)
      }
    }
    return total.toFixed(2);
  }


  VMC1500Submit() {
    this.billingService.generateCMS1500Form(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId).subscribe(cms => {
      saveAs(cms.cms_1500_signed_file_url, cms.cms_1500_file_name, '_self');
      this.alertService.openSnackBar("CMS1500 generated successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  downloadAll() {
    if (this.billingData.documets_sent_and_received.length == 0) {
      this.alertService.openSnackBar("Document not found", "error");
      return;
    }
    // this.billingService.billingDownloadAll(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId).subscribe(doc => {
    //   saveAs(doc.data.file_url, doc.data.file_name, '_self');
    //   this.alertService.openSnackBar("Document(s) downloaded successfully", "success");
    // }, error => {
    //   this.alertService.openSnackBar(error.error.message, "error");
    // })
  }

  inOutdownload(data) {
    saveAs(data.file_url, data.file_name, '_self');
  }

  docSelectedFile: File;
  docFormData = new FormData()
  addCompleteDoc(event, pid) {
    this.docSelectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx'];
    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 501) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: event.target.files[0].name, message: "File size is too large. Contact your organization's Simplexam Admin", yes: false, ok: true, no: false, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
        })
        // this.alertService.openSnackBar(event.target.files[0].name + " file too long", 'error');
        return;
      }
      this.file = event.target.files[0].name;
      this.docSelectedFile = event.target.files[0];
      this.BillingCompleteDocSubmit(pid)
    } else {
      this.docSelectedFile = null;
      this.alertService.openSnackBar(event.target.files[0].name + " file is not accepted", 'error');
    }

  }

  BillingCompleteDocSubmit(pid) {
    this.docFormData = new FormData()
    if (pid.form_name && pid.form_name.toLowerCase() == 'report') {
      this.docFormData.append('isReportUpload', 'true');
    } else {
      this.docFormData.append('isReportUpload', 'false');
    }
    this.docFormData.append('file', this.docSelectedFile);
    this.docFormData.append('form_id', pid.id);
    this.docFormData.append('claim_id', this.paramsId.claim_id.toString());
    this.docFormData.append('bill_item_id', this.paramsId.billId.toString());
    this.billingService.postBillingCompleteDoc(this.docFormData).subscribe(doc => {
      this.alertService.openSnackBar("File added successfully", 'success');
      this.getBillDocument();
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }
}

//post payment 
@Component({
  selector: 'billing-payment-dialog.html',
  templateUrl: 'billing-payment-dialog.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class BillingPaymentDialog {
  file: any;
  postPaymentForm: FormGroup;
  paymentTypes: any = ["Paper Check", "EFT", "Virtual Credit Card"];
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  paymentDetails: any;
  currentDate = new Date();
  minimumDate = new Date(1900, 0, 1);
  writeoffReason = [];
  constructor(
    public dialogRef: MatDialogRef<BillingPaymentDialog>, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private alertService: AlertService, public billingService: BillingService,
    private fb: FormBuilder, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    this.postPaymentForm = this.formBuilder.group({
      id: [''],
      is_file_change: [true],
      claim_id: [this.data.claimId, Validators.required],
      billable_item_id: [this.data.billableId, Validators.required],
      payment_amount: [null, Validators.compose([Validators.required, Validators.min(0)])],
      reference_no: [null, Validators.required],
      effective_date: [null, Validators.required],
      payment_method: [null, Validators.required],
      is_deposited: [false],
      deposit_date: [null],
      payor_control_claim_no: [null],
      is_penalty: [false],
      penalty_amount: [null, Validators.compose([Validators.min(0)])],
      is_interest_paid: [false],
      interest_paid: [null, Validators.compose([Validators.min(0)])],
      is_bill_closed: [false],
      post_payment_eor_ids: [this.eorDocumentIds]
    });
    this.billingService.seedData("write_off_reason").subscribe(res => {
      this.writeoffReason = res.data;
    })
    this.postPaymentForm.value.is_deposited ? this.postPaymentForm.get('deposit_date').enable() : this.postPaymentForm.get('deposit_date').disable();
    this.postPaymentForm.value.is_penalty ? this.postPaymentForm.get('penalty_amount').enable() : this.postPaymentForm.get('penalty_amount').disable();
    this.postPaymentForm.value.is_interest_paid ? this.postPaymentForm.get('interest_paid').enable() : this.postPaymentForm.get('interest_paid').disable();
    //this.postPaymentForm.value.is_bill_closed ? this.postPaymentForm.get('write_off_reason').enable() : this.postPaymentForm.get('write_off_reason').disable();
    if (data.status) {
      this.billingService.getPostPayment(data.id).subscribe(pay => {
        this.paymentDetails = pay.data;
        this.paymentDetails.post_payment_eor_details.map((data, index) => {
          this.addRow();
          let details = {
            id: data.id,
            post_payment_id: this.paymentDetails.id ? this.paymentDetails.id : '',
            write_off_reason_id: data.write_off_reason_id,
            write_off_other_reason: data.write_off_other_reason,
            eor_allowance: data.eor_allowance,
            claim_id: this.data.claimId,
            billable_item_id: this.data.billableId,
            isEditable: [true],
            file: null,
            file_name: data.file_name,
            url: data.exam_report_file_url,
            save_status: true
          }
          this.getFormControls.controls[index].patchValue(details)
          if (this.getFormControls.controls[index].status == "VALID") {
            this.getFormControls.controls[index].get('isEditable').setValue(false);
          }
        })
        pay.data.payment_amount = pay.data.payment_amount ? parseFloat(pay.data.payment_amount).toFixed(2) : pay.data.payment_amount;
        pay.data.interest_paid = pay.data.interest_paid ? parseFloat(pay.data.interest_paid).toFixed(2) : pay.data.interest_paid;
        pay.data.penalty_amount = pay.data.penalty_amount ? parseFloat(pay.data.penalty_amount).toFixed(2) : pay.data.penalty_amount;
        // pay.data.eor_allowance = pay.data.eor_allowance ? parseFloat(pay.data.eor_allowance).toFixed(2) : pay.data.eor_allowance;
        this.postPaymentForm.patchValue(pay.data);
        this.postPaymentForm.value.is_deposited ? this.postPaymentForm.get('deposit_date').enable() : this.postPaymentForm.get('deposit_date').disable();
        this.postPaymentForm.value.is_penalty ? this.postPaymentForm.get('penalty_amount').enable() : this.postPaymentForm.get('penalty_amount').disable();
        this.postPaymentForm.value.is_interest_paid ? this.postPaymentForm.get('interest_paid').enable() : this.postPaymentForm.get('interest_paid').disable();
        //this.postPaymentForm.value.is_bill_closed ? this.postPaymentForm.get('write_off_reason').enable() : this.postPaymentForm.get('write_off_reason').disable();
      }, error => {

      })

    } else {
      this.paymentDetails = { post_payment_eor_details: [] }
    }

    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });

  }
  setRequired(group) {
    if (group.get('write_off_reason_id').value == 4) {
      group.get('write_off_other_reason').setValidators([Validators.required])
    } else {
      group.get('write_off_other_reason').clearValidators()
      group.get('write_off_other_reason').updateValueAndValidity()
    }
  }
  writeoff(group) {
    let other = group.write_off_other_reason != null ? group.write_off_other_reason : ""
    for (var i in this.writeoffReason) {
      if (this.writeoffReason[i].id == group.write_off_reason_id) {
        if (other != "") {
          return other;
        } else {
          return this.writeoffReason[i].name;
        }
      }
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }
  postIsSubmit: boolean = false;
  PaymentFormSubmit() {
    let newRowStatus = true
    for (var j in this.getFormControls.controls) {
      if (!this.getFormControls.controls[j].value['save_status']) {
        newRowStatus = false;
      }
    }

    if (!newRowStatus) {
      this.alertService.openSnackBar("Please save EOR data", 'error');
      return;
    }
    this.postIsSubmit = true;
    this.postPaymentForm.value.is_deposited ? this.postPaymentForm.get('deposit_date').setValidators([Validators.compose([Validators.required])]) : this.postPaymentForm.get('deposit_date').setValidators([]);
    this.postPaymentForm.value.is_penalty ? this.postPaymentForm.get('penalty_amount').setValidators([Validators.compose([Validators.required, Validators.min(0)])]) : this.postPaymentForm.get('penalty_amount').setValidators([]);
    this.postPaymentForm.value.is_interest_paid ? this.postPaymentForm.get('interest_paid').setValidators([Validators.compose([Validators.required, Validators.min(0)])]) : this.postPaymentForm.get('interest_paid').setValidators([]);

    Object.keys(this.postPaymentForm.controls).forEach((key) => {
      this.postPaymentForm.get(key).updateValueAndValidity();
      if (this.postPaymentForm.get(key).value && typeof (this.postPaymentForm.get(key).value) == 'string')
        this.postPaymentForm.get(key).setValue(this.postPaymentForm.get(key).value.trim())
    });
    this.postPaymentForm.value.effective_date = new Date(this.postPaymentForm.value.effective_date).toDateString();
    this.postPaymentForm.value.deposit_date = this.postPaymentForm.value.deposit_date ? new Date(this.postPaymentForm.value.deposit_date).toDateString() : null;
    if (this.postPaymentForm.invalid) {
      this.postPaymentForm.markAllAsTouched();
      return;
    }

    this.billingService.billingPostPayment(this.data.billingId, this.postPaymentForm.value).subscribe(post => {
      if (!this.postPaymentForm.value.id) {
        this.alertService.openSnackBar("Post payment created successfully", 'success');
      } else {
        this.alertService.openSnackBar("Post payment updated successfully", 'success');
      }

      this.dialogRef.close(post.data);
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })


  }

  fileDownload(file) {
    saveAs(file.post_payment_file_url, file.file_name, '_self');
  }

  removeFile(i) {
    this.postPaymentForm.patchValue({ file: null, is_file_change: true })
    this.alertService.openSnackBar("File deleted successfully", 'success');
  }

  removeFileEdit(i, file) {

    this.billingService.deleteDocument(file.id).subscribe(res => {
      this.paymentDetails.exam_report_file_url.splice(i, 1)
      this.alertService.openSnackBar("File deleted successfully", 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  userTable: FormGroup;
  control: FormArray;

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      post_payment_id: [''],
      id: [''],
      write_off_reason_id: [null, Validators.compose([])],
      write_off_other_reason: [null, Validators.compose([])],
      eor_allowance: ['', Validators.compose([Validators.min(0)])],
      claim_id: [this.data.claimId, Validators.required],
      billable_item_id: [this.data.billableId, Validators.required],
      isEditable: [true],
      isFileChanged: [false],
      file: null,
      file_name: [null],
      url: null,
      save_status: [false],
    });
  }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  openFileUpload() {
    let newRowStatus = true
    for (var j in this.getFormControls.controls) {
      if (!this.getFormControls.controls[j].value['save_status']) {
        newRowStatus = false;
      }
    }

    if (!newRowStatus) {
      this.alertService.openSnackBar("Please save existing data", 'error');
      return;
    }
    this.fileUpload.nativeElement.click()
  }

  selectedFile: File;
  addEOR(event, isEdit?, group?) {
    this.selectedFile = null;
    let fileTypes = ['pdf', 'jpg', 'jpeg', 'png']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.alertService.openSnackBar(event.target.files[0].name + " file too long", 'error');
        return;
      }

      this.selectedFile = event.target.files[0];
      if (!isEdit) {
        this.addRow(1);
        let file = {
          post_payment_id: this.paymentDetails ? this.paymentDetails.id : '',
          file: event.target.files[0],
          file_name: event.target.files[0].name
        }
        this.getFormControls.controls[this.getFormControls.controls.length - 1].patchValue(file)
      } else {

        group.get('isFileChanged').setValue(true)
        group.get('file').setValue(event.target.files[0])
        group.get('file_name').setValue(event.target.files[0].name)
      }
    } else {
      this.selectedFile = null;
      this.alertService.openSnackBar(event.target.files[0].name + " file is not accepted", 'error');
    }
  }

  addRow(status?) {
    const control = this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  formEOR = new FormData();
  eorDocumentIds: any = []
  saveRow(group: FormGroup, index) {
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    this.formEOR = new FormData();

    this.formEOR.append('file', group.value.file)
    this.formEOR.append('id', group.value.id)
    this.formEOR.append('write_off_reason_id', group.value.write_off_reason_id)
    this.formEOR.append('claim_id', group.value.claim_id.toString())
    this.formEOR.append('billable_item_id', group.value.billable_item_id.toString())
    this.formEOR.append('eor_allowance', group.value.eor_allowance)
    this.formEOR.append('post_payment_id', group.value.post_payment_id ? group.value.post_payment_id : '')
    this.formEOR.append('isFileChanged', group.value.isFileChanged)
    this.formEOR.append('write_off_other_reason', String(group.value.write_off_other_reason))

    this.billingService.postPaymentFileAdd(this.data.billingId, this.formEOR).subscribe(file => {
      if (group.value.id) {
        this.alertService.openSnackBar("EOR updated successfully", 'success');
      } else {
        this.alertService.openSnackBar("EOR created successfully", 'success');
      }

      this.eorDocumentIds.push(file.data.id)
      group.patchValue({ id: file.data.id, save_status: true })
      file.data.file_name = group.value.file_name;
      this.paymentDetails.post_payment_eor_details.push(file.data)

    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
    group.get('isEditable').setValue(false);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  removeEOR(group, index) {
    this.openDialogEOR('Remove', group, index)
  }

  openDialogEOR(dialogue, group, index) {

    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: group.value.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.billingService.eorRemove(group.value.id).subscribe(remove => {
          this.alertService.openSnackBar("EOR removed successfully", 'success');
          this.paymentDetails.post_payment_eor_details.splice(index, 1);
          this.getFormControls.controls.splice(index, 1);
          this.eorDocumentIds.splice(index, 1);
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })
  }

  cancelEOR(group, index) {
    if (!group.value.id) {
      this.getFormControls.controls.splice(index, 1)
      return;
    }
    let details = {
      write_off_reason_id: this.paymentDetails.post_payment_eor_details[index].write_off_reason_id,
      eor_allowance: this.paymentDetails.post_payment_eor_details[index].eor_allowance,
      file_name: this.paymentDetails.post_payment_eor_details[index].file_name,
      url: this.paymentDetails.post_payment_eor_details[index].exam_report_file_url,
      isEditable: false
    }
    group.patchValue(details);
  }

  download(element) {
    if (!element.value.id) {
      return;
    }
    this.billingService.downloadOndemandDocuments({ file_url: element.value.url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      saveAs(res.signed_file_url, element.value.file_name);
    })
  }

}


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

