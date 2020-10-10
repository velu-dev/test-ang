import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map, startWith } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { NGXLogger } from 'ngx-logger';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSort } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { ActivatedRoute } from '@angular/router';
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
  dataSource1 = ELEMENT_DATA1;
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
  filteredmodifier: Observable<string[]>;
  modifier_: string[] = ['96'];
  modiferList: string[] = ['93', '94', '95', '96'];
  @ViewChild(MatAutocompleteTrigger, { static: false }) _autoTrigger: MatAutocompleteTrigger;
  //@ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  unitTypes: any = [{ unit_type: 'Units', unit_short_code: 'UN' }, { unit_type: 'Pages', unit_short_code: 'UN' }, { unit_type: 'Minutes', unit_short_code: 'MJ' }]
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private logger: NGXLogger, private claimService: ClaimService, private breakpointObserver: BreakpointObserver,
    private alertService: AlertService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public billingService: BillingService,
    private fb: FormBuilder,
    private intercom: IntercomService,
    private cookieService: CookieService) {
    this.intercom.setBillNo('Bill');
    this.cookieService.set('billNo', null)
    this.route.params.subscribe(param => {
      console.log(param)
      this.paramsId = param;
      if (!param.billingId) {
        this.billingService.billCreate(param.claim_id, param.billId).subscribe(bill => {
          this.logger.log(bill)
          this.billingId = bill.data.bill_id
        }, error => {
          this.logger.error(error)
        })
      } else {
        this.billingId = param.billingId
      }

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
        this.columnName2 = ["", "File Name", "Action"]
        this.columnsToDisplay2 = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName2 = ["", "File Name", "Document Source", "Action"]
        this.columnsToDisplay2 = ['doc_image', 'file_name', 'document_source', "action"]
      }

      if (res) {
        this.columnsNameDoc = ["", "File Name"]
        this.columnsToDisplayDoc = ['is_expand', 'file_name']
      } else {
        this.columnsNameDoc = ["", "File Name", "Action", "Date", "Recipients", "Download Send Documents", "Download Proof of Service"]
        this.columnsToDisplayDoc = ['doc_image', 'file_name', 'action', "date", "recipients", 'download', 'download1']
      }
    })

    this.filteredmodifier = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.modiferList.slice()));

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

  remove(val: string, group: FormGroup): void {
    const index = group.value.modifierList.indexOf(val);

    if (index >= 0) {
      group.get('modifierList').value.splice(index, 1);
    }
    group.get('modifierList').updateValueAndValidity();
  }

  selected(event: MatAutocompleteSelectedEvent, group: FormGroup): void {
    if (group.value.modifierList.length > 0 && group.value.modifierList.includes(event.option.viewValue)) {
      this.alertService.openSnackBar("Already added", "error");
      this.fruitCtrl.reset()
      return;
    }
    if (group.value.modifierList.length > 3) {
      this.fruitCtrl.reset()
      this.alertService.openSnackBar("Maximum 4 value", "error");
      return;
    }
    let modify = group.value.modifierList;
    modify.push(event.option.viewValue)
    group.get('modifierList').setValue(modify)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.modiferList.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }



  icdCtrl = new FormControl();
  icdSearched = false;
  filteredICD: any = [];

  payorCtrl = new FormControl();


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
      data: { billingId: this.billingId, claimId: this.paramsId.claim_id, billableId: this.paramsId.billId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  ngOnInit() {
    this.claimService.getICD10('a').subscribe(icd => {
      this.filteredICD = icd[3];
    });

    this.icdCtrl.valueChanges.subscribe(res => {
      if (res) {
        this.icdSearched = true;

        this.claimService.getICD10(res).subscribe(icd => {
          this.filteredICD = [];
          this.filteredICD = icd[3];
        });
      }
    })

    this.billingService.searchPayor({ search: null }).subscribe(payor => {
      this.payors = payor.data
    });

    this.payorCtrl.valueChanges.subscribe(res => {
      if (res && res.length > 2) {
        this.billingService.searchPayor({ search: res }).subscribe(payor => {
          if (payor.data) {
            this.payors = payor.data
          } else {
            this.payors = [];
          }

        });
      }
    })

    // this.claimService.seedData('bill_ondemand_document_types').subscribe(type => {
    //   this.documentList = type['data']
    // })

    this.claimService.getProcedureType(2).subscribe(procedure => {
      this.eaxmProcuderalCodes = procedure.data;
    })

    this.claimService.seedData('procedural_codes').subscribe(type => {
      this.procuderalCodes = type['data']
    })

    this.claimService.seedData('modifier').subscribe(type => {
      this.modifiers = type['data']
    })

    // this.claimService.seedData('workcompedi_payor_details').subscribe(type => {
    //   this.payors = type['data']
    // })



    this.getDocumentData();
    this.getBillingDetails();
    this.getBillLineItem()
    //table
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });

  }

  getBillingDetails() {

    this.billingService.getBilling(this.paramsId.claim_id, this.paramsId.billId).subscribe(billing => {
      this.billingData = billing.data;
      if (this.billingData.bill_no) {
        this.intercom.setBillNo('CMBN' + this.billingData.bill_no);
        this.cookieService.set('billNo', 'CMBN' + this.billingData.bill_no)
      } else {
        this.intercom.setBillNo('Bill');
      }
      this.icdData = billing.data && billing.data.billing_diagnosis_code ? billing.data.billing_diagnosis_code : [];
      this.IcdDataSource = new MatTableDataSource(this.icdData);
      this.IcdDataSource.sort = this.sort;
      this.logger.log("billing", billing)
      if (billing.data.payor_id) {
        this.payorCtrl.patchValue(billing.data.payor_id + ' - ' + billing.data.payor_name)
      }
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
    }, error => {
      this.logger.error(error)
    })
  }
  billing_line_items: any;
  getBillLineItem() {
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.billingService.getBillLineItem(this.paramsId.claim_id, this.paramsId.billId).subscribe(line => {
      if (line.data) {
        this.billing_line_items = line.data;
        line.data.map((item, index) => {
          let firstData = {};
          this.addRow(1);
          let modifier = item.modifier ? item.modifier.split('-') : [];
          line.data[index].modifierList = modifier;
          firstData = {
            id: item.id,
            modifierList: modifier,
            item_description: item.item_description,
            procedure_code: item.procedure_code,
            modifier: item.modifier,
            unitType: item.unit_type,
            units: item.units,
            charge: item.charge,
            payment: item.payment_amount ? item.payment_amount : 0.00,
            balance: 0,
            isEditable: [true],
            is_post_payment: item.is_post_payment,
            post_payment_id: item.post_payment_id
          }
          if (item.is_post_payment) {
            this.getFormControls.controls[index].get('item_description').setValidators([]);
            this.getFormControls.controls[index].get('procedure_code').setValidators([]);
            this.getFormControls.controls[index].get('units').setValidators([]);
            this.getFormControls.controls[index].get('charge').setValidators([]);
            this.getFormControls.controls[index].get('item_description').updateValueAndValidity();
            this.getFormControls.controls[index].get('procedure_code').updateValueAndValidity();
            this.getFormControls.controls[index].get('units').updateValueAndValidity();
            this.getFormControls.controls[index].get('charge').updateValueAndValidity();
          }
          this.getFormControls.controls[index].patchValue(firstData)
          if (this.getFormControls.controls[index].status == "VALID") {
            this.getFormControls.controls[index].get('isEditable').setValue(false);
          }
        })

      }
    }, error => {
      this.logger.error(error)
    })
  }

  clearPayorCtrl() {
    this.payorCtrl.reset()
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

      this.icdData = this.IcdDataSource.data;
      this.icdData.push(this.selectedIcd)
      let data = { id: this.billingId, diagnosis_code: this.icdData }
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
    let index = 0;
    this.icdData.map(res => {
      if (res.code == icd.code) {
        this.icdData.splice(index, 1);
        let data = { id: this.billingId, diagnosis_code: this.icdData }
        this.billingService.updateDiagnosisCode(data).subscribe(code => {
          this.IcdDataSource = new MatTableDataSource(this.icdData);
          this.selectedIcd = { code: "", name: "" };
          this.alertService.openSnackBar("ICD data removed successfully", "success");
          this.icdCtrl.reset();
          this.logger.log("icd 10 data", this.icdData)
        }, error => {
          this.logger.error(error)
        })
      }
      index = index + 1;
    })

  }
  icdExpandID: any;
  expandId1: any;
  expandId2: any;
  expandIdDoc: any;
  openElement(element) {
    if (this.isMobile) {
      this.icdExpandID = element.id;
    }
    if (this.isMobile) {
      this.expandId2 = element.id;
    }
  }

  openElementDoc(element) {
    if (this.isMobile) {
      this.expandIdDoc = element.id;
    }
  }
  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
  getDocumentData() {
    this.billingService.getDocumentData(this.paramsId.claim_id, this.paramsId.billId).subscribe(res => {
      this.documentsData = new MatTableDataSource(res.data);
    }, error => {
      this.documentsData = new MatTableDataSource([]);
    })
  }

  selectedFile: File;
  formData = new FormData()
  errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  addFile(event) {
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

    // let fileTypes;
    // if (this.documentType != 7) {
    //   fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
    // } else {
    //   fileTypes = ['mp3', 'wav', 'm4a', 'wma', 'dss', 'ds2', 'dct'];
    // }

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.errors.file.isError = true;
        this.errors.file.error = "This file too long";
        // this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
      this.errors.doc_type.error = "";
      this.file = event.target.files[0].name;
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
      this.errors.file.isError = true;
      this.errors.file.error = "This file type is not accepted";
    }

  }
  uploadFile() {
    if (!this.selectedFile) {
      this.errors.file.isError = true;
      this.errors.file.error = "Please select file";
      return;
    }
    this.formData.append('file', this.selectedFile);
    this.formData.append('document_category_id', '8');
    this.formData.append('claim_id', this.paramsId.claim_id);
    this.formData.append('bill_item_id', this.paramsId.billId.toString());
    this.billingService.postDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.documentType = null;
      this.formData = new FormData();
      this.file = "";
      this.getDocumentData();
      this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
      this.alertService.openSnackBar("File added successfully!", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  download(data) {
    saveAs(data.exam_report_file_url, data.file_name, '_self');
    this.alertService.openSnackBar("File downloaded successfully", "success");
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
      this.alertService.openSnackBar("Billing On Demand created successfully!", 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  deleteDocument(data) {
    this.openDialogDocument('delete', data);
  }

  openDialogDocument(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.billingService.deleteDocument(data.id).subscribe(res => {
          this.getDocumentData();
          this.alertService.openSnackBar("File deleted successfully!", 'success');
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

  //'item', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action'
  initiateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      item_description: ['', Validators.required],
      procedure_code: ['', [Validators.required]],
      modifierList: [[]],
      modifier: ['', Validators.compose([Validators.pattern('^[0-9]{2}(?:-[0-9]{2})?(?:-[0-9]{2})?(?:-[0-9]{2})?$')])],
      unitType: [''],
      units: ['', Validators.compose([Validators.required, Validators.min(0)])],
      charge: ['', Validators.compose([Validators.required, Validators.min(0)])],
      payment: [0],
      balance: [0],
      total_charge: [0],
      isEditable: [true],
      is_post_payment: [],
      post_payment_id: []
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
  }

  deleteRow(index: number, group) {

    if (group.value.id) {
      this.billingService.removeBillItem(group.value.id).subscribe(del => {
        this.alertService.openSnackBar("Bill Line Item deleted successfully", 'success');
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

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
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
      charge: group.value.charge,
      total_charge: this.calculateTotal(),
      unit_type: group.value.unitType,
      unit_short_code: this.getUnitCode(group.value.unitType)
      //payment: 0,
      //balance: 1,
      //isEditable: [false]
    }

    this.billingService.createBillLine(this.billingId, this.paramsId.billId, data).subscribe(line => {
      group.get('id').setValue(line.data.id);
      if (data.id) {
        this.alertService.openSnackBar("Bill Line Item updated successfully", 'success');
      } else {
        this.alertService.openSnackBar("Bill Line Item created successfully", 'success');
      }
      this.billing_line_items.push(group.value)
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

  rowSelected(group: FormGroup) {
  }

  calculateTotal() {
    let total = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].value.charge) {
        total += parseInt(this.getFormControls.controls[j].value.charge)
      }
    }
    return total;
  }

  calculateTotalBal() {
    let total = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].value.charge) {
        total += parseInt(this.getFormControls.controls[j].value.charge) - parseInt(this.getFormControls.controls[j].value.payment)
      }
    }
    return total;
  }

  calculateTotalPayment() {
    let total = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].value.payment) {
        total += parseInt(this.getFormControls.controls[j].value.payment)
      }
    }
    return total;
  }

  updatePayor(e) {
    this.payorCtrl.patchValue(e.payor_id + ' - ' + e.payor_name)
    this.billingService.updatePayor(this.billingId, e.id).subscribe(payor => {
      if (this.billingData.payor) {
        this.alertService.openSnackBar("Payor changed successfully", "success");
      } else {
        this.alertService.openSnackBar("Payor added successfully", "success");
        this.billingData.payor = payor.data.payor_id;
      }

    }, err => {
      this.alertService.openSnackBar(err.error.message, "error");
    })
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
    this.billingService.billingDownloadAll(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId).subscribe(doc => {
      saveAs(doc.data.file_url, doc.data.file_name, '_self');
      this.alertService.openSnackBar("Document(s) downloaded successfully", "success");
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }

  inOutdownload(data) {
    saveAs(data.file_url, data.file_name, '_self');
  }
}
const ELEMENT_DATA1 = [
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00" },
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00" },
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00" },

];
// const ELEMENT_DATA2 = [
//   { "id": 123, "file_name": "Finalized and Signed Report.pdf", "type": "Report", "date": "05-25-2019" },
//   { "id": 1, "file_name": "Submission Cover Letter", "type": "Attachment", "date": "05-25-2019" },
//   { "id": 2, "file_name": "Finalized and Signed Report.pdf", "type": "Report", "date": "05-25-2019" },
//   { "id": 3, "file_name": "Submission Cover Letter", "type": "Attachment", "date": "05-25-2019" },
//   { "id": 4, "file_name": "Finalized and Signed Report.pdf", "type": "Report", "date": "05-25-2019" },
//   { "id": 5, "file_name": "Submission Cover Letter", "type": "Attachment", "date": "05-25-2019" },

// ];
const ELEMENT_DATA3 = [
  { "id": 6, "file_name": "Appointment Notification Letter", "action": "Mailed On Demand", "date_submitted": "05-25-2019", "date_received": "05-25-2019", "recipients": "Claimant, Claims Adjuster, Applicant Attorney Defense Attorney, Employer, DEU Office", "download": "Download", },
  { "id": 5, "file_name": "QME 110 - QME Appointment Notification Form", "action": "Downloaded", "date_submitted": "05-25-2019", "date_received": "05-25-2019", "recipients": "", "download": "Download", },
  { "id": 9, "file_name": "QME 122 - AME or QME Declaration of Service of…", "action": "Downloaded", "date_submitted": "05-25-2019", "date_received": "05-25-2019", "recipients": "", "download": "Download", },

];

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
  constructor(
    public dialogRef: MatDialogRef<BillingPaymentDialog>, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private alertService: AlertService, public billingService: BillingService,) {
    dialogRef.disableClose = true;
    this.postPaymentForm = this.formBuilder.group({
      id: [''],
      file: [null],
      is_file_change: [false],
      claim_id: [this.data.claimId, Validators.required],
      billable_item_id: [this.data.billableId, Validators.required],
      payment_amount: ['', Validators.compose([Validators.required, Validators.min(0)])],
      reference_no: ['', Validators.required],
      effective_date: ['', Validators.required],
      payment_method: ['', Validators.required],
      is_deposited: [false],
      deposit_date: [],
      payor_control_claim_no: [''],
      is_penalty: [false],
      penalty_amount: [, Validators.compose([Validators.min(0)])],
      is_interest_paid: [false],
      interest_paid: [, Validators.compose([Validators.min(0)])],
      is_bill_closed: [false],
      write_off_reason: [''],
      eor_allowance: [, Validators.compose([Validators.min(0)])],
    })
    this.postPaymentForm.value.is_deposited ? this.postPaymentForm.get('deposit_date').enable() : this.postPaymentForm.get('deposit_date').disable();
    this.postPaymentForm.value.is_penalty ? this.postPaymentForm.get('penalty_amount').enable() : this.postPaymentForm.get('penalty_amount').disable();
    this.postPaymentForm.value.is_interest_paid ? this.postPaymentForm.get('interest_paid').enable() : this.postPaymentForm.get('interest_paid').disable();
    this.postPaymentForm.value.is_bill_closed ? this.postPaymentForm.get('write_off_reason').enable() : this.postPaymentForm.get('write_off_reason').disable();
    if (data.status) {
      this.billingService.getPostPayment(data.id).subscribe(pay => {
        this.paymentDetails = pay.data;
        pay.data.payment_amount = pay.data.payment_amount ? parseFloat(pay.data.payment_amount).toFixed(2) : pay.data.payment_amount;
        pay.data.interest_paid = pay.data.interest_paid ? parseFloat(pay.data.interest_paid).toFixed(2) : pay.data.interest_paid;
        pay.data.penalty_amount = pay.data.penalty_amount ? parseFloat(pay.data.penalty_amount).toFixed(2) : pay.data.penalty_amount;
        pay.data.eor_allowance = pay.data.eor_allowance ? parseFloat(pay.data.eor_allowance).toFixed(2) : pay.data.eor_allowance;
        this.postPaymentForm.patchValue(pay.data);
        this.postPaymentForm.value.is_deposited ? this.postPaymentForm.get('deposit_date').enable() : this.postPaymentForm.get('deposit_date').disable();
        this.postPaymentForm.value.is_penalty ? this.postPaymentForm.get('penalty_amount').enable() : this.postPaymentForm.get('penalty_amount').disable();
        this.postPaymentForm.value.is_interest_paid ? this.postPaymentForm.get('interest_paid').enable() : this.postPaymentForm.get('interest_paid').disable();
        this.postPaymentForm.value.is_bill_closed ? this.postPaymentForm.get('write_off_reason').enable() : this.postPaymentForm.get('write_off_reason').disable();
      }, error => {

      })

    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  formData = new FormData()
  fileList: File[] = [];
  listOfFiles: any[] = [];
  addFile(event) {
    this.fileList = []
    this.listOfFiles = []
    let fileTypes = ['pdf', 'jpg', 'jpeg', 'png']
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (fileTypes.includes(event.target.files[i].name.split('.').pop().toLowerCase())) {
        var FileSize = event.target.files[i].size / 1024 / 1024; // in MB
        if (FileSize > 30) {
          this.alertService.openSnackBar(event.target.files[i].name + " file too long", 'error');
          return;
        }
      } else {
        this.file = []
        this.alertService.openSnackBar(event.target.files[i].name + " file is not accepted", 'error');
        return;
      }
      this.fileList.push(selectedFile);
      this.listOfFiles.push(selectedFile.name)

    }
    this.fileUpload.nativeElement.value = "";
    this.postPaymentForm.patchValue({ is_file_change: true })
  }
  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }
  postIsSubmit: boolean = false;
  PaymentFormSubmit() {
    this.postIsSubmit = true;
    this.postPaymentForm.value.is_deposited ? this.postPaymentForm.get('deposit_date').setValidators([Validators.compose([Validators.required])]) : this.postPaymentForm.get('deposit_date').setValidators([]);
    this.postPaymentForm.value.is_penalty ? this.postPaymentForm.get('penalty_amount').setValidators([Validators.compose([Validators.required, Validators.min(0)])]) : this.postPaymentForm.get('penalty_amount').setValidators([]);
    this.postPaymentForm.value.is_interest_paid ? this.postPaymentForm.get('interest_paid').setValidators([Validators.compose([Validators.required, Validators.min(0)])]) : this.postPaymentForm.get('interest_paid').setValidators([]);
    this.postPaymentForm.value.is_bill_closed ? this.postPaymentForm.get('write_off_reason').setValidators([Validators.compose([Validators.required])]) : this.postPaymentForm.get('write_off_reason').setValidators([]);

    Object.keys(this.postPaymentForm.controls).forEach((key) => {
      this.postPaymentForm.get(key).updateValueAndValidity();
      if (this.postPaymentForm.get(key).value && typeof (this.postPaymentForm.get(key).value) == 'string')
        this.postPaymentForm.get(key).setValue(this.postPaymentForm.get(key).value.trim())
    });
    if (this.postPaymentForm.invalid) {
      this.postPaymentForm.markAllAsTouched();
      return;
    }
    this.formData = new FormData();
    Object.keys(this.postPaymentForm.value).map((key, value) => {
      this.formData.append(key, this.postPaymentForm.value[key])
    });
    for (let i = 0; i < this.fileList.length; i++) {
      this.formData.append('file', this.fileList[i])
    }
    this.billingService.billingPostPayment(this.data.billingId, this.formData).subscribe(post => {
      if (!this.postPaymentForm.value.id) {
        this.alertService.openSnackBar("Post payment created successfully", 'success');
      } else {
        this.alertService.openSnackBar("Post payment updated successfully", 'success');
      }

      this.dialogRef.close(post.data);
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })


  }

  fileDownload(file) {
    saveAs(file.post_payment_file_url, file.file_name, '_self');
  }

  removeFile(i) {
    this.postPaymentForm.patchValue({ file: null, is_file_change: true })
    this.listOfFiles.splice(i, 1);
    this.fileList.splice(i, 1);
    this.alertService.openSnackBar("File deleted successfully!", 'success');
  }

  removeFileEdit(i, file) {

    this.billingService.deleteDocument(file.id).subscribe(res => {
      this.paymentDetails.exam_report_file_url.splice(i, 1)
      this.alertService.openSnackBar("File deleted successfully!", 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
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
  constructor(
    public dialogRef: MatDialogRef<billingOnDemandDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public billingService: BillingService,
    private alertService: AlertService) {
    dialogRef.disableClose = true;
    this.billingService.seedData("state").subscribe(res => {
      this.states = res.data;
    })
    this.getBillRecipient();
  }

  onNoClick(): void {
    this.dialogRef.close();
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
      width: '350px',
      data: { name: "delete" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.billingService.removeRecipient(element.id).subscribe(res => {
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
      rec.data.map(doc => {
        if (doc.recipient_type && doc.recipient_type == 'Insurance Company') {
          this.selection1.select(doc);
        }
      })
      console.log(rec.data);
      this.recipients = new MatTableDataSource(rec.data);
    })
  }


  download(data) {
    saveAs(data.exam_report_file_url, data.file_name, '_self');
    this.alertService.openSnackBar("File downloaded successfully", "success");
  }

  billingOnDemand() {

    if (this.selection1.selected.length == 0) {
      this.alertService.openSnackBar('Please select Recipient(s)', "error");
      return;
    }
    let recipientsDocuments_ids: any = [];
    let addressEmpty = false;
    let isClaimant = false;
    let isInsurance = false;
    let isInsuranceAddress = false;
    this.selection1.selected.map(res => {
      if (res.type == "custom") {
        recipientsDocuments_ids.push(res.id)
      } else {
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
      isClaimant: isClaimant
    }

    if (addressEmpty) {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: '500px',
        data: { title: 'Bill on demand', message: "Recipient address seems to be incomplete. Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          this.billingService.onDemandBilling(data).subscribe(bill => {
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
              setTimeout(() => {
                this.download({ exam_report_file_url: bill.data.bill_on_demand_signed_zip_file_url, file_name: bill.data.bill_on_demand_zip_file_name })
              }, 1000);

            }
            this.alertService.openSnackBar("Billing On Demand created successfully!", 'success');
          }, error => {
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
          this.download({ exam_report_file_url: bill.data.exam_report_signed_file_url, file_name: bill.data.exam_report_csv_file_name })
        }
        if (bill.data.bill_on_demand_signed_zip_file_url) {
          setTimeout(() => {
            this.download({ exam_report_file_url: bill.data.bill_on_demand_signed_zip_file_url, file_name: bill.data.bill_on_demand_zip_file_name })
          }, 1000);

        }
        this.alertService.openSnackBar("Billing On Demand created successfully!", 'success');
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }

  }

  typeIfRecipient = "";
  openAddAddress(element): void {
    console.log(element)
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
    this.billingService.billingDownloadAll(this.data.claimId, this.data.billableId, this.data.billingId).subscribe(doc => {
      saveAs(doc.data.file_url, doc.data.file_name, '_self');
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