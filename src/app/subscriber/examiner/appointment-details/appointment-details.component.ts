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
import { map, shareReplay, startWith } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { PDFViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { EMAIL_REGEXP } from '../../../globals';
import { HttpEvent } from '@angular/common/http';
import { OnDemandService } from '../../service/on-demand.service';
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
      state('void', style({ height: '0px', minHeight: '0' })),
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
  @ViewChild('docSort', { static: false }) Docsort: MatSort;
  @ViewChild('MatSortActivity', { static: false }) sort: MatSort;
  @ViewChild('MatPaginatorActivity', { static: false }) paginator: MatPaginator;
  @ViewChild('MatSortNote', { static: false }) sortNote: MatSort;
  @ViewChild('MatPaginatorNote', { static: false }) paginatorNote: MatPaginator;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  @ViewChild('uploaderDoc', { static: false }) fileUploadDoc: ElementRef;
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
  procedureTypeStatus = [
    { name: "Correspondence", progress_name: 'correspondence_rec', icon: "far fa-folder-open", for: [], url: "", skip: true },
    { name: "Mailing", progress_name: 'correspondence', icon: "far fa-folder-open", for: ["E", "S", "D"], url: "/correspondence" },
    { name: "History", progress_name: 'history', icon: "fa fa-history", for: ["E"], url: "/history" },
    { name: "Records", progress_name: 'record', icon: "far fa-list-alt", for: ["E", "S"], url: "/records" },
    { name: "Examination Documents", progress_name: 'examination', icon: "far fa-edit", for: ["E"], url: "/examination" },
    { name: "Transcription & Compilation", progress_name: 'transcription', icon: "fa fa-tasks", for: ["E", "S", "D"], url: "/reports" },
    { name: "Billing", progress_name: 'billing', icon: "fa fa-usd", for: ["E", "S", "D"], url: "/billing", billing: true }];
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
  isIME: boolean = false;
  is_appointment_date_change: boolean = false;
  isPastDate: boolean = false;
  filteredExaminerList: any = [];
  examinerFilterCtrl = new FormControl();
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
    private userService: UserService,
    private onDemandService: OnDemandService
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
    //this.getDocumentDeclareData();
    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;
      this.examinerFilterCtrl.setValue(null);
    })

    this.filteredExaminerList = this.examinerFilterCtrl.valueChanges.pipe(
      startWith(null),
      map((searchKey) => {
        if (searchKey) {
          searchKey = searchKey.toLowerCase();
          return this.examinarList.filter((examiner) =>
            examiner.first_name.toLowerCase().indexOf(searchKey) > -1 ||
            examiner.middle_name.toLowerCase().indexOf(searchKey) > -1 ||
            examiner.last_name.toLowerCase().indexOf(searchKey) > -1 ||
            examiner.suffix.toLowerCase().indexOf(searchKey) > -1
          )
        }
        else {
          return this.examinarList;
        }
      })
    )
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
        this.columnName = ["", "Name", "Uploaded On ", "Download On Demand" + '\n' + "Proof of Service", "Action"]
        this.displayedColumnsForDocuments = ['doc_image', 'file_name', 'updatedAt', 'pfs', 'action']
      }

      if (res) {
        this.activityColumnName = ["", "Action"]
        this.activityDisplayedColumnsForDocuments = ['is_expand', 'action_details']
      } else {
        this.activityColumnName = ["", "Type", "Action", "Created By", "Created At", "Updated By", "Updated At"]
        this.activityDisplayedColumnsForDocuments = ["status", 'module', 'action_details', 'created_by', "createdAt", "updated_by", 'updatedAt']
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
    this.claimService.getDocumentsDeclared(this.claim_id, this.billableId).subscribe(res => {
      this.docDeclearTable = this.formBuilder.group({
        tableRows: this.formBuilder.array([])
      });
      if (res.data) {
        this.documentsDeclared = res.data;
        res.data.map((item, i) => {
          this.addRow(true);
          item.file_name = item.original_file_name ? item.original_file_name : item.file_name
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
      this.SubmittingParty = res.data;
    })

    this.claimService.getActivityLog(this.claim_id, this.billableId).subscribe(res => {
      res.data.map(user => {
        user.created_by = (user.created_by.first_name ? user.created_by.first_name : "") + " "
          + (user.created_by.last_name ? user.created_by.last_name :
            "") + (user.created_by.suffix ? (", " + user.created_by.suffix) : "")
      })
      this.activityLog = new MatTableDataSource(res.data);
      this.activityLog.sort = this.sort;
      this.activityLog.paginator = this.paginator;
    })
  }
  isExamTypeChanged = false;
  examinerId = null;
  examinerName = "";
  isFreeze: boolean = false;
  supplemenalStatus = { examination_status: null, examination_notes: "" }
  procedureType = "";
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


        if (this.billableData.isExaminerDisabled) {
          this.claimService.listExaminar(this.billableData.appointment.examiner_id).subscribe(res => {
            this.examinarList = res.data;
          })
        }

        if (this.billableData.appointment.examiner_service_location_id == null) {
          this.service_location_name = '0';
        }
        this.billableData.appointment.examiner_service_location = this.billableData.appointment.examiner_service_location_id;
        //check appoinment date past or future
        // if (this.billableData.appointment.appointment_scheduled_date_time && moment(this.billableData.appointment.appointment_scheduled_date_time).isBefore(moment())) {
        //   this.isPastDate = true
        // } else {
        //   this.isPastDate = false
        // }
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
        this.changeDateType(bills.data.appointment.appointment_scheduled_date_time)
        this.billable_item.patchValue(bills.data);
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
          // if (ind != -1) {
          controlArray[ind] = (true)
          // }
        })
        let disableStatus = this.billable_item.get('documents_received').disabled
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
        if (disableStatus) {
          this.billable_item.get('documents_received').disable()
        }

        // })
        this.examinerService.getAllExamination(this.claim_id, this.billableId).subscribe(response => {
          if (response && response.data && response.data.exam_type_code.includes('IME')) {
            this.isIME = true
          }
          this.isPastDate = response.data && response.data.is_past_date
          this.intercom.setClaimant(response.data.claimant_name.first_name + ' ' + response.data.claimant_name.last_name);
          this.cookieService.set('claimDetails', response.data.claimant_name.first_name + ' ' + response.data.claimant_name.last_name)
          this.intercom.setClaimNumber(response.data.claim_details.claim_number);
          this.cookieService.set('claimNumber', response.data.claim_details.claim_number)
          this.intercom.setBillableItem(response.data.exam_procedure_name);
          this.cookieService.set('billableItem', response.data.exam_procedure_name)
          this.appointmentId = response.data.appointments.id;
          if (response.data.appointments.examiner_id) {
            this.procedureTypeStatus[2].url = "/history/" + response.data.appointments.examiner_id;
            this.procedureTypeStatus[1].url = "/correspondence/" + response.data.appointments.examiner_id
          }

          this.progressStatus = response.data.progress_status
          // this.notesForm.patchValue({
          //   exam_notes: response.data.exam_notes,
          // })
          this.procedureType = response.data.procedure_type;
          if (response.data.procedure_type == "Evaluation" || response.data.procedure_type == "Reevaluation") {
            this.isDisplayStatus.isExaminar = true;
            this.isDisplayStatus.isDeposition = false;
            this.claimService.seedData('examination_status').subscribe(curres => {
              let status = []
              curres.data && curres.data.map(value => {
                if (this.isPastDate) {
                  if (value.show_status_for_pastdate_yn) {
                    status.push(value)
                  }
                } else {
                  status.push(value)
                }
              })
              this.examinationStatus = status;
            });
          } else if (response.data.procedure_type == "Deposition") {
            this.isDisplayStatus.isExaminar = false;
            this.isDisplayStatus.isDeposition = true;
            this.claimService.seedData('deposition_status').subscribe(curres => {
              let status = []
              curres.data && curres.data.map(value => {
                if (this.isPastDate) {
                  if (value.show_status_for_pastdate_yn) {
                    status.push(value)
                  }
                } else {
                  status.push(value)
                }
              })
              this.examinationStatus = status;
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
          this.procedureTypeList.push(this.procedureTypeStatus[0])
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
          this.supplemenalStatus = { examination_status: response.data.appointments.examination_status, examination_notes: response.data.appointments.examination_notes }
          this.examinationStatusForm.patchValue(response.data.appointments);
          this.examinationStatusForm.patchValue({ notes: '', examination_notes: '' });
          // if (moment(response.data.appointments.appointment_scheduled_date_time) < moment()) {
          //   this.appointmentStatus = true;
          // } else {
          //   this.appointmentStatus = false;
          // }
          this.claimant_name = response.data.claimant_name.first_name + " " + response.data.claimant_name.middle_name + " " + response.data.claimant_name.last_name;
          this.examiner_id = response.data.appointments.examiner_id;
          console.log(response)
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
            let documentListArr = [6, 8, 9, 12];
            let documentList: any = this.documentList;
            this.documentList = []
            documentList.map(data => {
              if (documentListArr.includes(data.id)) {
                this.documentList.push(data);
              }
            })
          }
          if (this.examinationDetails.procedure_type == "Supplemental") {
            let documentListArr = [4, 6, 8, 9, 12];
            let documentList: any = this.documentList;
            this.documentList = []
            documentList.map(data => {
              if (documentListArr.includes(data.id)) {
                this.documentList.push(data);
              }
            })
          }
          if (this.examinationDetails.procedure_type == "IMERecords") {
            let documentListArr = [4, 6, 8, 9, 12];
            let documentList: any = this.documentList;
            this.documentList = []
            documentList.map(data => {
              if (documentListArr.includes(data.id)) {
                this.documentList.push(data);
              }
            })
          }
        }, error => {
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
      if (result['data']) {
        this.claimService.removeDeclaredDocument(group.get('id').value, { claim_id: this.claim_id, billable_item_id: this.billableId }).subscribe(res => {
          this.alertService.openSnackBar('Documents declared details removed successfully!', "success")
          this.documentsDeclared.splice(i, 1)
          const control = this.docDeclearTable.get('tableRows') as FormArray;
          control.removeAt(i);
          this.loadActivity();
          this.getDocumentData();
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    });

  }
  openUploadPopUp(isMultiple, type, data?, callback?, fileSize?) {
    if (!this.documentType) {
      this.errors.doc_type.isError = true;
      this.errors.doc_type.error = "Please select Document type";
      // this.alertService.openSnackBar("Please select Document type", 'error');
      return;
    }
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { name: 'make this card the default card', address: true, isMultiple: isMultiple, fileType: type, fileSize: fileSize },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.selectedFile = []
        this.file = result.files[0].name;
        result.files.map(file => {
          this.selectedFile.push(file)
        })
        this.uploadFile();
      }
    })
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
  isAppointmentFuture = false;
  changeDateType(date) {
    if (date) {
      if (moment(date).isBefore(moment(new Date()))) {
        this.isAppointmentFuture = true;
        this.billable_item.get('appointment').get('examiner_service_location_id').setValidators([Validators.compose([Validators.required])]);
        this.billable_item.get('appointment').get('examiner_service_location_id').updateValueAndValidity();
      } else {
        this.isAppointmentFuture = true;
        this.billable_item.get('appointment').get('examiner_service_location_id').setValidators([]);
        this.billable_item.get('appointment').get('examiner_service_location_id').updateValueAndValidity();
      }
      let time = this.billable_item.get(["appointment", "duration"]).value ? this.billable_item.get(["appointment", "duration"]).value : 60
      this.billable_item.patchValue({
        appointment: { duration: time }
      })
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
  disableFields = {
    examination_status: false,
    notes: false,
    exam_procedure_type: false,
    examiner: false,
    date_and_time: false,
    duration: false,
    location: false,
    intake_caller: false,
    requesting_party: false,
    items_received: false,
    request_receipt_date: false,
    communication_type: false,
    intake_contact_phone: false,
    ext: false,
    intake_contact_fax: false,
    intake_contact_email: false,
    intake_notes: false,
  }
  disabledFields = {}
  // statusSaveDisable = false;
  getDisabledFields(from?) {
    this.claimService.getFormDisabled(this.claim_id, this.billableId, this.examinationDetails.appointments.examination_status).subscribe(res => {
      if (res && res.data) {

        // let data = {
        //   examination_status: res.data[0].examination_status,
        //   notes: false,
        //   exam_type: {
        //     exam_procedure_type_id: res.data[0].exam_procedure_type
        //   },
        //   appointment: {
        //     examiner_id: res.data[0].examiner,
        //     appointment_scheduled_date_time: res.data[0].date_and_time,
        //     duration: res.data[0].duration,
        //     examiner_service_location_id: res.data[0].location
        //   },
        //   documents_received: res.data[0].items_received,
        //   intake_call: {
        //     caller_name: res.data[0].intake_caller,
        //     caller_affiliation: res.data[0].requesting_party,
        //     call_date: res.data[0].request_receipt_date,
        //     call_type: res.data[0].communication_type,
        //     caller_phone: res.data[0].intake_contact_phone,
        //     phone_ext: res.data[0].ext,
        //     caller_fax: res.data[0].intake_contact_fax,
        //     caller_email: res.data[0].intake_contact_email,
        //     notes: res.data[0].intake_notes,
        //   }
        // }
        this.disabledFields = res.data[0];
        if (res.data.length > 0) {
          // if (!this.disabledFields['examination_status'] && !this.disabledFields['notes']) {
          //   this.saveButtonStatus = true
          // }
          if (from == 'status' || from == 'auto') {
            if (res.data[0].examination_status == false) {
              this.examinationStatusForm.get('examination_status').disable();
            }
            if (res.data[0].notes == false) {
              this.examinationStatusForm.get('examination_notes').disable();
            }
          }
          if (from == 'bill' || from == 'auto') {
            if (res.data[0].exam_procedure_type == false) {
              this.billable_item.get(['exam_type', 'exam_procedure_type_id']).disable();
            }
            if (res.data[0].examiner == false) {
              this.billable_item.get(['appointment', 'examiner_id']).disable();
            }
            if (res.data[0].date_and_time == false) {
              this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).disable();
            }
            if (res.data[0].duration == false) {
              this.billable_item.get(['appointment', 'duration']).disable();
              // if (res.data[0].duration == null) {
              //   this.billable_item.get(['appointment', 'duration']).enable();
              // }
            }
            if (res.data[0].location == false) {
              this.billable_item.get(['appointment', 'examiner_service_location_id']).disable();
            }
            if (res.data[0].intake_caller == false) {
              this.billable_item.get(['intake_call', 'caller_name']).disable();
            }
            if (res.data[0].requesting_party == false) {
              this.billable_item.get(['intake_call', 'caller_affiliation']).disable();
            }
            if (res.data[0].items_received == false) {
              this.billable_item.get('documents_received').disable();
            }
            if (res.data[0].request_receipt_date == false) {
              this.billable_item.get(['intake_call', 'call_date']).disable();
            }
            if (res.data[0].communication_type == false) {
              this.billable_item.get(['intake_call', 'call_type']).disable();
            }
            if (res.data[0].intake_contact_phone == false) {
              this.billable_item.get(['intake_call', 'caller_phone']).disable();
            }
            if (res.data[0].ext == false) {
              this.billable_item.get(['intake_call', 'phone_ext']).disable();
            }
            if (res.data[0].intake_contact_fax == false) {
              this.billable_item.get(['intake_call', 'caller_fax']).disable();
            }
            if (res.data[0].intake_contact_email == false) {
              this.billable_item.get(['intake_call', 'caller_email']).disable();
            }
            if (res.data[0].intake_notes == false) {
              this.billable_item.get(['intake_call', 'notes']).disable();
            }
          }
        }
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
        caller_email: [{ value: null, disable: true }, Validators.compose([Validators.email, Validators.pattern(EMAIL_REGEXP)])],
        caller_fax: [{ value: '', disable: true }, Validators.compose([Validators.pattern('[0-9]+')])]
      }),

    })
    this.examinationStatusForm = this.formBuilder.group({
      id: "",
      examination_status: [{ value: "", disabled: true }, Validators.required],
      examination_notes: [{ value: "", disabled: true }],
      notes: ['']
    })
    this.billable_item.get(["appointment", "conference_phone"]).valueChanges.subscribe(res => {
      if (this.billable_item.get(["appointment", "conference_phone"]).value && this.billable_item.get(["appointment", "conference_phone"]).valid) {
        this.billable_item.get(["appointment", "phone_ext"]).enable();
      } else {
        this.billable_item.get(["appointment", "phone_ext"]).reset();
        this.billable_item.get(["appointment", "phone_ext"]).disable();
      }
    })
    this.billable_item.get(["intake_call", "caller_phone"]).valueChanges.subscribe(res => {
      if (this.billable_item.get(["intake_call", "caller_phone"]).value && this.billable_item.get(["intake_call", "caller_phone"]).valid) {
        this.billable_item.get(["intake_call", "phone_ext"]).enable();
      } else {
        this.billable_item.get(["intake_call", "phone_ext"]).reset();
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
    this.examinerService.seedData('document_category').subscribe(type => {
      this.documentList = type['data']
    })
    this.billable_item.disable();

    this.docDeclearTable = this.formBuilder.group({
      tableRows: this.formBuilder.array([])
    });
    this.loadDatas();
    this.getDocumentDeclareData();
  }

  initiateForm(): FormGroup {
    return this.formBuilder.group({
      id: [],
      no_of_pages_declared: ['', Validators.compose([Validators.min(1), Validators.max(99999999)])],
      agent_type: [''],
      date_received: [""],
      file_name: [""],
      file: [""],
      document_id: [""],
      correspodence_received_file_url: [""],
      isEditable: [true],
      is_upload: [false]
    });
  }

  get getFormControls() {
    const control = this.docDeclearTable.get('tableRows') as FormArray;
    return control;
  }

  addRow(status?) {
    let newRowStatus = true
    for (var j in this.getFormControls.controls) {
      // if (this.getFormControls.controls[j].status == 'INVALID') {
      //   newRowStatus = false;
      // }
      if (!this.getFormControls.controls[j].get('no_of_pages_declared').value && !this.getFormControls.controls[j].get('agent_type').value &&
        !this.getFormControls.controls[j].get('date_received').value && !this.getFormControls.controls[j].get('file_name').value && !this.getFormControls.controls[j].get('id').value) {
        newRowStatus = false;
      }
    }

    if (!newRowStatus && !status) {
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

  formDataDoc = new FormData()
  doneRow(group: FormGroup, i) {
    this.formDataDoc = new FormData()
    Object.keys(group.controls).forEach((key) => {
      if (group.get(key).value && typeof (group.get(key).value) == 'string')
        group.get(key).setValue(group.get(key).value.trim())
    });
    if (group.value.no_of_pages_declared || group.value.agent_type || group.value.date_received) {
      group.get('no_of_pages_declared').setValidators([Validators.required, Validators.min(1), Validators.max(99999999)])
      group.get('agent_type').setValidators([Validators.required])
      group.get('date_received').setValidators([Validators.required])
      group.get('file_name').setValidators([])
      group.get('file_name').updateValueAndValidity();
      group.get('no_of_pages_declared').updateValueAndValidity();
      group.get('agent_type').updateValueAndValidity();
      group.get('date_received').updateValueAndValidity();
    } else {
      group.get('file_name').setValidators([Validators.required])
      group.get('file_name').updateValueAndValidity();

      group.get('no_of_pages_declared').setValidators([Validators.min(1), Validators.max(99999999)])
      group.get('agent_type').setValidators([])
      group.get('date_received').setValidators([])
      group.get('no_of_pages_declared').updateValueAndValidity();
      group.get('agent_type').updateValueAndValidity();
      group.get('date_received').updateValueAndValidity();
    }
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    let data = {
      id: group.value.id,
      agent_type: group.value.agent_type,
      no_of_pages_declared: group.value.no_of_pages_declared
    };
    data['date_received'] = group.value.date_received ? moment(group.value.date_received).format("LL") : '';
    this.formDataDoc.append('id', data.id ? data.id : '');
    this.formDataDoc.append('agent_type', data.agent_type ? data.agent_type : '');
    this.formDataDoc.append('no_of_pages_declared', data.no_of_pages_declared ? data.no_of_pages_declared : '');
    this.formDataDoc.append('date_received', data['date_received'] ? data['date_received'] : '');
    this.formDataDoc.append('document_id', group.value.document_id ? group.value.document_id : '');
    this.formDataDoc.append('file', group.value.file ? group.value.file : '');
    this.formDataDoc.append('is_upload', group.value.is_upload);
    if ((group.value.no_of_pages_declared || group.value.agent_type || group.value.date_received) && this.examinationDetails.procedure_type != "Deposition") {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: '500px',
        data: { title: 'Page Declared', message: "Is this the correct number of pages declared? <br/><b>*The excess pages will be added to the bill as a line item</b>.", proceed: true, no: true, type: "info", info: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          // group.get('date_received').patchValue(moment((group.value.date_received).format("MM-DD-YYYY")));
          this.claimService.createDeclaredDocument(this.formDataDoc, this.claim_id, this.billableId).subscribe((event: HttpEvent<any>) => {
            let progress = this.onDemandService.getProgress(event);
            if (progress == 0) {
              if (event['body']) {
                let message = group.value.id ? "Documents declared details updated successfully!" : "Documents declared details created successfully!"
                this.alertService.openSnackBar(message, "success");
                this.documentsDeclared[i] = event['body'].data
                event['body'].data.file_name = event['body'].data.original_file_name ? event['body'].data.original_file_name : event['body'].data.file_name;
                group.patchValue(event['body'].data)
                group.get('isEditable').setValue(false);
                group.get('id').setValue(event['body'].data.id);
                this.loadActivity();
                this.getDocumentData();
              }
            }
          }, error => {
            this.alertService.openSnackBar(error.error.message, 'error');
          })
        } else {
          return;
        }
      })
    } else {
      this.claimService.createDeclaredDocument(this.formDataDoc, this.claim_id, this.billableId).subscribe((event: HttpEvent<any>) => {
        let progress = this.onDemandService.getProgress(event);
        if (progress == 0) {
          if (event['body']) {
            let message = group.value.id ? "Documents declared details updated successfully!" : "Documents declared details created successfully!"
            this.alertService.openSnackBar(message, "success");
            this.documentsDeclared[i] = event['body'].data
            group.patchValue(event['body'].data)
            group.get('isEditable').setValue(false);
            group.get('id').setValue(event['body'].data.id);
            this.loadActivity();
            this.getDocumentData();
          }
        }
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
    return

  }



  errorsDoc = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  addFileDoc(event, group, i) {

    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { name: 'make this card the default card', address: true, isMultiple: false, fileType: ['.pdf', '.doc', '.docx'], fileSize: 30 },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        group.get('file_name').patchValue(null);
        group.get('file').patchValue(null);
        group.get('file_name').patchValue(result.files[0].name);
        group.get('file').patchValue(result.files[0]);
        group.get('is_upload').patchValue(true)
      }
    })


  }

  cancelRow(group: FormGroup, i) {
    if (!group.value.id) {
      this.deleteRow(i, group);
      return
    }
    group.patchValue(this.documentsDeclared[i]);
    group.get('isEditable').setValue(false);
  }

  downloadDocDeclare(group, i) {
    if (group.get('document_id').value)
      this.examinerService.downloadOndemandDocuments({ file_url: group.get('correspodence_received_file_url').value }).subscribe(res => {
        this.alertService.openSnackBar("File downloaded successfully", "success");
        // this.claimService.updateActionLog({ type: "Intake", "document_category_id": 6, "claim_id": this.claim_id, "billable_item_id": this.billableId, "documents_ids": [element.id] }, true).subscribe(log => {
        //   this.loadActivity();
        // })
        saveAs(res.signed_file_url, group.get('file_name').value);
      })
  }

  removeDocDeclare(group, i) {

    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: 'remove', address: true, title: group.get('file_name').value }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        if (group.get('document_id').value) {
          this.claimService.removeDocumentDeclared(group.get('id').value, group.get('document_id').value).subscribe(res => {
            group.get('file_name').patchValue(null);
            group.get('file').patchValue(null);
            group.get('document_id').patchValue(null);
            group.get('correspodence_received_file_url').patchValue(null);
            group.get('is_upload').patchValue(false);
            this.alertService.openSnackBar("File deleted successfully", 'success');
            this.getDocumentData();
            if (!group.get('no_of_pages_declared').value && !group.get('agent_type').value && !group.get('date_received').value) {
              this.getDocumentDeclareData()
            }
          }, error => {
            this.alertService.openSnackBar(error.error.message, 'error');
          })
        } else {
          group.get('file_name').patchValue(null);
          group.get('file').patchValue(null);
          group.get('document_id').patchValue(null);
          group.get('is_upload').patchValue(false);
          group.get('correspodence_received_file_url').patchValue(null);
        }

        if (!group.get('no_of_pages_declared').value && !group.get('agent_type').value && !group.get('date_received').value && !group.get('file_name').value) {
          if (group.get('id').value) {
            this.claimService.removeDeclaredDocument(group.get('id').value, { claim_id: this.claim_id, billable_item_id: this.billableId }).subscribe(res => {
              this.alertService.openSnackBar('Documents declared details removed successfully!', "success")
              this.documentsDeclared.splice(i, 1)
              const control = this.docDeclearTable.get('tableRows') as FormArray;
              control.removeAt(i);
              this.loadActivity();
              this.getDocumentData();
            }, error => {
              this.alertService.openSnackBar(error.error.message, 'error');
            })
            return
          }
          const control = this.docDeclearTable.get('tableRows') as FormArray;
          control.removeAt(i);
        }

      }
    })
  }

  isExaminationStatusEdit = false;
  changeEditStatus() {
    this.getDisabledFields('status');
    this.examinationStatusForm.enable();
    this.isExaminationStatusEdit = true;
    this.isEditBillableItem = false;
    this.billable_item.disable();
    this.changeDateType(this.billableData.appointment.appointment_scheduled_date_time)
    this.billable_item.patchValue(this.billableData);
    // this.billable_item.get('appointment').get('appointment_scheduled_date_time').patchValue(this.appointment_scheduled_date_time);
    // if (this.billable_item.get(["appointment", "conference_phone"]).value && this.billable_item.get(["appointment", "conference_phone"]).valid) {
    //   this.billable_item.get(["appointment", "phone_ext"]).enable();
    // } else {
    //   this.billable_item.get(["appointment", "phone_ext"]).disable();
    // }
    // if (this.billable_item.get(["intake_call", "caller_phone"]).value && this.billable_item.get(["intake_call", "caller_phone"]).valid) {
    //   this.billable_item.get(["intake_call", "phone_ext"]).enable();
    // } else {
    //   this.billable_item.get(["intake_call", "phone_ext"]).disable();
    // }
  }
  supplementalreopen(status?) {
    let notes = this.examinationStatusForm.value.examination_notes ? this.examinationStatusForm.value.examination_notes.trim() : "";
    notes = status ? notes : "";
    let id = status ? this.cancelSupplemental[0].id : null
    this.examinationStatusForm.patchValue({ id: this.billableId, notes: notes, examination_status: id })
    let data = this.examinationStatusForm.value
    data['appointment_id'] = this.appointmentId
    this.examinerService.updateExaminationStatus(data).subscribe(res => {
      this.examinationStatusForm.disable()
      this.isExaminationStatusEdit = false;
      this.supplemenalStatus = res.data;
      this.alertService.openSnackBar(res.message, "success");
      this.examinationStatusForm.patchValue({ examination_status: res.data.examination_status, examination_notes: res.data.examination_notes })
      this.examinationDetails.appointments = { examination_notes: res.data.examination_notes, examination_status: res.data.examination_status };
      this.loadDatas();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
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
      } else {
        if (!this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value) {
          const dialogRef = this.dialog.open(AlertDialogueComponent, {
            width: '500px', data: { title: "Deposition", message: "Please select appointment date and time", ok: true, no: false, type: "warning", warning: true }
          });
          dialogRef.afterClosed().subscribe(result => {
            return

          })
          return
        }
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
      if (this.examinationStatusForm.value.examination_status != 1) {
        if (!this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value) {
          const dialogRef = this.dialog.open(AlertDialogueComponent, {
            width: '500px', data: { title: "Examination", message: "Please select appointment date and time", ok: true, no: false, type: "warning", warning: true }
          });
          dialogRef.afterClosed().subscribe(result => {
            return
          })
          return
        }
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
      // if (this.examinationStatusForm.value.examination_status == 5 && this.examinationDetails.appointments.examination_status == 2) {
      //   const dialogRef = this.dialog.open(AlertDialogueComponent, {
      //     width: '500px',
      //     data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘Rescheduled’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
      //   });
      //   dialogRef.afterClosed().subscribe(result => {
      //     if (result.data) {
      //       this.updateExamStatus()
      //     } else {
      //       return;
      //     }
      //   })
      //   return
      // }

      // if (this.examinationStatusForm.value.examination_status == 6 && this.examinationDetails.appointments.examination_status == 2) {
      //   const dialogRef = this.dialog.open(AlertDialogueComponent, {
      //     width: '500px',
      //     data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘Cancelled – send bill’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
      //   });
      //   dialogRef.afterClosed().subscribe(result => {
      //     if (result.data) {
      //       this.updateExamStatus()
      //     } else {
      //       return;
      //     }
      //   })
      //   return
      // }

      // if (this.examinationStatusForm.value.examination_status == 7 && this.examinationDetails.appointments.examination_status == 2) {
      //   const dialogRef = this.dialog.open(AlertDialogueComponent, {
      //     width: '500px',
      //     data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘Cancelled – no bill’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
      //   });
      //   dialogRef.afterClosed().subscribe(result => {
      //     if (result.data) {
      //       this.updateExamStatus()
      //     } else {
      //       return;
      //     }
      //   })
      //   return
      // }

      // if (this.examinationStatusForm.value.examination_status == 8 && this.examinationDetails.appointments.examination_status == 2) {
      //   const dialogRef = this.dialog.open(AlertDialogueComponent, {
      //     width: '500px',
      //     data: { title: 'Examination', message: "Appointment is scheduled for 1st time but ‘No show’ is selected & System will freeze the appointment section. Would you like you save the status?", yes: true, no: true, type: "info", info: true }
      //   });
      //   dialogRef.afterClosed().subscribe(result => {
      //     if (result.data) {
      //       this.updateExamStatus()
      //     } else {
      //       return;
      //     }
      //   })
      //   return
      // }
      // if (this.examinationStatusForm.value.examination_status == 9 && this.examinationDetails.appointments.examination_status == 2) {
      //   this.alertService.openSnackBar('Please change the ‘Date & Time’ to current date', 'error');
      //   return
      // }

    }
    this.updateExamStatus()
  }

  updateExamStatus() {
    let notes = this.examinationStatusForm.value.examination_notes ? this.examinationStatusForm.value.examination_notes.trim() : "";
    this.examinationStatusForm.patchValue({ id: this.billableId, notes: notes })
    let data = this.examinationStatusForm.value
    data['appointment_id'] = this.appointmentId
    this.examinerService.updateExaminationStatus(data).subscribe(res => {
      this.isEditBillableItem = false;
      this.billable_item.disable();
      this.getDisabledFields('auto');
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
    this.changeDateType(this.billableData.appointment.appointment_scheduled_date_time)
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
    if (examinar.id) {
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
      data: { title: 'No values provided for appointment date & time and duration', message: "Mailing is not allowed", yes: false, ok: true, no: false, type: "info", info: true }
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
    this.examinationStatusForm.disable();
    this.isExaminationStatusEdit = false;
    this.getDisabledFields('bill');
    this.isEditBillableItem = true;
    this.billable_item.enable();
    let date = this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value;
    if (date) {
      if (moment(date).isBefore(moment(new Date()))) {
        this.isAppointmentFuture = true;
        this.billable_item.get('appointment').get('examiner_service_location_id').setValidators([Validators.compose([Validators.required])]);
        this.billable_item.get('appointment').get('examiner_service_location_id').updateValueAndValidity();
      } else {
        this.isAppointmentFuture = true;
        this.billable_item.get('appointment').get('examiner_service_location_id').setValidators([]);
        this.billable_item.get('appointment').get('examiner_service_location_id').updateValueAndValidity();
      }
    }
    this.examinationStatusForm.patchValue(this.examinationDetails.appointments);
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
    if (this.billable_item.get(["appointment", "conference_phone"]).value && this.billable_item.get(["appointment", "conference_phone"]).valid) {
      this.billable_item.get(["appointment", "phone_ext"]).enable();
    } else {
      this.billable_item.get(["appointment", "phone_ext"]).reset();
      this.billable_item.get(["appointment", "phone_ext"]).disable();
    }
    if (this.billable_item.get(["intake_call", "caller_phone"]).value && this.billable_item.get(["intake_call", "caller_phone"]).valid) {
      this.billable_item.get(["intake_call", "phone_ext"]).enable();
    } else {
      this.billable_item.get(["intake_call", "phone_ext"]).reset();
      this.billable_item.get(["intake_call", "phone_ext"]).disable();
    }
  }
  submitBillableItem() {
    if (moment(this.billable_item.get('appointment').get('appointment_scheduled_date_time').value).isBefore(moment(new Date())) && !this.billable_item.get('appointment').get('examiner_service_location_id').value) {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: "500px",
        data: {
          title: "Service Location",
          type: 'info',
          ok: true,
          message: 'Service Location is empty for the selected Past Appointment Date. Please select a location to proceed.'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        return
      });
    } else {
      this.billableItemSubmit()
    }
  }
  billableItemSubmit() {
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
    // if (this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value) {
    //   billable_item_date = moment(this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value).add(1, 'minute')
    //   if (!(moment(this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value).isSameOrAfter(moment().set('second', 0)))) {
    //     this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).setErrors({ 'incorrect': true })
    //     return
    //   }
    // }
    if (this.billable_item.invalid) {
      return;
    }
    if (moment(this.billableData.appointment.appointment_scheduled_date_time).isSame(moment(this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value))) {
      this.is_appointment_date_change = false;
    } else {
      this.is_appointment_date_change = true;
    }
    if (this.examinationDetails.bill_id) {
      if (this.billableData.exam_type.exam_procedure_type_id != this.billable_item.get(['exam_type', 'exam_procedure_type_id']).value) {
        this.alertService.openSnackBar("Billing already created for this billable Item", "error");
        return;
      }
    }
    if (this.examinationDetails.procedure_type == "Deposition") {
      if (!this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value && this.billableData.appointment.appointment_scheduled_date_time && this.examinationStatusForm.get('examination_status').value != 11) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          // change no deposition date
          //change examination to deposition
          data: { title: 'Deposition', message: "This updates the Deposition Status as 'No Date' & remove the Duration!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
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
      if (!this.billableData.appointment.appointment_scheduled_date_time) {
        if (((this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value != this.billableData.appointment.appointment_scheduled_date_time) || (this.billable_item.get(['appointment', 'duration']).value != this.billableData.appointment.duration)) && (this.examinationStatusForm.getRawValue().examination_status != 12)) {
          const dialogRef = this.dialog.open(AlertDialogueComponent, {
            width: '500px',
            data: { title: 'Deposition', message: "This updates the Deposition Status as 'Not Confirmed'!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
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

      if (moment(this.billableData.appointment.appointment_scheduled_date_time).isBefore(moment()) && moment(this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value).isAfter(moment())) {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Deposition', message: "This updates the Deposition Status as 'Not Confirmed'!.<br/>Do you want to proceed further?", yes: true, no: true, type: "info", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.updateBillableItem();
          } else {
            return;
          }
        })
        return;
      }
    }
    if (this.examinationDetails.procedure_type == "Evaluation" || this.examinationDetails.procedure_type == "Reevaluation") {

      if (!this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value && this.billableData.appointment.appointment_scheduled_date_time && this.examinationStatusForm.get('examination_status').value != 1) {
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
      if (!this.billableData.appointment.appointment_scheduled_date_time) {
        if (((this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value != this.billableData.appointment.appointment_scheduled_date_time) || (this.billable_item.get(['appointment', 'duration']).value != this.billableData.appointment.duration)) && (this.examinationStatusForm.getRawValue().examination_status != 2)) {
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

      if (moment(this.billableData.appointment.appointment_scheduled_date_time).isBefore(moment()) && moment(this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value).isAfter(moment())) {
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
        return;
      }
      if ((this.examinationStatusForm.getRawValue().examination_status != 1)) {
        if (!this.billable_item.get(['appointment', 'appointment_scheduled_date_time']).value) {
          const dialogRef = this.dialog.open(AlertDialogueComponent, {
            width: '500px',
            data: { title: 'Examination', message: "Please select appointment date and time", yes: false, no: false, ok: true, type: "warning", info: true }
          });
          dialogRef.afterClosed().subscribe(result => {
            return
          })
          return
        }
      }

    }
    this.updateBillableItem();
  }


  updateBillableItem() {
    if (this.billable_item.invalid) {
      return
    }
    let billableData = this.billable_item.getRawValue();
    let selectedOrderIds = []
    if (this.isSuplimental) {
      selectedOrderIds = billableData.documents_received
        .map((v, i) => v ? this.supplementalItems[i].name : null)
        .filter(v => v !== null);
    }
    if (billableData.appointment.is_virtual_location) {
      this.billable_item.patchValue({
        appointment: {
          examiner_service_location_id: null
        }
      })
      billableData.appointment.examiner_service_location_id = null
    }
    billableData.exam_type.is_psychiatric = this.isChecked;
    billableData.appointment.duration = billableData.appointment.duration == "" ? null : billableData.appointment.duration;
    // billableData.appointment.examiner_id = this.examinerId;
    billableData.documents_received = selectedOrderIds;
    billableData.id = this.examinationDetails.appointments.id
    billableData.intake_call.call_date = this.billable_item.get(['intake_call', 'call_date']).value ? moment(this.billable_item.get(['intake_call', 'call_date']).value).format("MM-DD-YYYY") : null;
    billableData.documents_received = selectedOrderIds;
    billableData['is_appointment_date_change'] = this.is_appointment_date_change;
    billableData['claimant_id'] = this.billableData.claimant_id;
    // return
    this.examinerService.updateBillableItem(this.billableData.id, billableData).subscribe(res => {
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
    this.tabData = this.documentTabData ? this.documentTabData[event ? (event.tab.textLabel ? event.tab.textLabel.toLowerCase() : "") : ''] : [];
    if (this.tabIndexDetails.index == 1) {
      if (this.isMobile) {
        this.columnName = ["", "Name"]
        this.displayedColumnsForDocuments = ['is_expand', 'file_name']
      }
      else {
        this.columnName = ["", "Name", "Uploaded On ", "Download On Demand" + '\n' + "Proof of Service", "Action"]
        this.displayedColumnsForDocuments = ['doc_image', 'file_name', 'updatedAt', 'pfs', 'action']
      }
    } else if (this.tabIndexDetails.index == 6) { // billing Tab
      if (this.isMobile) {
        this.columnName = ["", "Name"]
        this.displayedColumnsForDocuments = ['is_expand', 'file_name']
      }
      else {
        this.columnName = ["", "Name", "Submission", "Type", "Download Sent Documents", "Download Proof of Service"]
        this.displayedColumnsForDocuments = ['doc_image', 'file_name', 'bill_submission_type', 'type', 'send', 'pfs']
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
    this.documentsData.sort = this.Docsort;
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
      let date = new Date();
      date.setSeconds(0);
      this.todayDate.appointment = date;
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


  selectedFile = [];
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
    this.selectedFile.map(file => {
      this.formData.append('file', file);
    })
    this.formData.append('document_category_id', this.documentType);
    this.formData.append('claim_id', this.claim_id);
    this.formData.append('bill_item_id', this.billableId.toString());
    if (this.documentType == 12) {
      this.formDataDoc = new FormData();
      this.formDataDoc.append('id', '');
      this.formDataDoc.append('agent_type', '');
      this.formDataDoc.append('no_of_pages_declared', '');
      this.formDataDoc.append('date_received', '');
      this.selectedFile.map(file => {
        this.formDataDoc.append('file', file);
      })
      this.formDataDoc.append('is_upload', 'true');
      this.claimService.createDeclaredDocument(this.formDataDoc, this.claim_id, this.billableId).subscribe((event: HttpEvent<any>) => {
        let progress = this.onDemandService.getProgress(event);
        if (progress == 0) {
          if (event['body']) {
            this.selectedFile = [];
            // this.fileUpload.nativeElement.value = "";
            this.documentType = null;
            this.formData = new FormData();
            this.file = "";
            this.getDocumentData();
            this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
            this.alertService.openSnackBar("File added successfully", 'success');
            this.getDocumentDeclareData();
          }
        }
      }, error => {
        //this.fileUpload.nativeElement.value = "";
        this.selectedFile = [];
        this.alertService.openSnackBar(error.error.message, 'error');
      })
      return;
    }
    this.examinerService.postDocument(this.formData).subscribe((event: HttpEvent<any>) => {
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          this.selectedFile = null;
          // this.fileUpload.nativeElement.value = "";
          this.documentType = null;
          this.formData = new FormData();
          this.file = "";
          this.getDocumentData();
          this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
          this.alertService.openSnackBar("File added successfully", 'success');
        }
      }
    }, error => {
      //this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
    })
  }

  download(data) {
    saveAs(data.exam_report_file_url, data.file_name, '_self');
    this.alertService.openSnackBar("File downloaded successfully", "success");
  }
  // openPDF(element) {
  //   // return
  //   this.examinerService.downloadOndemandDocuments({ document_id: element.id, file_url: element.exam_report_file_url }).subscribe(res => {
  //     const file_name = element.original_file_name && element.original_file_name != '' ? element.original_file_name : element.file_name;
  //     const dialogRef = this.dialog.open(PDFViewerComponent, {
  //       width: '1000px',
  //       data: { pdf: res.signed_file_url, name: file_name },
  //       panelClass: 'pdf-viewer',
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       return
  //     })
  //   })
  // }
  downloadDocumet(element) {
    this.examinerService.downloadOndemandDocuments({ file_url: element.exam_report_file_url }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      this.claimService.updateActionLog({ type: "Intake", "document_category_id": 6, "claim_id": this.claim_id, "billable_item_id": this.billableId, "documents_ids": [element.id] }, true).subscribe(log => {
        this.loadActivity();
      })
      saveAs(res.signed_file_url, element.file_name);
    })
  }

  downloadDocumetSend(element) {
    this.examinerService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
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
        if (data.documents_declared_id) {
          this.claimService.removeDocumentDeclared(data.documents_declared_id, data.id).subscribe(res => {
            let i = 0;
            this.tabData.map(dd => {
              if (dd.id == data.id) {
                this.tabData.splice(i, 1)
              }
              i = i + 1;
            })
            this.documentsData = new MatTableDataSource(this.tabData);
            this.documentsData.sort = this.Docsort;
            this.documentsData.paginator = this.paginator;
            this.getDocumentData();
            this.loadActivity();
            this.getDocumentDeclareData()
            this.alertService.openSnackBar("File deleted successfully", 'success');
          }, error => {
            this.alertService.openSnackBar(error.error.message, 'error');
          })
        } else {
          this.examinerService.deleteDocument(data.id, true).subscribe(res => {
            let i = 0;
            this.tabData.map(dd => {
              if (dd.id == data.id) {
                this.tabData.splice(i, 1)
              }
              i = i + 1;
            })
            this.documentsData = new MatTableDataSource(this.tabData);
            this.documentsData.sort = this.Docsort;
            this.documentsData.paginator = this.paginator;
            this.getDocumentData();
            this.loadActivity();
            this.alertService.openSnackBar("File deleted successfully", 'success');
          }, error => {
            this.alertService.openSnackBar(error.error.message, 'error');
          })
        }
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
    // this.fileUpload.nativeElement.value = "";
    this.selectedFile = null;
    this.file = null;
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == (element.id ? element.id : element.document_id)) {
        this.expandId = null;
      } else {
        this.expandId = (element.id ? element.id : element.document_id);
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
