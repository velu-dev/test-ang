import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from '../../service/claim.service';
import { Observable } from 'rxjs';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import * as moment from 'moment';
export interface PeriodicElement1 {
  file_name: string;
  date: string;
}
export const MY_CUSTOM_FORMATS = {
  parseInput: 'L LT',
  fullPickerInput: 'MM-DD-YYYY hh:mm A',
  datePickerInput: 'MM-DD-YYYY hh:mm A',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

const ELEMENT_DATA1: PeriodicElement1[] = [
  { file_name: "Appointment Notification Letter", date: "01-02-2020" },
  { file_name: "QME 110 - QME Appointment Notification Form", date: "01-02-2020" },
  { file_name: "QME 122 - AME or QME Declaration of Service of…", date: "01-02-2020" }
];

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },]
})
export class AppointmentDetailsComponent implements OnInit {
  displayedColumnsForDocuments: string[] = ['file_name', 'updatedAt', 'action'];
  documentsData: any = [];
  displayedColumns = ['doc_image', 'doc_name', 'date', 'action'];
  dataSource: any = [];
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  xls = globals.xls
  xls_1 = globals.xls_1
  docx = globals.docx
  pdf = globals.pdf
  simplexam_service = globals.simplexam_service
  isMobile: boolean;
  claim_id: any;
  examinationDetails: any;
  examinationStatus = [];
  collapsed = false;
  docCollapsed = false;
  noteCollapsed = false;
  documentType: any;
  documentList: any;
  documentTabData: any;
  filterValue: String;
  tabIndex = 0;
  noteDisable: boolean = false;
  saveButtonStatus: boolean = false;
  file = '';
  procedureTypeStatus = [{ name: "Correspondence", icon: "far fa-folder-open", for: ["E", "S", "D"], url: "../../correspondance" }, { name: "History", icon: "fa fa-history", for: ["E", "S"], url: "../../history" }, { name: "Records", icon: "far fa-list-alt", for: ["E", "S"], url: "../../records" }, { name: "Examination", icon: "far fa-edit", for: ["E"], url: "../../examination" }, { name: "Report", icon: "fa fa-tasks", for: ["E", "S", "D"], url: "../../reports" }];
  procedureTypeList = [];
  forms = [
    { name: "QME-110", group: "QME", value: "110" },
    { name: "QME-122", group: "QME", value: "122" },
    { name: "DWCCA-10232_1", group: "DWCCA", value: "10232_1" },
    { name: "DWCCA-10232_2", group: "DWCCA", value: "10232_2" },
    { name: "DEU-100", group: "DEU", value: "100" },
    { name: "DEU-101", group: "DEU", value: "101" },
    { name: "QME-121", group: "QME", value: "121" },
    { name: "QME-AME Appointment Notification", group: "QME/AME", value: "notification" },
    { name: "SBR-1", group: "DWC", value: "SBR_1" },
    { name: "IBR-1", group: "DWC", value: "IBR_1" },
    { name: "QME-111", group: "QME", value: "111" },
    { name: "QME-112", group: "QME", value: "112" },
    { name: "DWCAD-1013336", group: "DWCAD", value: "1013336" },
    { name: "QME-123", group: "QME", value: "123" },
    // { name: "DEU-100 Spanish", group: "DEU", value: "S100" },
    // { name: "DEU-111", group: "DEU", value: "111" },
    // { name: "QME-111", group: "QME", value: "111" },
    // { name: "DWC-AD-10133.36", group: "DWC", value: "10133" },
    // { name: "DWC-SBR-1", group: "DWC", value: "SBR-1" },
    // { name: "DWC-IBR-1", group: "DWC", value: "IBR-1" },
    // { name: "QME-112", group: "QME", value: "112" },
    // { name: "QME-123", group: "QME", value: "123" },
    // { name: "QME-123-Instructions", group: "QME", value: "123-I" },
  ]
  formId = "";
  examiner_id = "";
  billableId: number;
  billable_item: FormGroup;
  notesForm: FormGroup;
  examinarList = [];
  procuderalCodes = [];
  modifiers = [];
  modifierList = [];
  primary_language_spoken: boolean = false;
  examinarAddress = [];
  contactTypes: any;
  isBillabbleItemLoading = false;
  languageId = "";
  languageList: any = [];
  callerAffliation = [];
  isEditBillableItem = false;
  isNotesEdit = false;
  isChecked = false;
  isDisplayStatus: any = { status: false, name: "", isExaminar: false, isDeposition: false };
  billableData: any;
  constructor(public dialog: MatDialog, private examinerService: ExaminerService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private claimService: ClaimService
  ) {
    this.loadForms();
    this.claimService.seedData("intake_contact_type").subscribe(res => {
      this.contactTypes = res.data;
    })
    this.claimService.seedData("agent_type").subscribe(res => {
      this.callerAffliation = res.data;
    })
    // this.claimService.seedData("procedural_codes").subscribe(res => {
    //   res.data.map(proc => {
    //     if (proc.procedural_code != "ML100") {
    //       this.procuderalCodes.push(proc);
    //     }
    //   })
    // })
    this.loadDatas();
    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;
    })
    this.claimService.seedData("language").subscribe(res => {
      this.languageList = res.data;
    })
    // this.examinerService.seedData('examination_status').subscribe(res => {
    //   this.examinationStatus = res.data;
    // })

  }
  loadDatas() {
    this.procedureTypeList = [];
    this.modifiers = [];
    this.route.params.subscribe(params => {
      this.claim_id = params.id;

      this.billableId = params.billId;
      this.isBillabbleItemLoading = true;
      this.claimService.getBillableItemSingle(this.billableId).subscribe(bills => {
        this.billableData = bills.data;
        this.isChecked = bills.data.exam_type.is_psychiatric;
        this.claimService.getClaim(this.claim_id).subscribe(claim => {
          this.claimService.getProcedureType(claim.data.claim_details.exam_type_id).subscribe(procedure => {
            this.procuderalCodes = procedure.data;
            // if (this.isChecked) {
            //   let modi = [5];
            //   this.billable_item.value.exam_type.modifier_id.map(res => {
            //     modi.push(res)
            //   })
            //   this.billable_item.patchValue({
            //     exam_type: {
            //       is_psychiatric: true,
            //       modifier_id: modi,
            //     }
            //   })
            //   this.procuderalCodes.map(proc => {
            //     if (proc.id == claim.data.exam_type.procedure_type) {
            //       proc.modifier.map(modifier => {
            //         if (modifier.modifier_code != "96")
            //           this.modifiers.push(modifier);
            //       })
            //     }
            //   })
            //   // this.modifiers = this.modifierList;
            // } else {
            //   let modi = []
            //   this.procuderalCodes.map(proc => {
            //     if (proc.id == claim.data.exam_type.procedure_type) {
            //       proc.modifier.map(modifier => {
            //         if (modifier.modifier_code != "96")
            //           this.modifiers.push(modifier);
            //         modi.push(modifier.id)
            //       })
            //     }
            //   })
            //   this.billable_item.patchValue({
            //     exam_type: {
            //       is_psychiatric: false,
            //       modifier_id: modi,
            //     }
            //   })

            // }
          })
        })
        this.isBillabbleItemLoading = false;
        if (bills['data'].appointment.examiner_id != null) {
          let ex = { id: bills['data'].appointment.examiner_id, address_id: bills['data'].appointment.examiner_service_location_id }
          this.examinarChange(ex)
        }
        if (bills['data'].exam_type.primary_language_spoken) {
          this.primary_language_spoken = true;
          this.languageId = bills['data'].exam_type.primary_language_spoken;
        }
        console.log(bills.data)
        this.billable_item.patchValue(bills.data);
      })
      this.examinerService.getAllExamination(this.claim_id, this.billableId).subscribe(response => {
        this.notesForm.patchValue({
          exam_notes: response.data.exam_notes,
        })
        if (response.data.procedure_type == "Evaluation" || response.data.procedure_type == "Reevaluation") {
          this.isDisplayStatus.isExaminar = true;
          this.isDisplayStatus.isDeposition = false;
          this.claimService.seedData('examination_status').subscribe(curres => {
            this.examinationStatus = curres.data;
          })
        } else if (response.data.procedure_type == "Deposition") {
          this.isDisplayStatus.isExaminar = false;
          this.isDisplayStatus.isDeposition = true;
          this.claimService.seedData('deposition_status').subscribe(curres => {
            this.examinationStatus = curres.data;
          })
        }
        this.procedureTypeStatus.map(pro => {
          if (response.data.procedure_type == "Evaluation" || response.data.procedure_type == "Reevaluation") {
            this.isDisplayStatus.status = true;
            this.isDisplayStatus.name = "Examination";
            if (pro.for.includes('E')) {
              this.procedureTypeList.push(pro);
            }
          }
          if (response.data.procedure_type == "Supplemental") {
            this.isDisplayStatus.status = false;
            if (pro.for.includes('S')) {
              this.procedureTypeList.push(pro);
            }
          }
          if (response.data.procedure_type == "Deposition") {
            this.isDisplayStatus.status = true;
            this.isDisplayStatus.name = "Deposition";
            if (pro.for.includes('D')) {
              this.procedureTypeList.push(pro);
            }
          }
        })
        this.examinationStatusForm.patchValue(response.data.appointments)
        this.claimant_name = response.data.claimant_name.first_name + " " + response.data.claimant_name.middle_name + " " + response.data.claimant_name.last_name;
        this.examiner_id = response.data.appointments.examiner_id;
        this.examinationDetails = response['data'];
        console.log("examinationDetails", this.examinationDetails);
        this.getDocumentData();
      }, error => {
        this.dataSource = new MatTableDataSource([]);
      })
    });
  }
  claimant_name = "";
  examinationStatusForm: FormGroup;
  loadForms() {

  }
  ngOnInit() {
    this.billable_item = this.formBuilder.group({
      id: [{ value: '', disable: true }],
      claim_id: [this.claim_id],
      exam_type: this.formBuilder.group({
        exam_procedure_type_id: [{ value: '', disable: true }, Validators.required],
        // modifier_id: [{ value: '', disable: true }],
        // is_psychiatric: [{ value: false, disable: true }],
        primary_language_spoken: [{ value: '', disabled: true }]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [{ value: '', disable: true }],
        appointment_scheduled_date_time: [{ value: '', disable: true }],
        duration: [{ value: '', disable: true }, Validators.compose([Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(450)])],
        examiner_service_location_id: [{ value: '', disable: true }]
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [{ value: '', disable: true }],
        caller_name: [{ value: '', disable: true }],
        call_date: [{ value: '', disable: true }],
        call_type: [{ value: '', disable: true }],
        call_type_detail: [{ value: '', disable: true }],
        notes: [{ value: '', disable: true }],
      })
    })
    this.notesForm = this.formBuilder.group({
      exam_notes: [null],
      bill_item_id: [this.billableId]
    })
    this.examinationStatusForm = this.formBuilder.group({
      id: "",
      examination_status: [{ value: "", disabled: true }, Validators.required],
      examination_notes: [{ value: "", disabled: true }]
    })
    this.examinerService.seedData('document_category').subscribe(type => {
      this.documentList = type['data']
    })
    this.notesForm.disable();
    this.billable_item.disable();
  }
  isExaminationStatusEdit = false;
  changeEditStatus() {
    this.examinationStatusForm.enable();
    this.isExaminationStatusEdit = true;
  }
  examinationStatusSubmit() {
    if (this.examinationStatusForm.invalid) {
      return;
    }
    this.examinerService.updateExaminationStatus(this.examinationStatusForm.value).subscribe(res => {
      this.examinationStatusForm.disable()
      this.isExaminationStatusEdit = false;
      this.alertService.openSnackBar(res.message, "success");
      this.loadDatas();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  cancel() {
    this.examinationStatusForm.patchValue(this.examinationDetails.appointments);
    this.examinationStatusForm.disable();
    this.isExaminationStatusEdit = false;
  }
  billableCancel() {
    this.billable_item.disable();
    this.billable_item.patchValue(this.billableData);
    this.isEditBillableItem = false;

  }
  // psychiatric(event) {
  //   this.isChecked = event.checked;
  //   this.modifiers = [];
  //   if (event.checked) {
  //     let modi = [5];
  //     this.billable_item.value.exam_type.modifier_id.map(res => {
  //       // if (res != 5) {
  //       modi.push(res)
  //       // }
  //     })
  //     this.modifiers = this.modifierList;
  //     this.billable_item.patchValue({
  //       exam_type: {
  //         is_psychiatric: true,
  //         modifier_id: modi,
  //       }
  //     })
  //   } else {
  //     let modi = [];
  //     this.billable_item.value.exam_type.modifier_id.map(res => {
  //       if (res != 5) {
  //         modi.push(res)
  //       }
  //     })
  //     this.billable_item.patchValue({
  //       exam_type: {
  //         modifier_id: modi,
  //         is_psychiatric: false
  //       }
  //     })
  //     // this.modifiers = [];
  //     // this.modifierList.map(res => {
  //     //   if (res.modifier_code != "96")
  //     //     this.modifiers.push(res);
  //     // })
  //   }
  // }
  selectedLanguage: any;
  modifyChange() {
    if (this.billable_item.value.exam_type.modifier_id)
      if (this.billable_item.value.exam_type.modifier_id.includes(2)) {
        this.languageList.map(res => {

          if (res.id == this.languageId) {
            this.primary_language_spoken = true;
            this.selectedLanguage = res;
          }
        })
        this.billable_item.patchValue({
          exam_type: { primary_language_spoken: this.languageId }
        })
      }
  }
  examinarChange(examinar) {
    this.claimService.getExaminarAddress(examinar.id).subscribe(res => {
      this.examinarAddress = res['data'];
    })
  }
  editBillable() {
    this.isEditBillableItem = true;
    this.billable_item.enable();
  }
  submitBillableItem() {
    if (this.billable_item.invalid)
      return
    this.billable_item.value.exam_type.is_psychiatric = this.isChecked;
    this.billable_item.value.appointment.duration = this.billable_item.value.appointment.duration == "" ? null : this.billable_item.value.appointment.duration;
    this.examinerService.updateBillableItem(this.billable_item.value).subscribe(res => {
      this.isEditBillableItem = false;
      this.billable_item.disable();
      this.alertService.openSnackBar(res.message, "success");
      this.loadDatas();
      this.examinerService.getAllExamination(this.claim_id, this.billableId).subscribe(response => {
        this.examinationDetails = response['data']
      })
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  getDocumentData() {
    this.examinerService.getDocumentData(this.claim_id, this.billableId).subscribe(res => {
      this.documentTabData = res['data'];
      this.tabChanges(this.tabIndex)
    }, error => {
      this.documentsData = new MatTableDataSource([]);
    })
  }

  tabChanges(event) {
    this.tabIndex = event
    this.filterValue = '';
    this.documentsData = new MatTableDataSource([])
    let data = this.documentTabData ? this.documentTabData[this.tabNames(event)] : []
    this.documentsData = new MatTableDataSource(data)
  }
  todayDate = { appointment: new Date(), intake: new Date() };
  minDate: any;
  pickerOpened(type) {
    if (type = 'intake') {
      let date = moment();
      this.minDate = date.subtract(60, 'days');
      this.todayDate.intake = new Date();
      this.todayDate.intake = new Date();
    } else {
      this.todayDate.appointment = new Date();
    }
  }
  changeExaminarAddress(address) {
    this.billable_item.patchValue({
      appointment: {
        examiner_service_location_id: address.address_id
      }
    })
  }

  tabNames(index) {
    switch (index) {
      case 0:
        return 'correspondence';
      case 1:
        return 'history';
      case 2:
        return 'records';
      case 3:
        return 'report'
      case 4:
        return 'transcription';
      default:
        return 'form';
    }

  }

  selectedFile: File;
  formData = new FormData()
  errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  addFile(event) {
    this.selectedFile = null;
    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'mp3']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.errors.file.isError = true;
        this.errors.file.error = "This file too long";
        // this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.errors.file.isError = false;
      this.errors.file.error = "";
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
    if (!this.documentType) {
      this.errors.doc_type.isError = true;
      this.errors.doc_type.error = "Please select Document type";
      // this.alertService.openSnackBar("Please select Document type", 'error');
      return;
    }
    this.formData.append('file', this.selectedFile);
    this.formData.append('document_category_id', this.documentType);
    this.formData.append('claim_id', this.claim_id);
    this.formData.append('bill_item_id', this.billableId.toString());
    this.examinerService.postDocument(this.formData).subscribe(res => {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.documentType = null;
      this.formData = new FormData();
      this.file = "";
      this.getDocumentData();
      this.errors.doc_type.isError = false;
      this.errors.doc_type.error = "";
      this.alertService.openSnackBar("File added successfully!", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  download(data) {
    saveAs(data.exam_report_file_url, data.file_name);
  }

  applyFilter(filterValue: string) {
    this.documentsData.filter = filterValue.trim().toLowerCase();
  }

  deleteDocument(data) {
    this.openDialog('delete', data);
  }
  formChanges(event) {

  }
  generateForm() {
    if (this.formId) {
      let formPre = "";
      this.forms.map(res => {
        if (res.value == this.formId) {
          formPre = res.group;
        }
      })
      let claim_id: any;
      if (this.formId == "notification" || this.formId == "111") {
        claim_id = this.claim_id + "/" + this.examiner_id;
      } else {
        claim_id = this.claim_id;
      }
      this.examinerService.getForms(claim_id, this.formId, formPre, this.billableId).subscribe(res => {
        // let data = this.dataSource.data;
        // data.push(res.data);
        // this.dataSource = new MatTableDataSource(data);
        this.formId = "";
        this.getDocumentData();
      })
    } else {
      this.alertService.openSnackBar('Please select a form', 'error');
    }
  }
  notesEdit() {
    this.notesForm.enable();
    this.isNotesEdit = true;
  }
  noteSubmit() {
    if (this.notesForm.invalid)
      return
    this.examinerService.postNotes(this.notesForm.value).subscribe(res => {
      this.alertService.openSnackBar("Note added successfully!", 'success');
      this.saveButtonStatus = false;
      this.notesForm.disable();
      this.isNotesEdit = false;
      this.loadDatas();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })

  }

  noteCancel() {
    this.saveButtonStatus = false;
    this.isNotesEdit = false;
    this.notesForm.disable();
    this.notesForm.patchValue({ exam_notes: this.examinationDetails.exam_notes })
  }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.examinerService.deleteDocument(data.id).subscribe(res => {
          this.getDocumentData();
          this.alertService.openSnackBar("File deleted successfully!", 'success');
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    })


  }



  openClaimant(): void {
    const dialogRef = this.dialog.open(ClaimantPopupComponent, {
      width: '800px',
      data: this.examinationDetails,

    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openClaim(): void {
    const dialogRef = this.dialog.open(ClaimPopupComponent, {
      width: '800px',
      data: this.examinationDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openBillableItem() {
    const dialogRef = this.dialog.open(BillableitemPopupComponent, {
      width: '800px',
      data: this.examinationDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  procedure_type(procuderalCode) {
    if (procuderalCode.modifier)
      this.modifiers = procuderalCode.modifier;
    this.billable_item.patchValue({
      exam_type: { modifier_id: [] }
    })
  }
}
@Component({
  selector: 'claimant-dialog',
  templateUrl: 'claimant-dialog.html',
})
export class ClaimantPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ClaimantPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'claim-dialog',
  templateUrl: 'claim-dialog.html',
})
export class ClaimPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ClaimPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'billableitem-dialog',
  templateUrl: 'billableitem-dialog.html',
})
export class BillableitemPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<BillableitemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
