import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map, startWith } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { NGXLogger } from 'ngx-logger';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
  isMobile2 = false;
  dataSource3 = new MatTableDataSource([]);
  columnsToDisplay3 = [];
  expandedElement3;
  columnName3 = [];
  isMobile3 = false;
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
  filteredFruits: Observable<string[]>;
  modifier_: string[] = ['96'];
  allFruits: string[] = ['93', '94', '95', '96'];

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  constructor(private logger: NGXLogger, private claimService: ClaimService, private breakpointObserver: BreakpointObserver,
    private alertService: AlertService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public billingService: BillingService,
    private fb: FormBuilder,) {
    this.route.params.subscribe(param => {
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
      this.isMobile1 = res;
      if (res) {
        this.columnName1 = ["", "Item", "Action"]
        this.columnsToDisplay1 = ['is_expand', 'code', "action"]
      } else {
        this.columnName1 = ["Item", "Procedure Code", "Modifier", "Units", "Charge", "Payment", "Balance", "Action"]
        this.columnsToDisplay1 = ['item_description', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action']
      }
      this.isMobile2 = res;
      if (res) {
        this.columnName2 = ["", "File Name", "Action"]
        this.columnsToDisplay2 = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName2 = ["", "File Name", "Type", "Date", "Action"]
        this.columnsToDisplay2 = ['doc_image', 'file_name', 'document_type', 'updatedAt', "action"]
      }

      this.isMobile3 = res;
      if (res) {
        this.columnName3 = ["", "File Name", "Action"]
        this.columnsToDisplay3 = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName3 = ["", "File Name", "Action", "Date Submitted", "Date Received", "Recipients", "Download"]
        this.columnsToDisplay3 = ['doc_image', 'file_name', 'action', 'date_submitted', 'date_received', "recipients", "download"]
      }
    })

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.modifier_.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.modifier_.indexOf(fruit);

    if (index >= 0) {
      this.modifier_.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.modifier_.push(event.option.viewValue);
    //this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }



  icdCtrl = new FormControl();
  icdSearched = false;
  filteredICD: any = [];

  payorCtrl = new FormControl();


  openDialog(): void {
    const dialogRef = this.dialog.open(BillingPaymentDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
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

    //table
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });

  }

  getBillingDetails() {
    this.billingService.getBilling(this.paramsId.claim_id, this.paramsId.billId).subscribe(billing => {
      this.billingData = billing.data;
      this.icdData = billing.data && billing.data.billing_diagnosis_code ? billing.data.billing_diagnosis_code : [];
      this.IcdDataSource = new MatTableDataSource(this.icdData);
      this.logger.log("billing", billing)
      if (billing.data.payor_id) {
        this.payorCtrl.patchValue(billing.data.payor_id + ' - ' + billing.data.payor_name)
      }

      if (billing.data && billing.data.billing_line_items) {
        billing.data.billing_line_items.map((item, index) => {
          let firstData = {};
          this.addRow(1);
          firstData = {
            id: item.id,
            item_description: item.item_description,
            procedure_code: item.procedure_code,
            modifier: item.modifier,
            units: item.units,
            charge: item.charge,
            payment: 0,
            balance: 1,
            isEditable: [true]
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
        this.alertService.openSnackBar("ICD data added succssfully", "success");
        this.icdCtrl.reset();
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
          this.alertService.openSnackBar("ICD data removed succssfully", "success");
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
  expandId3: any;
  openElement(element) {
    if (this.isMobile) {
      this.icdExpandID = element.id;
    }
    if (this.isMobile1) {
      this.expandId1 = element.id;
    }
    if (this.isMobile2) {
      this.expandId2 = element.id;
    }
    if (this.isMobile3) {
      this.expandId3 = element.id;
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
      //modifier: [''],
      modifier: ['', Validators.compose([Validators.pattern('^[0-9]{2}(?:-[0-9]{2})?(?:-[0-9]{2})?$')])],
      units: ['', [Validators.required]],
      charge: ['', [Validators.required]],
      payment: [''],
      balance: [''],
      total_charge: [''],
      isEditable: [true]
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
        this.billingData.billing_line_items.splice(index, 1)
        return
      }, err => {
        this.alertService.openSnackBar(err.error.message, 'error');
      })
    } else {
      const control = this.userTable.get('tableRows') as FormArray;
      control.removeAt(index);
      this.billingData.billing_line_items.splice(index, 1)
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
    let data = {
      id: group.value.id,
      item_description: group.value.item_description,
      procedure_code: group.value.procedure_code,
      modifier: group.value.modifier,
      units: group.value.units,
      charge: group.value.charge,
      total_charge: this.calculateTotal()
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
      this.billingData.billing_line_items.push(group.value)
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
      id: this.billingData.billing_line_items[i].id,
      item_description: this.billingData.billing_line_items[i].item_description,
      procedure_code: this.billingData.billing_line_items[i].procedure_code,
      modifier: this.billingData.billing_line_items[i].modifier,
      units: this.billingData.billing_line_items[i].units,
      charge: this.billingData.billing_line_items[i].charge,
      payment: 0,
      balance: 1,
      isEditable: [false]
    }
    group.patchValue(data);
    group.get('isEditable').setValue(false);

  }

  rowSelected(group: FormGroup) {
  }

  calculateTotal() {
    let total = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].value.charge) {
        total += this.getFormControls.controls[j].value.charge
      }
    }
    return total;
  }

  calculateTotalBal() {
    let total = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].value.charge) {
        total += this.getFormControls.controls[j].value.charge - this.getFormControls.controls[j].value.payment
      }
    }
    return total;
  }

  calculateTotalPayment() {
    let total = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].value.payment) {
        total += this.getFormControls.controls[j].value.payment
      }
    }
    return total;
  }

  updatePayor(e) {
    this.payorCtrl.patchValue(e.payor_id + ' - ' + e.payor_name)
    this.billingService.updatePayor(this.billingId, e.id).subscribe(payor => {
      console.log(payor);
      this.alertService.openSnackBar("Payor changed successfully", "success");
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


@Component({
  selector: 'billing-payment-dialog.html',
  templateUrl: 'billing-payment-dialog.html',
})
export class BillingPaymentDialog {
  file: any;
  constructor(
    public dialogRef: MatDialogRef<BillingPaymentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addFile(e) {

  }

}