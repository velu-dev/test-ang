import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTableDataSource, MatSort, NativeDateAdapter, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatPaginator } from '@angular/material';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ClaimService } from '../../service/claim.service';
import { Observable } from 'rxjs';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import * as moment from 'moment-timezone';
import { NGXLogger } from 'ngx-logger';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
export interface PeriodicElement1 {
  file_name: string;
  date: string;
}
export const MY_CUSTOM_FORMATS = {
  parseInput: 'MM-DD-YYYY hh:mm A z',
  fullPickerInput: 'MM-DD-YYYY hh:mm A z',
  datePickerInput: 'MM-DD-YYYY hh:mm A z',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

export const PICK_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM-dd-yyyy', this.locale);;
    } else {
      return date.toDateString();
    }
  }
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { file_name: "Appointment Notification Letter", date: "01-02-2020" },
  { file_name: "QME 110 - QME Appointment Notification Form", date: "01-02-2020" },
  { file_name: "QME 122 - AME or QME Declaration of Service of…", date: "01-02-2020" }
];

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppointmentDetailsComponent implements OnInit {
  dataSource1 = new MatTableDataSource();
  columnsToDisplay1 = [];
  expandedElement1;
  columnName1 = [];
  // displayedColumnsForDocuments: string[] = ['doc_image','file_name', 'updatedAt', 'action'];
  documentsData: any = [];
  displayedColumns = ['doc_image', 'doc_name', 'date', 'action'];
  dataSource: any = [];
  @ViewChild('MatSortActivity', { static: true }) sort: MatSort;
  @ViewChild('MatPaginatorActivity', { static: true }) paginator: MatPaginator;
  @ViewChild('MatSortNote', { static: true }) sortNote: MatSort;
  @ViewChild('MatPaginatorNote', { static: true }) paginatorNote: MatPaginator;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  xls = globals.xls
  xls_1 = globals.xls_1
  status_complete = globals.status_complete
  status_inprogress = globals.status_inprogress
  docx = globals.docx
  pdf = globals.pdf
  simplexam_service = globals.simplexam_service
  isMobile: boolean = false;
  claim_id: any;
  examinationDetails: any;
  examinationStatus = [];
  collapsed = false;
  docCollapsed = false;
  noteCollapsed = false;
  documentType: any = null;
  documentList: any;
  documentTabData: any;
  filterValue: String;
  noteDisable: boolean = false;
  saveButtonStatus: boolean = false;
  file = '';
  procedureTypeStatus = [{ name: "Correspondence", progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" }, { name: "History", progress_name: 'history', icon: "fa fa-history", for: ["E"], url: "/history" }, { name: "Records", progress_name: 'record', icon: "far fa-list-alt", for: ["E", "S"], url: "/records" }, { name: "Examination Documents", progress_name: 'examination', icon: "far fa-edit", for: ["E"], url: "/examination" }, { name: "Transcription & Compilation", progress_name: 'transcription', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" }, { name: "Billing", progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
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
  progressStatus: any;
  appointmentStatus: boolean = false;
  disableExaminationArr: any = [5, 22, 27, 28, 6, 29, 7, 16, 17, 18, 19, 20, 30, 35, 36, 37, 38, 8, 21, 31, 10, 13];
  columnName = [];
  displayedColumnsForDocuments = [];
  activityColumnName = [];
  activityDisplayedColumnsForDocuments = [];
  expandedElement: any;
  userEmail: any;
  locationId: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  // isMobile = false;
  currentDate = new Date();
  activityLog: any;
  activityFilterValue: string;
  notesDataSource = new MatTableDataSource([]);
  columnsToDisplays = [];
  notecolumnName = [];
  notes: any;
  appointment_scheduled_date_time: any = null;
  role = this.cookieService.get('role_id');
  supplementalItems: any = [];
  cancelSupplemental: any;
  supplementalOtherIndex: number;
  pastTwoYearDate = moment().subtract(2, 'year');
  regulation = regulation;
  SubmittingParty = [];
  isEdit
  minimumDate = new Date(1900, 0, 1);
  today = new Date();
  mode: boolean;
  docDeclearTable: FormGroup;
  constructor(public dialog: MatDialog, private examinerService: ExaminerService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private logger: NGXLogger,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private intercom: IntercomService,
    private cookieService: CookieService,
    private userService: UserService
  ) {
    this.userEmail = JSON.parse(this.cookieService.get('user')).sign_in_email_id.toLowerCase();
    this.intercom.setBillableItem("Billable Item");
    this.cookieService.set('billableItem', null)
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
    this.getDocumentDeclareData();
    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;
    })
    // this.claimService.seedData("language").subscribe(res => {
    //   this.languageList = res.data;
    // })
    // this.examinerService.seedData('examination_status').subscribe(res => {
    //   this.examinationStatus = res.data;
    // })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Name", "Action"]
        this.displayedColumnsForDocuments = ['is_expand', 'file_name', "action"]
      } else {
        this.columnName = ["", "Name", "Uploaded On ", "Download On Demand Proof of Service", "Action"]
        this.displayedColumnsForDocuments = ['doc_image', 'file_name', 'updatedAt', 'pfs', 'action']
      }

      if (res) {
        this.activityColumnName = ["", "Action"]
        this.activityDisplayedColumnsForDocuments = ['is_expand', 'task']
      } else {
        this.activityColumnName = ["", "Type", "Action", "Created By", "Created At", "Updated By", "Updated At"]
        this.activityDisplayedColumnsForDocuments = ["status", 'module', 'task', 'created_by', "createdAt", "updated_by", 'updatedAt']
      }
      if (res) {
        this.notecolumnName = ["", "Notes"]
        this.columnsToDisplays = ['is_expand', 'notes']
      } else {
        this.notecolumnName = ["Notes", "Date Created", "User"]
        this.columnsToDisplays = ['notes', "createdAt", 'name']
      }
    })

  }

  applyActivityFilter(filterValue: string) {
    this.activityLog.filter = filterValue.trim().toLowerCase();
    if (this.activityLog.paginator) {
      this.activityLog.paginator.firstPage();
    }
  }
  noteFilterValue: any;
  applyNotesFilter(filterValue: string) {
    this.notesDataSource.filter = filterValue.trim().toLowerCase();
    if (this.notesDataSource.paginator) {
      this.notesDataSource.paginator.firstPage();
    }
  }
  documentsDeclared = [];
  getDocumentDeclareData() {
    console.log("sadasddasdasd --11")
    this.claimService.getDocumentsDeclared(this.claim_id, this.billableId).subscribe(res => {
      if (res.data) {
        this.documentsDeclared = res.data;
        res.data.map((item, i) => {
          this.addRow();
          console.log(item)
          this.getFormControls.controls[i].patchValue(item)
          this.getFormControls.controls[i].get('isEditable').patchValue(false)
        })

      } else {
        this.documentsDeclared = [];
      }
    })
  }
  loadActivity() {
    this.claimService.seedDocumentData("submitting_party_seed_data", this.claim_id, this.billableId).subscribe(res => {
      console.log(res.data)
      this.SubmittingParty = res.data;
    })

    this.claimService.getActivityLog(this.claim_id, this.billableId).subscribe(res => {
      this.activityLog = new MatTableDataSource(res.data);
      this.activityLog.sort = this.sort;
      this.activityLog.paginator = this.paginator;
    })
  }
  isExamTypeChanged = false;
  examinerId = null;
  examinerName = "";
  isFreeze: boolean = false;
  loadDatas() {
    this.procedureTypeList = [];
    this.modifiers = [];
    this.route.params.subscribe(params => {
      this.billableId = params.billId;
      this.claim_id = params.claim_id;
      this.loadActivity();
      this.examinerService.getNotes(this.billableId).subscribe(notes => {
        if (notes.data) {
          notes.data.map(data => {
            data.create = data.createdAt ? moment(data.createdAt).format('MM-DD-yyyy hh:mm a') : null;
            data.name = data.user.first_name + ' ' + data.user.last_name + ' ' + data.user.suffix
          })
          this.notesDataSource = new MatTableDataSource(notes.data);
          this.notesDataSource.sort = this.sortNote;
          this.notesDataSource.paginator = this.paginatorNote;
        }

      }, error => {

      })
      this.isBillabbleItemLoading = true;
      this.claimService.getBillableItemSingle(this.billableId).subscribe(bills => {
        if (bills.data.is_first_ebill_ondemand_requested || bills.data.is_second_ebill_ondemand_requested || bills.data.is_exam_type_changed) {
          this.isFreeze = true;
        }
        this.billableData = bills.data;
        if (this.billableData.appointment.examiner_service_location_id == null) {
          this.service_location_name = '0';
        }
        // this.isExamTypeChanged = bills.data.is_exam_type_changed;
        this.isChecked = bills.data.exam_type.is_psychiatric;
        // this.claimService.getClaim(this.claim_id).subscribe(claim => {
        //   this.breadcrumbService.set("appointment-details/:id/:billId", claim.data.claimant_details.first_name)
        //   this.claimService.getProcedureType(claim.data.claim_details.exam_type_id).subscribe(procedure => {
        //     this.procuderalCodes = procedure.data;
        //   })
        // })
        // this.claimService.getProcedureType(bills.data.exam_type_id).subscribe(procedure => {
        //   this.procuderalCodes = procedure.data;
        //   procedure.data.map(proc => {
        //     if (proc.exam_procedure_type_id == bills.data.exam_type.exam_procedure_type_id) {
        //       this.procedure_type(proc);
        //     }
        //   })
        // })
        this.claimService.getProcedureTypeAttoney(this.claim_id, this.billableId).subscribe(procedure => {
          this.procuderalCodes = procedure.data;
          procedure.data.map(proc => {
            if (proc.exam_procedure_type_id == bills.data.exam_type.exam_procedure_type_id) {
              this.procedure_type(proc, true);
            }
          })
        })
        this.isBillabbleItemLoading = false;
        if (bills['data'].appointment.examiner_id != null) {
          this.examinerId = bills['data'].appointment.examiner_id;
          let ex = { id: bills['data'].appointment.examiner_id, address_id: bills['data'].appointment.examiner_service_location_id }
          // this.examinarList.map(examinar => {
          //   if (examinar.id === this.billableData.appointment.examiner_id) {
          //     this.examinerName = examinar.first_name + " " + examinar.middle_name + " " + examinar.last_name + " " + (examinar.suffix ? (", " + examinar.suffix) : "");
          //   }
          // })
          this.examinarChange(ex)
        }
        if (bills['data'].exam_type.primary_language_spoken) {
          this.primary_language_spoken = true;
          this.languageId = bills['data'].exam_type.primary_language_spoken;
        }
        this.billableData.documents_received = this.billableData.documents_received ? this.billableData.documents_received : []
        this.billable_item.patchValue(bills.data);
        this.changeDateType(bills.data.appointment.appointment_scheduled_date_time)
        if (bills.data.appointment.is_virtual_location) {
          this.billable_item.patchValue({
            appointment: {
              examiner_service_location_id: "0"
            }
          })
        }
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billableData.documents_received.map((doc, index) => {
          let ind = this.supplementalItems.findIndex(docs => docs.name == doc);

          if (ind != -1) {
            controlArray[ind] = (true)
          }
        })
        let disableStatus = this.billable_item.get('documents_received').disabled
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
        if (disableStatus) {
          this.billable_item.get('documents_received').disable()
        }

        // })
        this.examinerService.getAllExamination(this.claim_id, this.billableId).subscribe(response => {
          console.log(response)
          this.intercom.setClaimant(response.data.claimant_name.first_name + ' ' + response.data.claimant_name.last_name);
          this.cookieService.set('claimDetails', response.data.claimant_name.first_name + ' ' + response.data.claimant_name.last_name)
          this.intercom.setClaimNumber(response.data.claim_details.claim_number);
          this.cookieService.set('claimNumber', response.data.claim_details.claim_number)
          this.intercom.setBillableItem(response.data.exam_procedure_name);
          this.cookieService.set('billableItem', response.data.exam_procedure_name)
          this.appointmentId = response.data.appointments.id;
          if (response.data.appointments.examiner_id) {
            this.procedureTypeStatus[1].url = "/history/" + response.data.appointments.examiner_id;
            this.procedureTypeStatus[0].url = "/correspondence/" + response.data.appointments.examiner_id
          }

          this.progressStatus = response.data.progress_status
          // this.notesForm.patchValue({
          //   exam_notes: response.data.exam_notes,
          // })
          if (response.data.procedure_type == "Evaluation" || response.data.procedure_type == "Reevaluation") {
            this.isDisplayStatus.isExaminar = true;
            this.isDisplayStatus.isDeposition = false;
            this.claimService.seedData('examination_status').subscribe(curres => {
              this.examinationStatus = curres.data;
            });
          } else if (response.data.procedure_type == "Deposition") {
            this.isDisplayStatus.isExaminar = false;
            this.isDisplayStatus.isDeposition = true;
            this.claimService.seedData('deposition_status').subscribe(curres => {
              this.examinationStatus = curres.data;
            })
          } else if (response.data.procedure_type == "Supplemental") {
            this.examinerService.seedData('cancel_supplemental_status').subscribe(supp => {
              this.cancelSupplemental = supp.data
            })
          } else if (response.data.procedure_type == "IMERecords") {
            this.examinerService.seedData('ime_records_status').subscribe(supp => {
              this.cancelSupplemental = supp.data
            })

          }

          this.procedureTypeList = [];
          this.procedureTypeStatus.map(pro => {
            if (response.data.procedure_type == "Evaluation" || response.data.procedure_type == "Reevaluation") {
              // if (!(response.data.exam_procedure_type == "IMERECS")) {
              this.isDisplayStatus.status = true;
              this.isDisplayStatus.isDeposition = false;
              this.isDisplayStatus.name = "Examination";
              if (pro.for.includes('E')) {
                this.procedureTypeList.push(pro);
              }
              // }
            }
            if (response.data.procedure_type == "Supplemental" || response.data.procedure_type == "IMERecords") {
              this.isDisplayStatus.status = true;
              this.isDisplayStatus.name = response.data.procedure_type == "Supplemental" ? "Supplemental" : '';
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

          this.examinationStatusForm.patchValue(response.data.appointments);
          this.examinationStatusForm.patchValue({ notes: '', examination_notes: '' });
          if (moment(response.data.appointments.appointment_scheduled_date_time) < moment()) {
            this.appointmentStatus = true;
          } else {
            this.appointmentStatus = false;
          }
          this.claimant_name = response.data.claimant_name.first_name + " " + response.data.claimant_name.middle_name + " " + response.data.claimant_name.last_name;
          this.examiner_id = response.data.appointments.examiner_id;
          this.examinationDetails = response['data'];
          this.getDocumentData();
          if (bills.data.exam_type_name != response.data.exam_type_name) {
            this.isExamTypeChanged = true;
          }
          this.examinationDetails.exam_type_code = bills.data.exam_type_code;
          this.examinationDetails.exam_type_name = bills.data.exam_type_name;

          // if (this.examinationDetails.procedure_type == "Supplemental") {
          //   let ind = this.documentList.findIndex(element => element.id == 5);
          //   this.documentList.splice(ind, 1);
          // }
          if (this.examinationDetails.procedure_type == "Deposition") {
            let documentListArr = [6, 8, 9];
            let documentList: any = this.documentList;
            this.documentList = []
            documentList.map(data => {
              if (documentListArr.includes(data.id)) {
                this.documentList.push(data);
              }
            })
          }
        }, error => {
          console.log(error)
          this.dataSource = new MatTableDataSource([]);
        })
      })
    });
  }
  claimant_name = "";
  examinationStatusForm: FormGroup;
  loadForms() {

  }
  isAddDoc = false;
  isEditDocument = false;
  editedDocumentIndex = null;
  editDocumentDeclared(documents?, index?) {
    this.isEditDocument = true;
    if (documents) {
      this.editedDocumentIndex = index;
      this.documentDeclared = documents;
    }
    console.log(this.documentDeclared, documents, this.isEditDocument)
  }
  documentDeclared = { id: null, agent_type: "", no_of_pages_declared: "", date_received: "" }
  createDocumentsDeclared() {
    if (this.documentDeclared.id) {
      this.claimService.createDeclaredDocument(this.documentDeclared, this.claim_id, this.billableId).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        this.isEditDocument = false;
        this.editedDocumentIndex = null;
        this.documentDeclared = { id: null, agent_type: "", no_of_pages_declared: "", date_received: "" };
        this.isAddDoc = false;
        this.getDocumentDeclareData();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.createDeclaredDocument(this.documentDeclared, this.claim_id, this.billableId).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success")
        this.getDocumentDeclareData();
        this.isEditDocument = false;
        this.editedDocumentIndex = null;
        this.isAddDoc = false;
        this.documentDeclared = { id: null, agent_type: "", no_of_pages_declared: "", date_received: "" }
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }
  removeDocument(group, i) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { title: 'Pages Declared', address: true, name: "remove" }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result['data']) {
        this.claimService.removeDeclaredDocument(group.value.id).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success")
          const control = this.docDeclearTable.get('tableRows') as FormArray;
          control.removeAt(i);
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    });

  }
  cancelDoc() {
    this.isEditDocument = false;
    this.editedDocumentIndex = null;
  }
  appointmentId: any;
  openCalendar() {

    if (this.examinerId == null) {
      this.alertService.openSnackBar("Examiner is not available for this event!", "error");
      return;
    }
    if (this.billableData.appointment.appointment_scheduled_date_time == null) {
      this.alertService.openSnackBar("Examination Date & Time is not available!", "error");
      return
    }
    this.router.navigate([this.router.url + "/appointment", this.examinerId, this.appointmentId]);
  }
  changeDateType(date) {
    if (date) {
      let timezone = moment.tz.guess();
      return this.appointment_scheduled_date_time = moment(date.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
    } else {
      return this.appointment_scheduled_date_time = null
    }
  }
  service_location_name: any;
  serviceLocationChange(value) {
    if (value == 0) {
      this.service_location_name = "0";
      return;
    }
    this.examinarAddress.map(address => {
      if (address.address_id == value) {
        this.service_location_name = address.service_location_name;
      }
    })

  }

  ngOnInit() {
    this.billable_item = this.formBuilder.group({
      id: [{ value: '', disable: true }],
      claim_id: [this.claim_id],
      documents_received: this.formBuilder.array([]),
      exam_type: this.formBuilder.group({
        exam_procedure_type_id: [{ value: '', disable: true }, Validators.required],
        // modifier_id: [{ value: '', disable: true }],
        // is_psychiatric: [{ value: false, disable: true }],
        primary_language_spoken: [{ value: '', disabled: true }]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [{ value: '', disable: true }, Validators.required],
        appointment_scheduled_date_time: [{ value: '', disable: true }],
        duration: [{ value: '', disable: true }, Validators.compose([Validators.pattern('[0-9]+'), Validators.min(1), Validators.max(450)])],
        examiner_service_location_id: [{ value: null, disable: true }],
        is_virtual_location: [false],
        conference_url: [null],
        conference_phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [{ value: '', disable: true }],
        caller_name: [{ value: '', disable: true }],
        call_date: [{ value: '', disable: true }],
        call_type: [{ value: '', disable: true }],
        call_type_detail: [{ value: '', disable: true }],
        notes: [{ value: '', disable: true }],
        caller_phone: [{ value: '', disable: true }, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        caller_email: [{ value: null, disable: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
        caller_fax: [{ value: '', disable: true }, Validators.compose([Validators.pattern('[0-9]+')])]
      }),

    })
    this.billable_item.get(["appointment", "conference_phone"]).valueChanges.subscribe(res => {
      if (this.billable_item.get(["appointment", "conference_phone"]).value && this.billable_item.get(["appointment", "conference_phone"]).valid) {
        this.billable_item.get(["appointment", "phone_ext"]).enable();
      } else {
        this.billable_item.get(["appointment", "phone_ext"]).disable();
      }
    })
    this.billable_item.get(["intake_call", "caller_phone"]).valueChanges.subscribe(res => {
      if (this.billable_item.get(["intake_call", "caller_phone"]).value && this.billable_item.get(["intake_call", "caller_phone"]).valid) {
        this.billable_item.get(["intake_call", "phone_ext"]).enable();
      } else {
        this.billable_item.get(["intake_call", "phone_ext"]).disable();
      }
    })
    this.claimService.seedData("supplemental_item_received").subscribe(supp => {
      this.supplementalItems = supp.data;
      this.supplementalOtherIndex = this.supplementalItems.findIndex(docs => docs.name.toLowerCase() == 'other')
      const controlArray = this.supplementalItems.map(c => new FormControl(false));
      this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
      this.billable_item.get('documents_received').disable();
    })

    this.notesForm = this.formBuilder.group({
      notes: [null],
      bill_item_id: [this.billableId]
    })
    this.examinationStatusForm = this.formBuilder.group({
      id: "",
      examination_status: [{ value: "", disabled: true }, Validators.required],
      examination_notes: [{ value: "", disabled: true }],
      notes: ['']
    })
    this.examinerService.seedData('document_category').subscribe(type => {
      this.documentList = type['data']
    })
    this.billable_item.disable();

    this.docDeclearTable = this.formBuilder.group({
      tableRows: this.formBuilder.array([])
    });
  }

  initiateForm(): FormGroup {
    return this.formBuilder.group({
      id: [],
      no_of_pages_declared: ['', Validators.required],
      agent_type: ['', [Validators.required]],
      date_received: ["", [Validators.required]],
      isEditable: [true]
    });
  }

  get getFormControls() {
    const control = this.docDeclearTable.get('tableRows') as FormArray;
    return control;
  }

  addRow() {
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
    const control = this.docDeclearTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number, group) {
    if (group.value.id) {
      this.removeDocument(group, index);
      return
    }
    const control = this.docDeclearTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup, i) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup, i) {
    Object.keys(group.controls).forEach((key) => {
      if (group.get(key).value && typeof (group.get(key).value) == 'string')
        group.get(key).setValue(group.get(key).value.trim())
    });
    console.log(group.value)
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    const dialogRef = this.dialog.open(AlertDialogueComponent, {
      width: '500px',
      data: { title: 'Page Declared', message: "Is this the correct number of pages declared? <br/><b>*The excess pages will be added to the bill as a line item</b>.", proceed: true, no: true, type: "info", info: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
       // group.get('date_received').patchValue(moment((group.value.date_received).format("MM-DD-YYYY")));
        let data = { agent_type: group.value.agent_type, no_of_pages_declared: group.value.no_of_pages_declared };
        data['date_received'] = moment(group.value.date_received).format("LL");
        this.claimService.createDeclaredDocument(data, this.claim_id, this.billableId).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success");
          this.documentsDeclared[i] = res.data
          group.get('isEditable').setValue(false);
          group.get('id').setValue(res.data.id);

        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      } else {
        return;
      }
    })
    return

  }

  cancelRow(group: FormGroup, i) {
    if (!group.value.id) {
      this.deleteRow(i, group);
      return
    }
    group.patchValue(this.documentsDeclared[i]);
    group.get('isEditable').setValue(false);
  }
  isExaminationStatusEdit = false;
  changeEditStatus() {
    this.examinationStatusForm.enable();
    this.isExaminationStatusEdit = true;
    if (this.billable_item.get(["appointment", "conference_phone"]).value && this.billable_item.get(["appointment", "conference_phone"]).valid) {
      this.billable_item.get(["appointment", "phone_ext"]).enable();
    } else {
      this.billable_item.get(["appointment", "phone_ext"]).disable();
    }
    if (this.billable_item.get(["intake_call", "caller_phone"]).value && this.billable_item.get(["intake_call", "caller_phone"]).valid) {
      this.billable_item.get(["intake_call", "phone_ext"]).enable();
    } else {
      this.billable_item.get(["intake_call", "phone_ext"]).disable();
    }
  }
  examinationStatusSubmit() {
    if (this.examinationStatusForm.invalid) {
      return;
    }
    if (this.examinationDetails.procedure_type == "Deposition") {
      if (this.examinationStatusForm.value.examination_status == 11) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Deposition', message: "This action will remove Examination Date & Time, Duration. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.billable_item.patchValue({
              appointment: { duration: "", appointment_scheduled_date_time: "" }
            })
            this.appointment_scheduled_date_time = null;
            this.updateExamStatus()
          } else {
            return;
          }
        })
        return
      }
    }
    if (this.examinationDetails.procedure_type == "Evaluation" || this.examinationDetails.procedure_type == "Reevaluation") {
      if (this.examinationStatusForm.value.examination_status == 1) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "This action will remove Examination Date & Time, Duration. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateExamStatus()
          } else {
            return;
          }
        })
        return
      }
      if (this.examinationStatusForm.value.examination_status == 10 && !this.examinationDetails.appointments.appointment_scheduled_date_time) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px', data: { title: "Examination", message: "Appointment is Not Scheduled", ok: true, no: false, type: "warning", warning: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          return

        })
        return
      }
      if (this.examinationStatusForm.value.examination_status == 10 && moment(this.examinationDetails.appointments.appointment_scheduled_date_time) >= moment()) {
        //this.alertService.openSnackBar('Future appointment status cannot be changed to ATTENDED.', 'error');
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px', data: { title: "Examination", message: "Future appointment status cannot be changed to ATTENDED.", ok: true, no: false, type: "warning", warning: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          return

        })
        return
      }
      if (this.examinationStatusForm.value.examination_status == 5 && this.examinationDetails.appointments.examination_status == 2) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘Rescheduled’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateExamStatus()
          } else {
            return;
          }
        })
        return
      }

      if (this.examinationStatusForm.value.examination_status == 6 && this.examinationDetails.appointments.examination_status == 2) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘Cancelled – send bill’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateExamStatus()
          } else {
            return;
          }
        })
        return
      }

      if (this.examinationStatusForm.value.examination_status == 7 && this.examinationDetails.appointments.examination_status == 2) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘Cancelled – no bill’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateExamStatus()
          } else {
            return;
          }
        })
        return
      }

      if (this.examinationStatusForm.value.examination_status == 8 && this.examinationDetails.appointments.examination_status == 2) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘No show’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateExamStatus()
          } else {
            return;
          }
        })
        return
      }
      if (this.examinationStatusForm.value.examination_status == 9 && this.examinationDetails.appointments.examination_status == 2) {
        this.alertService.openSnackBar('Please change the ‘Date & Time’ to current date', 'error');
        return
      }

    }
    this.updateExamStatus()
  }

  updateExamStatus() {
    this.examinationStatusForm.patchValue({ id: this.billableId, notes: this.examinationStatusForm.value.examination_notes.trim() })
    let data = this.examinationStatusForm.value
    data['appointment_id'] = this.appointmentId
    this.examinerService.updateExaminationStatus(data).subscribe(res => {
      this.examinationStatusForm.disable()
      this.isExaminationStatusEdit = false;
      this.alertService.openSnackBar(this.isDisplayStatus.name + ' details updated Successfully', "success");
      this.examinationStatus.map(data => {
        if (data.id == res.data.examination_status) {
          this.progressStatus.examination = data.examination_status
        }
      })
      this.examinationStatusForm.patchValue({ examination_status: res.data.examination_status, examination_notes: res.data.examination_notes })
      this.examinationDetails.appointments = { examination_notes: res.data.examination_notes, examination_status: res.data.examination_status };
      this.loadDatas();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  cancel() {
    this.examinationStatusForm.patchValue(this.examinationDetails.appointments);
    this.examinationStatusForm.patchValue({ notes: '', examination_notes: '' });
    this.examinationStatusForm.disable();
    this.isExaminationStatusEdit = false;
  }
  billableCancel() {
    this.billable_item.disable();
    this.billable_item.patchValue(this.billableData);
    if (this.billableData.appointment.is_virtual_location) {
      this.VserviceLocation();
      this.service_location_name = '0';
      this.billable_item.patchValue({
        appointment: {
          examiner_service_location_id: "0",
          is_virtual_location: true
        }
      })
    } else {
      this.serviceLocationChange(this.billableData.appointment.examiner_service_location_id);
    }
    this.isEditBillableItem = false;
    this.procuderalCodes.map(proc => {
      if (proc.exam_procedure_type_id == this.billable_item.get(['exam_type', 'exam_procedure_type_id']).value) {
        this.procedure_type(proc, true);
      }
    })
    if (this.billableData && this.billableData.documents_received && this.billable_item.get('documents_received')) {
      const controlArray = Array(this.supplementalItems.length).fill(false);
      this.billableData.documents_received.map((doc, index) => {
        let ind = this.supplementalItems.findIndex(docs => docs.name == doc);

        if (ind != -1) {
          controlArray[ind] = (true)
        }
      })
      this.billable_item.patchValue({ 'documents_received': this.formBuilder.array(controlArray) })
    }
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
    this.billable_item.patchValue({
      appointment: {
        examiner_service_location_id: null
      }
    })
    if (this.examinerId != examinar.id) {
      this.claimService.getExaminarAddress(examinar.id).subscribe(res => {
        this.examinarAddress = res['data'];
        res.data.map(address => {
          if (address.address_id == this.billableData.appointment.examiner_service_location_id) {
            this.service_location_name = address.service_location_name;
          }
        })
      })
    }
    if (this.billableData.isExaminerDisabled) {
      this.examinarAddress = [];
    }
    else {
      this.claimService.getExaminarAddress(examinar.id).subscribe(res => {
        this.examinarAddress = res['data'];
        res.data.map(address => {
          if (address.address_id == this.billableData.appointment.examiner_service_location_id) {
            this.service_location_name = address.service_location_name;
          }
        })
      })
    }
  }
  openPopup() {
    const dialogRef = this.dialog.open(AlertDialogueComponent, {
      width: '500px',
      data: { title: 'No values provided for appointment date & time and duration', message: "correspondence is not allowed", yes: false, ok: true, no: false, type: "info", info: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      return
    })
  }

  openPopupRegulation(title, value) {
    let data = this.userService.getRegulation(value)
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: title, regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
  clickNav(url) {
    if (url != "/billing") {
      this.router.navigate([this.router.url + url]);
      // if (url == "/correspondence") {
      //   if (this.examinationStatusForm.get('examination_status').value == 1) {
      //     this.openPopup();
      //   }
      //   if (this.billable_item.get(['appointment', "appointment_scheduled_date_time"]).value == "") {
      //     this.openPopup()
      //   }
      //   if (this.billable_item.get(['appointment', "duration"]).value == "") {
      //     this.openPopup();
      //   }

      //   // } else {
      //   //   this.router.navigate([this.router.url + url]);
      //   // }
      // } else {

      // }
    } else {
      this.billingNev();
    }
  }
  editBillable() {
    this.isEditBillableItem = true;
    this.billable_item.enable();
    if (this.billableData.isExaminerDisabled) {
      this.billable_item.get('appointment').get('examiner_id').enable();
    } else {
      this.billable_item.get('appointment').get('examiner_id').disable();
    }
    if (this.billable_item.value.appointment.appointment_scheduled_date_time) {
      this.billable_item.get('appointment').get('duration').setValidators([Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.min(1), Validators.max(450)])]);
    } else {
      this.billable_item.get('appointment').get('duration').setValidators([]);
    }
    this.billable_item.get('appointment').get('duration').updateValueAndValidity();
  }
  submitBillableItem() {
    this.todayDate.appointment = new Date();
    if (this.billable_item.value.appointment.appointment_scheduled_date_time) {
      this.billable_item.get('appointment').get('duration').setValidators([Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.min(1), Validators.max(450)])]);
    } else {
      this.billable_item.get('appointment').get('duration').setValidators([]);
    }

    this.billable_item.get('appointment').get('duration').updateValueAndValidity();

    if (this.isSuplimental) {
      this.billable_item.get('intake_call').get('call_date').setValidators([Validators.compose([Validators.required])]);
    } else {
      this.billable_item.get('intake_call').get('call_date').setValidators([]);
    }
    this.billable_item.get('intake_call').get('call_date').updateValueAndValidity();
    Object.keys(this.billable_item.controls).forEach((key) => {
      if (this.billable_item.get(key).value && typeof (this.billable_item.get(key).value) == 'string')
        this.billable_item.get(key).setValue(this.billable_item.get(key).value.trim());
      if (typeof (this.billable_item.get(key).value) == 'object') {
        let secondKey = this.billable_item.get(key).value as FormArray;
        Object.keys(secondKey).forEach((key1) => {
          if (this.billable_item.get(key).value[key1] && typeof (this.billable_item.get(key).value[key1]) == 'string')
            this.billable_item.get(key).get(key1).setValue(this.billable_item.get(key).get(key1).value.trim());
        })
      }
    });
    let billable_item_date: any;
    if (this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value) {
      billable_item_date = moment(this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value).add(1, 'minute')
      if (!(moment(billable_item_date).isSameOrAfter(moment.now()))) {
        return
      }
    }
    if (this.billable_item.invalid) {
      return;
    }
    if (this.examinationDetails.bill_id) {
      if (this.billableData.exam_type.exam_procedure_type_id != this.billable_item.value.exam_type.exam_procedure_type_id) {
        this.alertService.openSnackBar("Billing already created for this billable Item", "error");
        return;
      }
    }

    if (this.examinationDetails.procedure_type == "Deposition") {
      if (!this.billable_item.value.appointment.appointment_scheduled_date_time && this.billableData.appointment.appointment_scheduled_date_time && this.examinationStatusForm.value.examination_status != 11) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "This updates the Examination Status as 'Awaiting Deposition Date' & remove the Duration!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateBillableItem();
          } else {
            return;
          }
        })
        return
      }

      if (((this.billable_item.value.appointment.appointment_scheduled_date_time != this.billableData.appointment.appointment_scheduled_date_time) || (this.billable_item.value.appointment.duration != this.billableData.appointment.duration)) && (this.examinationStatusForm.getRawValue().examination_status != 12)) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "This updates the Examination Status as 'Awaiting Deposition'!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateBillableItem();
          } else {
            return;
          }
        })
        return
      }
    }

    if (this.examinationDetails.procedure_type == "Evaluation" || this.examinationDetails.procedure_type == "Reevaluation") {

      if (!this.billable_item.value.appointment.appointment_scheduled_date_time && this.billableData.appointment.appointment_scheduled_date_time && this.examinationStatusForm.value.examination_status != 1) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "This updates the Examination Status as 'No Date' & remove the Duration!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateBillableItem();
          } else {
            return;
          }
        })
        return
      }


      if (((this.billable_item.value.appointment.appointment_scheduled_date_time != this.billableData.appointment.appointment_scheduled_date_time) || (this.billable_item.value.appointment.duration != this.billableData.appointment.duration)) && (this.examinationStatusForm.getRawValue().examination_status != 2)) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Examination', message: "This updates the Examination Status as 'Not Confirmed'!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateBillableItem();
          } else {
            return;
          }
        })
        return
      }


    }
    this.updateBillableItem();
  }

  updateBillableItem() {

    let selectedOrderIds = []
    if (this.isSuplimental) {
      selectedOrderIds = this.billable_item.value.documents_received
        .map((v, i) => v ? this.supplementalItems[i].name : null)
        .filter(v => v !== null);
    }

    if (this.billable_item.value.appointment.is_virtual_location) {
      this.billable_item.patchValue({
        appointment: {
          examiner_service_location_id: null
        }
      })
    }
    this.billable_item.value.exam_type.is_psychiatric = this.isChecked;
    this.billable_item.value.appointment.duration = this.billable_item.value.appointment.duration == "" ? null : this.billable_item.value.appointment.duration;
    // this.billable_item.value.appointment.examiner_id = this.examinerId;
    this.billable_item.value.documents_received = selectedOrderIds;
    this.billable_item.value.id = this.examinationDetails.appointments.id
    this.examinerService.updateBillableItem(this.billableData.id, this.billable_item.value).subscribe(res => {
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
      this.tabChanges(this.tabIndexDetails)
    }, error => {
      this.documentsData = new MatTableDataSource([]);
    })
  }
  tabData = [];
  tabIndexDetails: any;
  tabChanges(event) {
    this.tabIndexDetails = event;
    this.filterValue = '';
    this.documentsData = new MatTableDataSource([])
    this.tabData = this.documentTabData ? this.documentTabData[event ? event.tab.textLabel.toLowerCase() : ''] : [];
    if (this.tabIndexDetails.index == 0) {
      if (this.isMobile) {
        this.columnName = ["", "Name"]
        this.displayedColumnsForDocuments = ['is_expand', 'file_name']
      }
      else {
        this.columnName = ["", "Name", "Uploaded On ", "Download On Demand Proof of Service", "Action"]
        this.displayedColumnsForDocuments = ['doc_image', 'file_name', 'updatedAt', 'pfs', 'action']
      }
    } else {
      if (this.isMobile) {
        this.columnName = ["", "Name"]
        this.displayedColumnsForDocuments = ['is_expand', 'file_name']
      }
      else {
        this.columnName = ["", "Name", "Uploaded On ", "Action"]
        this.displayedColumnsForDocuments = ['doc_image', 'file_name', 'updatedAt', 'action']
      }
    }

    this.documentsData = new MatTableDataSource(this.tabData);
    this.documentsData.sort = this.sort;
    this.documentsData.filterPredicate = function (data, filter: string): boolean {
      return data.file_name.toLowerCase().includes(filter) || (data.updatedAt && moment(data.updatedAt).format("MM-DD-YYYY hh:mm a").includes(filter));
    };
  }
  todayDate = { appointment: new Date(), intake: new Date() };
  minDate: any;
  pickerOpened(type) {
    if (type = 'intake') {
      let date = moment();
      this.minDate = date.subtract(1, 'year');
      this.todayDate.intake = new Date();
      this.todayDate.intake = new Date();
    } else {
      this.todayDate.appointment = new Date();
    }
  }
  VserviceLocation() {
    this.billable_item.patchValue({
      appointment: {
        is_virtual_location: true,
        examiner_service_location_id: "0"
      }
    })
  }
  changeExaminarAddress(address) {
    this.billable_item.patchValue({
      appointment: {
        is_virtual_location: false,
        examiner_service_location_id: address.address_id,
        conference_url: null,
        conference_phone: null,
        phone_ext: null
      }
    })
  }


  selectedFile: File;
  formData = new FormData()
  errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  addFile(event) {
    this.selectedFile = null;
    //let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'mp3']

    let fileTypes;
    if (this.documentType != 6) {
      fileTypes = ['pdf', 'doc', 'docx'];
    } else {
      fileTypes = ['pdf', 'doc', 'docx', 'mp3', 'wav', 'm4a', 'wma', 'dss', 'ds2', 'dct'];
    }

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.errors.file.isError = true;
        this.errors.file.error = "File size is too large";
        // this.alertService.openSnackBar("File size is too large", 'error');
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
    if (!this.documentType) {
      this.errors.doc_type.isError = true;
      this.errors.doc_type.error = "Please select Document type";
      // this.alertService.openSnackBar("Please select Document type", 'error');
      return;
    }
    if (!this.selectedFile) {
      this.errors.file.isError = true;
      this.errors.file.error = "Please select a file";
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
      this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  download(data) {
    saveAs(data.exam_report_file_url, data.file_name, '_self');
    this.alertService.openSnackBar("File downloaded successfully", "success");
  }
  downloadDocumet(element) {
    this.examinerService.downloadOndemandDocuments({ file_url: element.exam_report_file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.claimService.updateActionLog({ type: "Intake", "document_category_id": 6, "claim_id": this.claim_id, "billable_item_id": this.billableId, "documents_ids": [element.id] }, true).subscribe(log => {
        this.loadActivity();
      })
      saveAs(res.signed_file_url, element.file_name);
    })
  }

  applyFilter(filterValue: string) {
    this.documentsData.filter = filterValue.trim().toLowerCase();
  }

  deleteDocument(data) {
    this.openDialog('remove', data);
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
        this.alertService.openSnackBar("Form Generated Successfully", "success")
        this.formId = "";
        saveAs(res.data.exam_report_file_url, res.data.file_name, '_self');
      })
    } else {
      this.alertService.openSnackBar('Please select a form', 'error');
    }
  }
  // notesEdit() {
  //   this.notesForm.enable();
  //   this.isNotesEdit = true;
  // }
  // noteSubmit() {
  //   if (this.notesForm.invalid)
  //     return
  //   this.examinerService.postNotes(this.notesForm.value).subscribe(res => {
  //     this.alertService.openSnackBar("Notes Updated successfully", 'success');
  //     this.saveButtonStatus = false;
  //     this.notesForm.disable();
  //     this.isNotesEdit = false;
  //     this.loadDatas();
  //   }, error => {
  //     this.alertService.openSnackBar(error.error.message, 'error');
  //   })

  // }

  // noteCancel() {
  //   this.saveButtonStatus = false;
  //   this.isNotesEdit = false;
  //   this.notesForm.disable();
  //   this.notesForm.patchValue({ exam_notes: this.examinationDetails.exam_notes })
  // }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.examinerService.deleteDocument(data.id, true).subscribe(res => {
          let i = 0;
          this.tabData.map(dd => {
            if (dd.id == data.id) {
              this.tabData.splice(i, 1)
            }
            i = i + 1;
          })
          this.documentsData = new MatTableDataSource(this.tabData);
          this.getDocumentData();
          this.loadActivity();
          this.alertService.openSnackBar("File deleted successfully", 'success');
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
  examTypeChange(value) {
    this.procuderalCodes.map(res => {
      if (res.exam_procedure_type_id == value) {
        this.procedure_type(res);
      }
    })
  }
  isSuplimental = false;
  procedure_type(procuderalCode, status?) {
    if (procuderalCode.modifier)
      this.modifiers = procuderalCode.modifier;
    this.billable_item.patchValue({
      exam_type: { modifier_id: [] }
    })
    if (procuderalCode.exam_procedure_type.includes("SUPP")) {
      this.isSuplimental = true;
      if (status) {
        this.billable_item.patchValue({
          appointment: {
            appointment_scheduled_date_time: null,
            duration: null,
            examiner_service_location_id: null,
            is_virtual_location: false,
            conference_url: null,
            conference_phone: null,
            phone_ext: null
          }
        })
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billableData.documents_received.map((doc, index) => {
          let ind = this.supplementalItems.findIndex(docs => docs.name == doc);

          if (ind != -1) {
            controlArray[ind] = (true)
          }
        })
        let disableStatus = this.billable_item.get('documents_received').disabled
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
        if (disableStatus) {
          this.billable_item.get('documents_received').disable()
        }
      } else {
        this.billable_item.patchValue({
          appointment: {
            appointment_scheduled_date_time: null,
            duration: null,
            examiner_service_location_id: null,
            is_virtual_location: false,
            conference_url: null,
            conference_phone: null,
            phone_ext: null
          },
          intake_call: {
            caller_affiliation: null,
            caller_name: null,
            call_date: null,
            call_type: null,
            call_type_detail: null,
            notes: null,
            caller_phone: null,
            phone_ext: null,
            caller_email: null,
            caller_fax: null,
          }
        })
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
      }

      this.appointment_scheduled_date_time = null;
    } else {
      this.isSuplimental = false;
    }

    if (procuderalCode.exam_procedure_type_id == 28) {
      this.isSuplimental = true;
      if (status) {
        this.billable_item.patchValue({
          appointment: {
            appointment_scheduled_date_time: null,
            duration: null,
            examiner_service_location_id: null,
            is_virtual_location: false,
            conference_url: null,
            conference_phone: null,
            phone_ext: null
          }
        })
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billableData.documents_received.map((doc, index) => {
          let ind = this.supplementalItems.findIndex(docs => docs.name == doc);

          if (ind != -1) {
            controlArray[ind] = (true)
          }
        })
        let disableStatus = this.billable_item.get('documents_received').disabled
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
        if (disableStatus) {
          this.billable_item.get('documents_received').disable()
        }
      } else {
        this.billable_item.patchValue({
          appointment: {
            appointment_scheduled_date_time: null,
            duration: null,
            examiner_service_location_id: null,
            is_virtual_location: false,
            conference_url: null,
            conference_phone: null,
            phone_ext: null
          },
          intake_call: {
            caller_affiliation: null,
            caller_name: null,
            call_date: null,
            call_type: null,
            call_type_detail: null,
            notes: null,
            caller_phone: null,
            phone_ext: null,
            caller_email: null,
            caller_fax: null,
          }
        })
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
      }

      this.appointment_scheduled_date_time = null;
    }
  }

  docChange(e) {
    this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } };
    this.fileUpload.nativeElement.value = "";
    this.selectedFile = null;
    this.file = null;
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
    }
  }
  actionLogexpandId = "";
  openElement1(element) {
    if (this.isMobile) {
      if (this.actionLogexpandId && this.actionLogexpandId == element.id) {
        this.actionLogexpandId = null;
      } else {
        this.actionLogexpandId = element.id;
      }
    }
  }
  expandIdnote: any;
  openElement2(element) {
    if (this.isMobile) {
      this.expandIdnote = element;
    }
  }
  billingNev() {
    if (!this.examinationDetails.bill_id) {
      this.claimService.billCreate(this.claim_id, this.billableId).subscribe(bill => {
        this.router.navigateByUrl(this.router.url + '/billing/' + bill.data.bill_id)
      }, error => {
        this.logger.error(error)
      })
    } else {
      this.router.navigateByUrl(this.router.url + '/billing/' + this.examinationDetails.bill_id)
    }

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  noteError: boolean = false;
  notesSubmit(note) {
    if (this.notesForm.get('notes').value && typeof (this.notesForm.get('notes').value) == 'string')
      this.notesForm.get('notes').setValue(this.notesForm.get('notes').value.trim())
    this.notesForm.get('notes').setValidators(Validators.required)
    this.notesForm.get('notes').updateValueAndValidity();
    if (this.notesForm.invalid) {
      this.noteError = true;
      return;
    }

    this.notesForm.get('notes').setValidators([])
    this.notesForm.get('notes').updateValueAndValidity();
    if (note && this.notes.trim()) {
      this.noteError = false;
      let data = { notes: note.trim(), bill_item_id: this.billableId }
      this.examinerService.addNotes(data).subscribe(notes => {
        this.alertService.openSnackBar("Note added successfully", 'success');
        const tabledata = this.notesDataSource.data ? this.notesDataSource.data : this.notesDataSource.data = [];
        notes.data[0].create = notes.data[0].createdAt ? moment(notes.data[0].createdAt).format('MM-DD-yyyy hh:mm a') : null;
        notes.data[0].name = notes.data[0].user.first_name + ' ' + notes.data[0].user.last_name + ' ' + notes.data[0].user.suffix
        tabledata.unshift(notes.data[0]);
        this.notesDataSource = new MatTableDataSource(tabledata);
        this.notesDataSource.sort = this.sortNote;
        this.notesDataSource.paginator = this.paginatorNote;
        this.notesForm.reset()
      }, err => {
        this.alertService.openSnackBar(err.error.message, 'error');
      })
    } else {
      if (this.notes) {
        this.notes = this.notes.trim();
        this.notesForm.reset()
      }
      this.noteError = true;
    }

  }

  supplementalCheck() {
    if (!this.billable_item.get('documents_received').value[this.supplementalOtherIndex]) {
      this.billable_item.patchValue({
        intake_call: { notes: null }
      })
    }
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
