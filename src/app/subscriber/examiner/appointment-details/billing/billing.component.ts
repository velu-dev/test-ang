import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { NGXLogger } from 'ngx-logger';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
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
  dataSource3 = ELEMENT_DATA3;
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


  //table
  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;

  payors = [
    { name: "WC100 - 1-888-OHIOCOMP"},
    { name: "37850 - 1ST AUTO & CASUALTY (CORVEL)"},
    { name: "WC170 - 1ST CHOICE STAFFING INC"},
    { name: "WC171 - 20/20 BUILDERS"},
    { name: "CB150 - 21ST CENTURY INSURANCE"},
  ]

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
        this.columnsToDisplay1 = ['item', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action']
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
  }
  icdCtrl = new FormControl();
  icdSearched = false;
  filteredICD: any = [];


  openDialog(): void {
    const dialogRef = this.dialog.open(BillingPaymentDialog, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.icdCtrl.valueChanges.subscribe(res => {
      this.icdSearched = true;
      this.claimService.getICD10(res).subscribe(icd => {
        console.log(icd)
        this.filteredICD = icd[3];
      });
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
      this.icdData = billing.data.billing_diagnosis_code;
      this.IcdDataSource = new MatTableDataSource(this.icdData);
      this.logger.log("billing", billing)

      this.addRow();
      let firstData= {
        id:billing.data.billing_line_items[0].id,
        item: billing.data.billing_line_items[0].item_description,
        procedure_code: billing.data.billing_line_items[0].procedure_code,
        modifier: billing.data.billing_line_items[0].modifier,
        units: billing.data.billing_line_items[0].units,
        charge: billing.data.billing_line_items[0].charge,
        payment: 0,
        balance: 1,
        isEditable: [true]
      }
      this.getFormControls.controls[0].patchValue(firstData)
      console.log(this.getFormControls.controls[0])
    }, error => {
      this.logger.error(error)
    })
  }
  icdData = [];
  selectedIcd = { code: "", name: "" };
  selectICD(icd) {
    this.selectedIcd = { code: icd[0], name: icd[1] }

  }
  openSnackBar() {
    this.alertService.openSnackBar("Payor changed successfully", "success");
  }
  addIcd() {
    if (this.selectedIcd.code != '') {
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
    }

    this.billingService.onDemandBilling(data).subscribe(bill => {
      this.logger.log("onDemand", bill)
      this.download({ exam_report_file_url: bill.data.exam_report_signed_file_url, file_name: 'Billing_on_demand.csv' })
      this.alertService.openSnackBar("Billing On Demand created successfully!", 'success');
    }, error => {
      console.log(error);
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

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
  }

  //'item', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action'
  initiateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      item: ['', Validators.required],
      procedure_code: ['', [Validators.required]],
      modifier: ['', [Validators.required]],
      units: ['', [Validators.required]],
      charge: ['', [Validators.required]],
      payment: [''],
      balance: [''],
      isEditable: [true]
    });
  }

  addRow() {
    const control = this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control = this.userTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    // if(group.status)
    console.log("edit", group, group.status)
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    console.log("Done", group.value)
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    group.get('isEditable').setValue(false);
  }

  // saveUserDetails() {
  //   console.log(this.userTable.value);
  // }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  // submitForm() {
  //   const control = this.userTable.get('tableRows') as FormArray;
  //   this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
  //   console.log(this.touchedRows);
  // }

  cancelRow(group: FormGroup,i) {
    console.log("cancel", group,i);
   
    let data= {
      id:this.billingData.billing_line_items[i].id,
      item: this.billingData.billing_line_items[i].item_description,
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

  rowSelected(group: FormGroup){
    //console.log("select", group);
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
  { "id": 6, "file_name": "Appointment Notification Letter", "action": "Mailed On Demand", "date_submitted": "05-25-2019",  "date_received": "05-25-2019", "recipients": "Claimant, Claims Adjuster, Applicant Attorney Defense Attorney, Employer, DEU Office", "download": "Download",},
  { "id": 5, "file_name": "QME 110 - QME Appointment Notification Form", "action": "Downloaded", "date_submitted": "05-25-2019",  "date_received": "05-25-2019", "recipients": "", "download": "Download",},
  { "id": 9, "file_name": "QME 122 - AME or QME Declaration of Service of…", "action": "Downloaded", "date_submitted": "05-25-2019",  "date_received": "05-25-2019", "recipients": "", "download": "Download",},

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