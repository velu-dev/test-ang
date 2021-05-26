import { Component, OnInit, ViewChild, ElementRef, Input, Optional, Inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap, shareReplay } from 'rxjs/operators';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NativeDateAdapter, DateAdapter,
  MAT_DATE_FORMATS,
  MatDialog,
  MatStepper,
  MAT_DATE_LOCALE,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent
} from '@angular/material';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';
import { DialogueComponent, DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventEmitter } from 'protractor';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { saveAs } from 'file-saver';
import { DayTable } from '@fullcalendar/core';
import { IntercomService } from 'src/app/services/intercom.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
export const PICK_FORMATS = {
  // parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  // display: {
  //   dateInput: 'input',
  //   monthYearLabel: { year: 'numeric', month: 'short' },
  //   dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  //   monthYearA11yLabel: { year: 'numeric', month: 'long' }
  // }
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
export interface Claimant {
  last_name: string;
  first_name: string;
  middle_name: string;
}

export interface PeriodicElement {
  doc_image: string;
  doc_name: string;
  date: Date;
  action: string;
}
export const MY_CUSTOM_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'MM-DD-YYYY hh:mm A Z',
  datePickerInput: 'MM-DD-YYYY hh:mm A Z',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};


export interface claimant1 {
  body_part_id: string,
  date_of_injury: string,
  continuous_trauma: boolean,
  continuous_trauma_start_date: string,
  continuous_trauma_end_date: string,
  note: string
}
export const _filter = (opt: any[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.company_name.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss'],
  providers: [
    // { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },

  ]
})
export class NewClaimComponent implements OnInit {

  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  displayedColumns_1 = ['doc_image', 'doc_name', 'date', 'action'];
  correspondenceSource: any = [];

  claimAdminList = [];
  today = new Date();
  isMobile = false;
  displayedColumns: string[] = ['body_part_id', 'date_of_injury', "action"];
  dataSource = new MatTableDataSource([]);
  step = 0;
  isLinear = false;
  isSubmit = false;
  emasSearchInput = new FormControl('', Validators.compose([Validators.maxLength(18), Validators.pattern('^[a-zA-Z]{3}[0-9]{1,15}$')]));
  searchInput = new FormControl('');
  filteredClaimant: any;
  claimForm: FormGroup;
  errorMessages = errors;
  claim: FormGroup;
  claimant: FormGroup;
  adjuster: FormGroup;
  employer: FormGroup;
  application_attorney: FormGroup;
  billable_item: FormGroup;
  defance_attorney: FormGroup;
  titleName = " Claimant";
  languageStatus = false;
  callerAffliation = [];
  injuryInfodata = []
  searchStatus: boolean = false;
  advanceSearch: any;
  injuryInfo = { id: null, body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
  claimantList = [];
  bodyParts = new FormControl();
  bodyPartsList = [];
  states = [];
  modifiers = [];
  roles = [];
  addressTypes = [];
  agentTypes = [];
  contactTypes = [];
  examTypes = [];
  languageList = [];
  objectTypes = [];
  procuderalCodes = [];
  roleLevels = [];
  specialityList = [];
  userAccountStatus = [];
  userRoles = [];
  claimList = [];
  tabIndex = 0;
  duration = [{ id: 20, value: "20" }, { id: 30, value: "30" }, { id: 45, value: "45" }, { id: 60, value: "60" }]
  ALL_SEED_DATA = ["state", "address_type", "body_part",
    "contact_type", "agent_type", "exam_type", "language", "modifier", "object_type", "role_level", "roles",
    "user_account_status", "user_roles", "procedural_codes"];
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  intakeComType: string;
  addNewClaimant: boolean;
  examinarList: any = [];
  claimInfo: any;
  isEdit: boolean = false;
  addressCtrl = new FormControl();
  address = [];
  examinarAddress: Observable<any[]>;
  claimId: any;
  claimantId: any;
  isClaimSubmited: boolean = false;
  isClaimantSubmited: boolean = false;
  isBillSubmited: boolean = false;
  examinerOptions: any = [];
  contactType: any;
  correspondForm: FormGroup;
  employerList = [];
  dataSource1 = [];
  deuDetails = [];
  empDetails = [];
  // filteredDeu: Observable<any[]>;
  filteredDeu: any = [];
  deuCtrl = new FormControl('', Validators.compose([Validators.pattern("^[a-zA-Z0-9-& ]{0,100}$")]));
  iseams_entry: boolean = false;
  role: string;
  date: any;
  primary_language_spoken: boolean = false;
  claimant_id: any;
  modifierList = [];
  isSearchClaimantError = false;
  private _filterAddress(value: string): any {
    const filterValue = value.toLowerCase();
    return this.examinerOptions.filter(option => option.street1.toLowerCase().includes(filterValue));
  }
  isRemoveSearchRemove = false;

  dateOfbirthEndValue = new Date();
  claimantChanges: boolean = false;
  claimChanges: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isNewClaim = true;
  fromClaimant = false;
  isClaimantFilled = false;
  isclaimantfill = false;
  isChecked = false;
  eamsRepresentatives = [];
  eamsClaimsAdministrator = [];
  claimantInfo: any;
  aattroneyGroupOptions: any;
  dattroneyGroupOptions: any;
  claimAdminGroupOptions: any = [];
  minimumDate = new Date(1900, 0, 1);
  currentTab = "";
  appointment_scheduled_date_time: any = null;
  supplementalItems: any;
  supplementalOtherIndex: number;
  pastTwoYearDate = moment().subtract(2, 'year');
  streetAddressList = [];
  streetEmpAddressList = [];
  isAddressError = false;
  isEmpAddressError = false;
  isAddressSearched = false;
  isEmpAddressSearched = false;
  regulation = regulation;
  minInjuryDate: any;
  isIME: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private _location: Location,
    private logger: NGXLogger,
    private intercom: IntercomService,
    private loader: NgxSpinnerService,
    private userService: UserService) {
    // this.logger.log(moment.)
    this.intercom.setClaimant(null);
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.claimService.getDeuDetails().subscribe(res => {
      this.deuDetails = res.data;
      this.filteredDeu = this.deuDetails;
      this.deuCtrl.valueChanges
        .pipe(
          debounceTime(300),
        ).subscribe(val => {
          if (this.deuCtrl.errors) {
            return
          } else {
            if (val) {
              this.filteredDeu = this._filteDeu(val)
            } else {
              this.filteredDeu = this.deuDetails.slice()
            }
          }
        })
    })
    this.logger.log(this.router.url)
    if (this.router.url === "/subscriber/claims/new-claim") {
      this.logger.log("dsdsdss")
      this.isRemoveSearchRemove = true;
      this.isNewClaim = true;
      this.addNewClaimant = true;
    }

    this.route.params.subscribe(param => {
      if (param.claimant_id) {
        this.claimant_id = param.claimant_id;
        this.fromClaimant = true;
        this.isNewClaim = false;

        this.claimService.getSingleClaimant(this.claimant_id).subscribe(claimant => {
          if (claimant.status) {
            this.intercom.setClaimant(claimant.data[0].first_name + ' ' + claimant.data[0].last_name);
            this.cookieService.set('claimDetails', claimant.data[0].first_name + ' ' + claimant.data[0].last_name)
            this.logger.log("claimant", claimant)
            this.claimantInfo = claimant.data[0]
            this.isRemoveSearchRemove = true;
            this.isClaimantCreated = true;
            this.searchStatus = false;
            this.isClaimantEdit = true;
            this.addNewClaimant = true;
            this.claimantDetails = { claimant_name: claimant.data[0].first_name + " " + claimant.data[0].last_name, date_of_birth: claimant.data[0].date_of_birth, phone_no_1: claimant.data[0].phone_no_1, phone_ext1: claimant.data[0].phone_ext1 };
            this.languageStatus = claimant['data'][0].certified_interpreter_required;
            this.primary_language_spoken = claimant.data[0].primary_language_spoken ? true : false;
            this.changeState(claimant.data[0].state, 'claimant', claimant.data[0].state_code);
            console.log("claimant state", claimant.data[0].state)
            this.claimant.patchValue(claimant.data[0]);
            this.claimant.patchValue({ ssn: "999999999" })
            this.isclaimantfill = true;
            this.isClaimantFilled = false;
            this.claim.patchValue({
              claim_details: {
                claimant_id: this.claimant_id,
                claimant_name: this.claimantDetails.claimant_name,
                date_of_birth: claimant['data'][0].date_of_birth,
                phone_no_1: claimant['data'][0].phone_no_1,
                phone_ext1: claimant['data'][0].phone_ext1
              }
            })
            this.billable_item.patchValue({
              claimant_id: this.claimant_id,
              claim_details: {
                exam_type: claimant['data'][0].exam_type,
                intake_call: claimant['data'][0].intake_calls,
                appointment: claimant['data'][0].appointments,
                claimant_name: this.claimantDetails.claimant_name,
                phone_no_1: claimant['data'][0].phone_no_1,
                phone_ext1: claimant['data'][0].phone_ext1,
                date_of_birth: claimant['data'][0].date_of_birth
              }
            })
            //this.stepper.next();
          }
        })
      }
      if (param.id) {
        this.claimId = param.id;
        this.isEdit = true;
        this.isClaimantEdit = true;
        this.claimService.getClaim(param.id).subscribe(res => {
          this.claimInfo = res.data;
          this.addNewClaimant = true;
          this.isClaimantCreated = true;
          this.isClaimCreated = true;
          this.languageStatus = res.data.claimant_details.certified_interpreter_required;
          this.changeState(res.data.claimant_details.state, 'claimant')
          this.claimant.patchValue(res.data.claimant_details)
          this.intercom.setClaimant(res.data.first_name + ' ' + res.data.last_name);
          this.cookieService.set('claimDetails', res.data.first_name + ' ' + res.data.last_name)
          this.claimantDetails = { claimant_name: res.data.first_name + " " + res.data.last_name, date_of_birth: res.data.date_of_birth, phone_no_1: res.data.phone_no_1, phone_ext1: res.data.phone_ext1 };
          this.claim.patchValue({
            claim_details: {
              claimant_name: this.claimantDetails.claimant_name
            }
          });
          this.claim.patchValue({
            claim_details: res.data.claim_details,
            InsuranceAdjuster: res.data.agent_details.InsuranceAdjuster,
            Employer: res.data.agent_details.Employer,
            ApplicantAttorney: res.data.agent_details.ApplicantAttorney,
            DefenseAttorney: res.data.agent_details.DefenseAttorney,
            DEU: res.data.agent_details.DEU,
          });
          this.claimAdminList = res.data.claims_administrator;
          this.injuryInfodata = res.data.claim_injuries;
          this.dataSource = new MatTableDataSource(this.injuryInfodata);
          if (res.data.intake_calls)
            this.contactType = res.data.intake_calls.call_type
          this.billable_item.patchValue({
            claim_id: res.data.claim_details.id,
            claimant_id: res.data.claimant_details.id,
            claim_details: {
              exam_type: res.data.exam_type,
              intake_call: res.data.intake_calls,
              appointment: res.data.appointments
            }
          })
          if (res.data.appointments.examiner_id != null) {
            let ex = { id: res.data.appointments.examiner_id, address_id: res.data.appointments.examiner_service_location_id }
            this.examinarChange(ex)
          }

        })
      }
    })
    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;
    });
    this.claimService.searchEAMSAdmin({ search: "" }).subscribe(res => {
      this.eamsClaimsAdministrator = res['data'];
      this.claimAdminList = [{ name: "Simplexam Addresses", data: this.eamsClaimsAdministrator }];
      this.claimAdminGroupOptions = [{ name: "Simplexam Addresses", data: this.eamsClaimsAdministrator }];
    });
    this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
      this.eamsRepresentatives = res.data;
      this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
      this.aattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
    });
    this.ALL_SEED_DATA.map(seed => {
      this.claimService.seedData(seed).subscribe(res => {
        switch (seed) {
          case "address_type":
            this.addressTypes = res.data;
            break;
          case "agent_type":
            this.callerAffliation = res.data;
            break;
          case "body_part":
            this.bodyPartsList = res.data;
            break;
          // case "eams_claims_administrator":
          //   this.eamsClaimsAdministrator = res.data;
          //   this.claimAdminList = [{ name: "Simplexam Addresses", data: this.eamsClaimsAdministrator }];
          //   this.claimAdminGroupOptions = this.claim.get(['InsuranceAdjuster', 'company_name'])!.valueChanges
          //     .pipe(
          //       startWith(''),
          //       map(value => this._filterAttroney(value, this.claimAdminList))
          //     );
          //   break;
          // case "eams_representatives":
          //   this.eamsRepresentatives = res.data;
          //   this.attroneylist = [{ name: "Simplexam Addresses", data: this.eamsRepresentatives }];
          //   this.dattroneyGroupOptions = this.claim.get(['ApplicantAttorney', 'company_name'])!.valueChanges
          //     .pipe(
          //       startWith(''),
          //       map(value => this._filterAttroney(value, this.attroneylist))
          //     );
          //   this.dattroneyGroupOptions = this.claim.get(['DefenseAttorney', 'company_name'])!.valueChanges
          //     .pipe(
          //       startWith(''),
          //       map(value => this._filterAttroney(value, this.attroneylist))
          //     );
          //   break;
          case "exam_type":
            this.examTypes = res.data;
            break;
          case "language":
            this.languageList = res.data;
            break;
          case "object_type":
            this.objectTypes = res.data;
            break;
          case "role_level":
            this.roleLevels = res.data;
            break;
          case "roles":
            this.roles = res.data;
            break;
          case "speciality":
            this.specialityList = res.data;
            break;
          case "state":
            this.states = res.data;
            break;
          case "user_account_status":
            this.userAccountStatus = res.data;
            break;
          case "user_roles":
            this.userRoles = res.data;
            break;
          default:
            break;
        }
      })
    })
    this.claimService.intakeCallList().subscribe(res => {
      this.contactTypes = res.data;
      if (this.contactType) {
        let type = this.contactTypes.find(element => element.id == this.contactType)
        // this.changeCommunicationType(type, 'auto');
      }
    })
    // this.searchInput.valueChanges.subscribe(res => {
    //   if (res == "") {
    //     this.filteredClaimant.data = []
    //   } else {
    //     this.claimService.searchClaimant({ basic_search: res, isadvanced: this.searchStatus }).subscribe(response => {
    //       this.filteredClaimant = response;
    //     })
    //   }
    // })
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(res => {
        if (this.searchInput.errors) {
          this.isSearchClaimantError = true;
        } else {
          this.isSearchClaimantError = false;
          if (res == '') {
            this.filteredClaimant.data = []
          } else {
            if (res) {
              let input = [];
              res.split("").map(inp => {
                if (inp == "'") {
                  input.push("'" + "'")
                } else {
                  input.push(inp)
                }
              });
              this.claimService.searchClaimant({ basic_search: input.join(""), isadvanced: this.searchStatus }).subscribe(response =>
                this.filteredClaimant = response)
            }
          }
        }
      });
    // this.filteredClaimant = this.searchInput.valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     switchMap(value => this.claimService.searchClaimant({ basic_search: value, isadvanced: this.searchStatus })));
  }
  private _filteDeu(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.deuDetails.filter(deu => this.matchValue(deu, filterValue));
  }
  matchValue(data, value) {
    return Object.keys(data).map((key) => {
      if (key == 'deu_office' || key == 'code') {
        return new RegExp(value, 'gi').test(data[key]);
      }
    }).some(result => result);
  }
  private _filteEmp(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.employerList.filter(emp => emp.name.toLowerCase().indexOf(filterValue) === 0);
  }
  isLoading = false;
  advanceTabChanged(event) {
    this.logger.log(event.index)
    this.tabIndex = event.index;
    this.searchStatus = false;
  }
  isClaimantEdit = false;
  selectClaimant(option) {
    console.log(option)
    this.isSearchClaimantError = false;
    this.claimant_id = option.id;
    this.isClaimantEdit = true;
    this.claimant.reset();
    this.claim.reset();
    this.addNewClaimant = true;
    this.languageStatus = option.certified_interpreter_required;
    this.isClaimantCreated = true;
    this.claimantDateOfBirth = option.date_of_birth;
    this.claimantDetails = { claimant_name: option.first_name + " " + option.last_name, date_of_birth: option.date_of_birth, phone_no_1: option.phone_no_1, phone_ext1: option.phone_ext1 };
    this.claim.patchValue({
      claim_details: {
        claimant_id: option.id,
        claimant_name: this.claimantDetails.claimant_name,
        date_of_birth: option.date_of_birth,
        phone_no_1: option.phone_no_1,
        phone_ext1: option.phone_ext1
      }
    });
    this.billable_item.patchValue({
      claimant_id: option.id,
      claim_details: {
        claimant_name: this.claimantDetails.claimant_name,
        phone_no_1: option.phone_no_1,
        phone_ext1: option.phone_ext1,
        date_of_birth: option.date_of_birth
      }
    })
    this.primary_language_spoken = option.primary_language_spoken ? true : false;
    this.changeState(option.state, 'claimant')
    // console.log("Option ", option.date_of_birth);
    option.date_of_birth = moment(option.date_of_birth);
    this.claimant.patchValue(option);
    this.filteredClaimant.data = [];

  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  service_lcation_name: any;
  serviceLocationChange(value) {
    this.service_lcation_name = value;
  }
  claimantState: any;
  caState: any;
  empState: any;
  aaState: any;
  daState: any;
  deuState: any;
  changeState(state, type, state_code?) {
    if (state_code) {
      if (type == 'claimant') {
        this.claimantState = state_code;
      } else if (type == 'ca') {
        this.caState = state_code;
      } else if (type == 'emp') {
        this.empState = state_code;
      } else if (type == 'aa') {
        this.aaState = state_code;
      } else if (type == 'da') {
        this.daState = state_code;
      } else if (type == 'deu') {
        this.deuState = state_code;
      }
      return;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        if (type == 'claimant') {
          this.claimantState = res.state_code;
        } else if (type == 'ca') {
          this.caState = res.state_code;
        } else if (type == 'emp') {
          this.empState = res.state_code;
        } else if (type == 'aa') {
          this.aaState = res.state_code;
        } else if (type == 'da') {
          this.daState = res.state_code;
        } else if (type == 'deu') {
          this.deuState = res.state_code;
        }
      }
    })
  }
  ngOnInit() {
    this.advanceSearch = this.formBuilder.group({
      first_name: [],
      last_name: [],
      date_of_birth: [],
      city: [],
      zip_code: []
    })
    this.claimant = this.formBuilder.group({
      last_name: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      middle_name: [''],
      salutation: [null, Validators.compose([Validators.maxLength(4)])],
      suffix: [null, Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      zip_code_plus_4: [null],
      date_of_birth: [null, Validators.required],
      gender: [null],
      email: ["", Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      handedness: [null],
      primary_language_not_english: [null],
      primary_language_spoken: [null],
      certified_interpreter_required: [null],
      ssn: ["999999999", Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      phone_no_1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext1: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      organization_id: [null],
      phone_no_2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext2: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      other_language: [null]
    })
    this.claim = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        id: [null],
        claimant_name: [{ value: "", disabled: true }],
        phone_no_1: [{ value: "", disabled: true }],
        phone_ext1: [{ value: "", disabled: true }],
        date_of_birth: [{ value: "", disabled: true }],
        wcab_number: [null, Validators.compose([Validators.maxLength(18), Validators.pattern('^[a-zA-Z]{3}[0-9]{1,15}$')])],
        claim_number: [null, Validators.compose([Validators.maxLength(50), Validators.pattern('^(?!.*[-_]})(?=.*[a-zA-Z0-9]$)[a-zA-Z0-9][a-zA-Z0-9-]*$')])],
        panel_number: [null, Validators.compose([Validators.pattern('[0-9]{0,9}'), Validators.maxLength(9)])],
        exam_type_id: [null, Validators.required],
        claimant_id: [null]
      }),
      claim_injuries: [null],
      InsuranceAdjuster: this.formBuilder.group({
        id: [null],
        payor_id: [null],
        company_name: [null, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
        name: [null],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        fax: [null],
        email: [null, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      }),
      Employer: this.formBuilder.group({
        id: [null],
        name: [null],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        fax: [null],
        email: [null, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],

      }),
      ApplicantAttorney: this.formBuilder.group({
        id: [null],
        company_name: [null, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
        name: [null],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        email: [null, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
        fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      }),
      DefenseAttorney: this.formBuilder.group({
        id: [null],
        company_name: [null, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
        name: [null],
        email: [null, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      }),
      DEU: this.formBuilder.group({
        id: [null],
        name: [null, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
        street1: [{ value: null, disabled: true }],
        street2: [{ value: null, disabled: true }],
        city: [{ value: null, disabled: true }],
        state: [{ value: null, disabled: true }],
        zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
        fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      })
    })
    this.billable_item = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        claimant_name: [{ value: "", disabled: true }],
        phone_no_1: [{ value: "", disabled: true }],
        phone_ext1: [{ value: "", disabled: true }],
        date_of_birth: [{ value: "", disabled: true }],
        claim_number: [{ value: "", disabled: true }],
        wcab_number: [{ value: "", disabled: true }],
        exam_type_id: [{ value: "", disabled: true }]
      }),
      claim_id: [null],
      claimant_id: [null],
      exam_type: this.formBuilder.group({
        exam_procedure_type_id: [null, Validators.required],
        // modifier_id: [null],
        // is_psychiatric: [null],
        primary_language_spoken: [null]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [null, Validators.compose([Validators.required])],
        appointment_scheduled_date_time: [null],
        duration: [null, Validators.compose([Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(450)])],
        examiner_service_location_id: [null],
        is_virtual_location: [false],
        conference_url: [null],
        conference_phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [null],
        caller_name: [null],
        call_date: [null],
        call_type: [null],
        call_type_detail: [null],
        notes: [null],
        caller_phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        caller_email: [null, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
        caller_fax: [null, Validators.compose([Validators.pattern('[0-9]+')])]
      })

    })
    this.claimService.seedData("supplemental_item_received").subscribe(supp => {
      this.supplementalItems = supp.data;
      this.supplementalOtherIndex = this.supplementalItems.findIndex(docs => docs.name.toLowerCase() == 'other')
      const controlArray = this.supplementalItems.map(c => new FormControl(false));
      this.billable_item.addControl('documents_received', new FormArray(controlArray))
    })
    this.claimant.get("phone_no_1").valueChanges.subscribe(res => {
      if (this.claimant.get("phone_no_1").value && this.claimant.get("phone_no_1").valid) {
        this.claimant.get("phone_ext1").enable();
      } else {
        this.claimant.get("phone_ext1").reset();
        this.claimant.get("phone_ext1").disable();
      }
    })
    this.claimant.get("phone_no_2").valueChanges.subscribe(res => {
      if (this.claimant.get("phone_no_2").value && this.claimant.get("phone_no_2").valid) {
        this.claimant.get("phone_ext2").enable();
      } else {
        this.claimant.get("phone_ext2").reset();
        this.claimant.get("phone_ext2").disable();
      }
    })
    this.claim.get(["InsuranceAdjuster", "phone"]).valueChanges.subscribe(res => {
      if (this.claim.get(["InsuranceAdjuster", "phone"]).value && this.claim.get(["InsuranceAdjuster", "phone"]).valid) {
        this.claim.get(["InsuranceAdjuster", "phone_ext"]).enable();
      } else {
        this.claim.get(["InsuranceAdjuster", "phone_ext"]).reset();
        this.claim.get(["InsuranceAdjuster", "phone_ext"]).disable();
      }
    })
    this.claim.get(["Employer", "phone"]).valueChanges.subscribe(res => {
      if (this.claim.get(["Employer", "phone"]).value && this.claim.get(["Employer", "phone"]).valid) {
        this.claim.get(["Employer", "phone_ext"]).enable();
      } else {
        this.claim.get(["Employer", "phone_ext"]).reset();
        this.claim.get(["Employer", "phone_ext"]).disable();
      }
    })
    this.claim.get(["ApplicantAttorney", "phone"]).valueChanges.subscribe(res => {
      if (this.claim.get(["ApplicantAttorney", "phone"]).value && this.claim.get(["ApplicantAttorney", "phone"]).valid) {
        this.claim.get(["ApplicantAttorney", "phone_ext"]).enable();
      } else {
        this.claim.get(["ApplicantAttorney", "phone_ext"]).reset();
        this.claim.get(["ApplicantAttorney", "phone_ext"]).disable();
      }
    })
    this.claim.get(["DefenseAttorney", "phone"]).valueChanges.subscribe(res => {
      if (this.claim.get(["DefenseAttorney", "phone"]).value && this.claim.get(["DefenseAttorney", "phone"]).valid) {
        this.claim.get(["DefenseAttorney", "phone_ext"]).enable();
      } else {
        this.claim.get(["DefenseAttorney", "phone_ext"]).reset();
        this.claim.get(["DefenseAttorney", "phone_ext"]).disable();
      }
    })
    this.claim.get(["DEU", "phone"]).valueChanges.subscribe(res => {
      if (this.claim.get(["DEU", "phone"]).value && this.claim.get(["DEU", "phone"]).valid) {
        this.claim.get(["DEU", "phone_ext"]).enable();
      } else {
        this.claim.get(["DEU", "phone_ext"]).reset();
        this.claim.get(["DEU", "phone_ext"]).disable();
      }
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
    this.correspondForm = this.formBuilder.group({
      file: ['', Validators.compose([Validators.required])],
      note: ['', Validators.compose([Validators.required])]
    })

    this.correspondenceSource = new MatTableDataSource([]);
    this.claimant.valueChanges.subscribe(
      value => {
        this.claimantChanges = true;
      }
    );

    this.claim.valueChanges.subscribe(
      value => {
        this.claimChanges = true;
      }
    );
    this.claim.get(['Employer', 'name'])!.valueChanges.subscribe(input => {
      if (this.claim.get(['Employer', 'name']).errors) {
        return
      } else {
        if (input) {
          this.empDetails = this._filteEmp(input)
        } else {
          this.empDetails = this.employerList.slice();
        }
      }
    });
    this.claim.get(['InsuranceAdjuster', 'company_name'])!.valueChanges.subscribe(input => {
      if (this.claim.get(['InsuranceAdjuster', 'company_name']).errors) {
        return
      } else {
        if (input) {
          if (input.length >= 3 || input.length == 0) {
            this.claimService.searchEAMSAdmin({ search: input }).subscribe(res => {
              let ind = this.claimAdminGroupOptions.map(function (e) { return e.name; }).indexOf('Simplexam Addresses');
              this.claimAdminGroupOptions[ind] = { name: "Simplexam Addresses", data: res.data };
            })
          }
        } else {
          this.claimService.searchEAMSAdmin({ search: "" }).subscribe(res => {
            let ind = this.claimAdminGroupOptions.map(function (e) { return e.name; }).indexOf('Simplexam Addresses');
            this.claimAdminGroupOptions[ind] = { name: "Simplexam Addresses", data: res.data };
          })
        }
      }
    });
    this.claim.get(['ApplicantAttorney', 'company_name'])!.valueChanges.subscribe(input => {
      if (this.claim.get(['ApplicantAttorney', 'company_name']).errors) {
        return
      } else {
        if (input) {
          if (input.length >= 3 || input.length == 0) {
            this.claimService.searchEAMSAttorney({ search: input }).subscribe(res => {
              let ind = this.claimAdminGroupOptions.map(function (e) { return e.name; }).indexOf('Simplexam Addresses');
              this.aattroneyGroupOptions[ind] = { name: "Simplexam Addresses", data: res.data };
            })
          }
        } else {
          this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
            let ind = this.claimAdminGroupOptions.map(function (e) { return e.name; }).indexOf('Simplexam Addresses');
            this.aattroneyGroupOptions[ind] = { name: "Simplexam Addresses", data: res.data };
          })
        }
      }
    });
    this.claim.get(['DefenseAttorney', 'company_name'])!.valueChanges.subscribe(input => {
      if (this.claim.get(['DefenseAttorney', 'company_name']).errors) {
        return
      } else {
        if (input) {
          if (input.length >= 3 || input.length == 0) {
            this.claimService.searchEAMSAttorney({ search: input }).subscribe(res => {
              let ind = this.dattroneyGroupOptions.map(function (e) { return e.name; }).indexOf('Simplexam Addresses');
              this.dattroneyGroupOptions[ind] = { name: "Simplexam Addresses", data: res.data };
            })
          }
        } else {
          this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
            let ind = this.dattroneyGroupOptions.map(function (e) { return e.name; }).indexOf('Simplexam Addresses');
            this.dattroneyGroupOptions[ind] = { name: "Simplexam Addresses", data: res.data };
          })
        }
      }
    })
    this.claimant.get("street1").valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetAddressList = address.suggestions;
            this.isAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isAddressError = true;
            this.streetAddressList = [];
          })
      })
    this.claim.get(['Employer', 'street1']).valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isEmpAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetEmpAddressList = address.suggestions;
            this.isEmpAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isEmpAddressError = true;
            this.streetEmpAddressList = [];
          })
      })
  }
  // private _filterAttroney(value: string, data) {
  //   console.log(value)
  //   if (value.length >= 3) {
  //     this.claimService.searchEAMSAttorney({ search: value }).subscribe(res => {
  //       // if (value) {
  //       //   return data
  //       //     .map(group => ({ name: group.name, data: _filter(group.data, value) }))
  //       //     .filter(group => group.data.length > 0);
  //       // }
  //       return [{ name: "EAMS ADJ Addresses", data: [] }, { name: "Simplexam Addresses", data: res.data }];
  //     });
  //   }
  // }
  // private _filterClaimAdmin(value: string, data) {
  //   // if (value) {
  //   //   return data
  //   //     .map(group => ({ name: group.name, data: _filter(group.data, value) }))
  //   //     .filter(group => group.data.length > 0);
  //   // }
  //   if (value.length >= 3) {
  //     this.claimService.searchEAMSAdmin({ search: value }).subscribe(res => {
  //       return [{ name: "EAMS ADJ Addresses", data: [] }, { name: "Simplexam Addresses", data: res.data }];
  //     });
  //   }
  // }
  newClaimant() {
    Object.keys(this.claimant.controls).forEach(key => {
      this.claimant.controls[key].setErrors(null)
    });
    // this.isEdit = false;
    this.isClaimantEdit = false;
    this.addNewClaimant = true;
    this.claimant.reset();
    this.claim.reset();
    this.iseams_entry = false;
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })
    this.claimant.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", 'claimant', street.state)
  }
  selectEmpAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.state;
      }
    })

    this.claim.get('Employer').patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", 'emp', street.state)
  }

  advanceSearchSubmit(auto) {
    let data = this.advanceSearch.value;
    data['isadvanced'] = this.searchStatus;
    this.claimService.searchClaimant(data).subscribe(res => {
      this.filteredClaimant = res;
      this.advanceSearch.reset();
      this.isClaimantEdit = true;
      this.claimant.reset();
      this.claim.reset();
      this.addNewClaimant = true;
      this.isClaimantCreated = true
      auto.openPanel();
      this.searchStatus = false;
    });

  }
  isClaimantCompleted = false;
  selectionChange(event) {
    if (event.selectedIndex == 0) {
      this.titleName = " Claimant"
    } else if (event.selectedIndex == 1) {
      this.createClaimant('tab');
      if (!this.claimant_id) {
        this.stepper.selected.completed = false;
        this.stepper.previous();
        return
      }
      if (this.claimId) {
        this.claimService.getClaim(this.claimId).subscribe(res => {
          this.injuryInfodata = res.data.claim_injuries;
          this.dataSource = new MatTableDataSource(this.injuryInfodata);
          this.claim.patchValue({
            claim_injuries: res.data.claim_injuries,
            InsuranceAdjuster: { id: res.data.agent_details.InsuranceAdjuster.id },
            Employer: { id: res.data.agent_details.Employer.id },
            ApplicantAttorney: { id: res.data.agent_details.ApplicantAttorney.id },
            DefenseAttorney: { id: res.data.agent_details.DefenseAttorney.id },
            DEU: { id: res.data.agent_details.DEU.id },
          })
        })
      }
      if (this.claimant.invalid) {
        return
      }
      if (this.claimantChanges) {

        this.createClaimant('tab');
      }
      this.titleName = " Claim";
    } else if (event.selectedIndex == 2) {

      if (this.claim.invalid) {
        return
      }
      if (this.claimantChanges) {
        this.createClaimant('tab');
      }
      if (this.claimChanges)
        this.submitClaim('tab')
      this.titleName = " Billable Item";
      if (this.claim.get(['claim_details', 'exam_type_id']).value == 3) {
        this.isIME = true;
      } else {
        this.isIME = false;
      }
    }
  }
  isClaimCreated = false;
  submitClaim(status) {
    this.isClaimSubmited = true;
    this.currentTab = "claim";
    // if (!this.claimChanges) {
    //   if (status == 'next') {
    //     this.stepper.next();
    //   } else if (status == 'save') {
    //     this.routeDashboard();
    //   }
    //   return;
    // }

    Object.keys(this.claim.controls).forEach((key) => {
      if (this.claim.get(key).value && typeof (this.claim.get(key).value) == 'string') {
        this.claim.get(key).setValue(this.claim.get(key).value.trim())
      }
      if (key != "claim_injuries") {
        Object.keys(this.claim.get(key)['controls']).forEach(key1 => {
          if (this.claim.get([key, key1]).value && typeof (this.claim.get([key, key1]).value) == 'string') {
            this.claim.get([key, key1]).setValue(this.claim.get([key, key1]).value.trim())
          }
        })
      }
    });
    if (this.claim.invalid) {
      this.getFormValidationErrors();
      return;
    }
    this.errors = { claim_details: 0, claim: 0, Employer: 0, InsuranceAdjuster: 0, ApplicantAttorney: 0, DefenseAttorney: 0, DEU: 0, }
    let claim = this.claim.value;
    claim['claim_injuries'] = this.injuryInfodata;
    let moments = this.injuryInfodata.map(d => moment(d.date_of_injury));
    this.minInjuryDate = moment.min(moments);
    if (this.documents_ids.length > 0) {
      claim['claim_details'].documents_ids = this.documents_ids;
    }
    if (this.iseams_entry) {
      claim['claim_details'].iseams_entry = this.iseams_entry;
    }
    this.fileErrors.file.isError = false;
    claim['claim_details'].claimant_id = this.claimant_id;
    if (this.isClaimCreated) {
      this.createClaim1(claim, status);
    } else {
      if (moment(this.claimant.get('date_of_birth').value).isBefore(this.minInjuryDate)) {
        this.createClaim1(claim, status);
      } else {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Date of Birth', message: "Please enter date of birth lesser than date of injury!", proceed: true, cancel: true, type: "warning", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.createClaim1(claim, status);
          } else {
            this.stepper.selectedIndex = 1;
            return
          }
        })
      }
    }
  }
  createClaim1(claim, status) {
    if (!this.claimId) {
      this.claimService.createClaim(claim).subscribe(res => {
        this.claimId = res.data.id;
        this.examtypeChange(this.claimId, this.claim.value.claim_details);
        let examtype = "";
        this.examTypes.map(exam => {
          if (res.data.exam_type_id == exam.id) {
            examtype = exam.exam_type_code + " - " + exam.exam_name;
          }
        })
        this.claimDetails = { claim_number: res.data.claim_number, exam_type_id: examtype, wcab_number: res.data.wcab_number }
        this.isClaimCreated = true;
        this.claim.patchValue({
          claim_details: {
            id: res.data.id
          }
        })
        this.billable_item.patchValue({
          claim_id: res.data.id
        })
        this.claimService.getClaim(this.claimId).subscribe(res => {
          console.log(res.data)
          this.injuryInfodata = res.data.claim_injuries;
          this.dataSource = new MatTableDataSource(this.injuryInfodata);
          this.claim.patchValue({
            claim_injuries: res.data.claim_injuries,
            InsuranceAdjuster: { id: res.data.agent_details.InsuranceAdjuster.id },
            Employer: { id: res.data.agent_details.Employer.id },
            ApplicantAttorney: { id: res.data.agent_details.ApplicantAttorney.id },
            DefenseAttorney: { id: res.data.agent_details.DefenseAttorney.id },
            DEU: { id: res.data.agent_details.DEU.id },
          })
          // this.alertService.openSnackBar(res.message, 'success');
          if (status == 'next') {

            this.stepper.next();
          } else if (status == 'save') {
            this.routeDashboard();
          }
        })
        this.claimChanges = false;
        this.isClaimCreated = true;
      }, error => {
        this.logger.log(error)
        this.isClaimCreated = false;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      claim['claim_injuries'] = this.injuryInfodata;
      console.log(this.injuryInfodata)
      this.claimService.updateClaimAll(claim, this.claimId).subscribe(res => {
        this.examtypeChange(this.claimId, this.claim.value.claim_details);
        let examtype = "";

        this.examTypes.map(exam => {
          if (res.data.exam_type_id == exam.id) {
            examtype = exam.exam_type_code + " - " + exam.exam_name;
          }
        })
        this.claimDetails = { claim_number: res.data.claim_number, exam_type_id: examtype, wcab_number: res.data.wcab_number }
        this.alertService.openSnackBar(res.message, 'success');
        if (status == 'next') {
          this.stepper.next();
        } else if (status == 'save') {
          this.routeDashboard();
        }
        this.claimChanges = false;
      }, error => {
        this.isClaimCreated = false;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

  VserviceLocation() {
    this.billable_item.patchValue({
      appointment: {
        is_virtual_location: true,
        examiner_service_location_id: null
      }
    })
  }
  examinarId: any;
  examinarChange(examinar) {
    this.examinarAddress = new Observable()
    this.addressCtrl.setValue('');
    this.selectedExaminarAddress = '';
    this.isAddressSelected = false;
    this.examinarId = examinar.id;
    this.claimService.getExaminarAddress(this.examinarId).subscribe(res => {
      this.examinerOptions = [];
      this.examinerOptions = res['data'];
      this.examinarAddress = this.addressCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterAddress(value))
        );

      if (examinar.address_id) {
        res.data.map(addr => {
          if (addr.address_id == examinar.address_id) {
            this.isAddressSelected = true;
            this.selectedExaminarAddress = addr;
          }
        })
      }
      this.address = res.data;
    })
  }
  // addressTypeChange(address) {
  //   this.claimService.getExaminarAddress(this.examinarId).subscribe(res => {
  //     this.examinarAddress = res.data;
  //   })
  // }
  submitBillableItem(state?) {
    // this.todayDate.appointment = new Date();
    this.currentTab = "billable_item"
    this.isBillSubmited = true;
    if (this.isSuplimental) {
      this.billable_item.get('intake_call').get('call_date').setValidators([Validators.compose([Validators.required])]);
    } else {
      this.billable_item.get('intake_call').get('call_date').setValidators([]);
    }
    this.billable_item.get('intake_call').get('call_date').updateValueAndValidity();
    Object.keys(this.billable_item.controls).forEach((key) => {
      if (this.billable_item.get(key).value && typeof (this.billable_item.get(key).value) == 'string')
        this.billable_item.get(key).setValue(this.billable_item.get(key).value.trim())
    });
    let billable_item_date: any;
    if (this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value) {
      billable_item_date = moment(this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value).add(1, 'minute')
      if (!(moment(this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value).isSameOrAfter(moment().set("second", 0)))) {
        this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).setErrors({'incorrect': true})
        return
      }
    }
    if (this.billable_item.invalid) {
      return;
    }
    if (!this.billable_item.touched) {
      return;
    }
    let selectedOrderIds = []
    if (this.isSuplimental) {
      selectedOrderIds = this.billable_item.value.documents_received
        .map((v, i) => v ? this.supplementalItems[i].name : null)
        .filter(v => v !== null);
    }
    //if (!this.isEdit) {
    // this.billable_item.value.exam_type.is_psychiatric = this.isChecked;
    this.billable_item.value.appointment.duration = this.billable_item.value.appointment.duration == "" ? null : this.billable_item.value.appointment.duration;
    this.billable_item.value.documents_received = selectedOrderIds;
    this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
      this.alertService.openSnackBar(res.message, "success");
      //this._location.back();
      // if (this.claimantChanges) {
      //   this.createClaimant('close')
      // }
      // if (this.claimChanges) {
      //   this.submitClaim('close')
      // }
      let baseUrl = "";
      let role = this.cookieService.get('role_id')
      console.log(role)
      switch (role) {
        case '1':
          baseUrl = "/admin";
          break;
        case '2':
          baseUrl = "/subscriber/";
          break;
        case '3':
          baseUrl = "/subscriber/manager/";
          break;
        case '4':
          baseUrl = "/subscriber/staff/";
          break;
        case '11':
          baseUrl = "/subscriber/examiner/";
          break;
        case '12':
          baseUrl = "/subscriber/staff/";
          break;
        default:
          baseUrl = "/";
          break;
      }
      // this.router.navigate(['/subscriber/appointment/appointment-details', this.claimId, res.data.id])
      if (state == 'close') {
        this.router.navigate([baseUrl])
      } else {
        this.router.navigate([baseUrl + "claimants/claimant/" + this.claimant_id + "/claim/" + this.claimId + "/billable-item/" + res.data.id]);
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
    // } else {
    // this.claimService.updateBillableItem(this.billable_item.value).subscribe(res => {
    //   this.alertService.openSnackBar(res.message, "success");
    //   this.router.navigate(['/subscriber/claims'])
    //   this._location.back();
    // }, error => {
    //   this.alertService.openSnackBar(error.error.message, 'error');
    // })
    // }
  }
  cancel(title) {
    this.openDialogCancel('cancel', "Create " + title)
  }
  examtypeChange(claim, type) {
    // this.claimService.getProcedureType(type).subscribe(res => {
    //   this.billable_item.patchValue({
    //     exam_type: {
    //       exam_procedure_type_id: null
    //     }
    //   })
    //   this.procuderalCodes = res.data;
    // })
    this.claimService.getProcedureTypeAttoney(claim).subscribe(procedure => {
      this.billable_item.patchValue({
        exam_type: {
          exam_procedure_type_id: null
        }
      })
      this.procuderalCodes = procedure.data;
    })
  }
  claimantDetails = { claimant_name: "", date_of_birth: "", phone_no_1: "", phone_ext1: "" }
  claimDetails = { claim_number: "", exam_type_id: "", wcab_number: "" }
  isClaimantCreated = false;
  createClaimant(status) {
    this.currentTab = "claimant";
    this.isClaimantSubmited = true;
    Object.keys(this.claimant.controls).forEach((key) => {
      if (this.claimant.get(key).value && typeof (this.claimant.get(key).value) == 'string')
        this.claimant.get(key).setValue(this.claimant.get(key).value.trim());
    });
    if (this.claimant.value.primary_language_spoken == 20) {
      this.claimant.get('other_language').setValidators([Validators.required]);
    } else {
      this.claimant.get('other_language').setValidators([]);
    }
    this.claimant.get('other_language').updateValueAndValidity();
    if (this.claimant.invalid) {
      return;
    }
    if (this.isClaimantCreated) {
      this.claimantCreate1(status);
    } else {
      if (moment(this.claimant.get('date_of_birth').value).isBefore(this.minInjuryDate)) {
        this.claimantCreate1(status);
      } else {
        const dialogRef = this.dialog.open(AlertDialogueComponent, {
          width: '500px',
          data: { title: 'Date of Birth', message: "Please enter date of birth lesser than date of injury!", proceed: true, cancel: true, type: "warning", info: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.data) {
            this.claimantCreate1(status);
          } else {
            this.stepper.selectedIndex = 0;
            return
          }
        })
      }
    }
  }
  claimantCreate1(status) {

    this.logger.log("claimantChanges", this.claimantChanges)
    if (this.claimantChanges) {
      this.claimantChanges = false;
      let data = this.claimant.value;
      data['certified_interpreter_required'] = this.languageStatus;
      data['date_of_birth'] = moment(this.claimant.value.date_of_birth).format("MM-DD-YYYY"); //new Date()//.toDateString();
      this.searchInput.reset();
      if (!this.isClaimantEdit) {
        this.claimService.createClaimant(this.claimant.value).subscribe(res => {
          this.claimant_id = res.data.id;
          this.alertService.openSnackBar(res.message, "success");
          this.claimantDetails = { claimant_name: res.data.first_name + " " + res.data.last_name, date_of_birth: res.data.date_of_birth, phone_no_1: res.data.phone_no_1, phone_ext1: res.data.phone_ext1 };
          // this.claimant.patchValue({
          //   id: res.data.id
          // })
          this.claim.patchValue({
            claim_details: {
              claimant_id: res.data.id,
              claimant_name: this.claimantDetails.claimant_name,
              date_of_birth: res.data.date_of_birth,
              phone_no_1: res.data.phone_no_1,
              phone_ext1: res.data.phone_ext1
            }
          });
          this.billable_item.patchValue({
            claimant_id: res.data.id,
            claim_details: {
              claimant_id: res.data.id,
              claimant_name: this.claimantDetails.claimant_name,
              date_of_birth: res.data.date_of_birth,
              phone_no_1: res.data.phone_no_1,
              phone_ext1: res.data.phone_ext1
            }
          })
          this.isClaimantCreated = true;
          this.isClaimantEdit = true;
          this.claimantChanges = false;
          this.stepper.selected.completed = true;
          if (status == 'next') {
            this.logger.log("check")

            this.stepper.next();
          } else if (status == 'save') {
            this.routeDashboard();
          } else if (status == 'close') {
            this.routeDashboard();
          }

        }, error => {
          this.logger.log(error)
          this.isClaimantCreated = false;
          this.alertService.openSnackBar(error.error.message, 'error');
          this.stepper.previous();
        })
      } else {
        let data = this.claimant.value;
        data['id'] = this.claimant_id;
        if (this.claimantChanges)
          this.logger.log("update")
        this.claimService.updateClaimant(data).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success");
          this.intercom.setClaimant(res.data.first_name + ' ' + res.data.last_name);
          this.cookieService.set('claimDetails', res.data.first_name + ' ' + res.data.last_name)
          this.claimantDetails = { claimant_name: res.data.first_name + " " + res.data.last_name, date_of_birth: res.data.date_of_birth, phone_no_1: res.data.phone_no_1, phone_ext1: res.data.phone_ext1 };
          this.claimantChanges = false;
          this.claim.patchValue({
            claim_details: {
              claimant_id: this.claimant_id,
              claimant_name: this.claimantDetails.claimant_name,
              date_of_birth: res.data.date_of_birth,
              phone_no_1: res.data.phone_no_1,
              phone_ext1: res.data.phone_ext1
            }
          });
          this.billable_item.patchValue({
            claimant_id: res.data.id,
            claim_details: {
              claimant_id: res.data.id,
              claimant_name: this.claimantDetails.claimant_name,
              date_of_birth: res.data.date_of_birth,
              phone_no_1: res.data.phone_no_1,
              phone_ext1: res.data.phone_ext1
            }
          })
          if (status == 'next') {
            this.stepper.next();
          } else if (status == 'save') {
            this.routeDashboard();
          } else if (status == 'close') {
            this.routeDashboard();
          }
        }, error => {
          this.isClaimantCreated = false;
          this.alertService.openSnackBar(error.error.message, 'error');
          this.stepper.previous();
        })
      }
    } else {
      if (this.claimant.invalid) {
        return;
      }
      if (status == 'close') {
        if (this.claimant.invalid) {
          return;
        }
        this.routeDashboard();
        return
      }
      // this.stepper.next();
    }
  }
  isInjuryEdit = false;
  addInjury() {
    if (this.isInjuryEdit) {
      let arrData = [];
      // if (this.injuryInfo['body_part_id'] != null)
      this.logger.log(this.injuryInfo)
      for (var i in this.injuryInfo['body_part_id']) {
        var part = {
          body_part_id: [this.injuryInfo['body_part_id'][i]],
          date_of_injury: new Date(this.injuryInfo['date_of_injury']).toDateString(),
          continuous_trauma: this.injuryInfo['continuous_trauma'],
          continuous_trauma_start_date: this.injuryInfo['continuous_trauma_start_date'] ? new Date(this.injuryInfo['continuous_trauma_start_date']).toDateString() : null,
          continuous_trauma_end_date: this.injuryInfo['continuous_trauma_end_date'] ? new Date(this.injuryInfo['continuous_trauma_end_date']).toDateString() : null,
          injury_notes: this.injuryInfo['injury_notes'],
          diagram_url: this.injuryInfo['diagram_url'],
        };
        arrData.push(part)
      }
      for (var j in arrData) {
        this.injuryInfodata.push(arrData[j])
      }
      this.dataSource = new MatTableDataSource(this.injuryInfodata);
      this.alertService.openSnackBar("Injury edited successfully", "success");
      this.injuryInfo = { id: null, body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
      this.isInjuryEdit = false;
    } else {
      let arrData = [];
      this.logger.log(this.injuryInfo)
      for (var i in this.injuryInfo['body_part_id']) {
        var part = {
          body_part_id: [this.injuryInfo['body_part_id'][i]],
          date_of_injury: new Date(this.injuryInfo['date_of_injury']).toDateString(),
          continuous_trauma: this.injuryInfo['continuous_trauma'],
          continuous_trauma_start_date: this.injuryInfo['continuous_trauma_start_date'] ? new Date(this.injuryInfo['continuous_trauma_start_date']).toDateString() : null,
          continuous_trauma_end_date: this.injuryInfo['continuous_trauma_end_date'] ? new Date(this.injuryInfo['continuous_trauma_end_date']).toDateString() : null,
          injury_notes: this.injuryInfo['injury_notes'],
          diagram_url: this.injuryInfo['diagram_url'],
        };
        arrData.push(part)
      }
      for (var j in arrData) {
        this.injuryInfodata.push(arrData[j]);
      }
      this.alertService.openSnackBar("Injury added successfully", "success");
      this.dataSource = new MatTableDataSource(this.injuryInfodata)
      this.injuryInfo = { id: null, body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
      this.isInjuryEdit = false;
    }
  }
  bodyPart(val) {
    let data = [];
    val.body_part_id.map(res => {
      let iii = this.bodyPartsList.find(val => val.id == res)
      if (iii)
        data.push(iii.body_part_code + " - " + iii.body_part_name);
    })
    return data
  }
  // deleteInjury(data, index) {
  //   this.injuryInfodata.splice(index, 1);
  //   this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
  //   this.dataSource = new MatTableDataSource(this.injuryInfodata)
  // }
  editInjury(element, index) {
    this.isInjuryEdit = true;
    let data = element;
    this.injuryInfo = data;
    // this.injuryInfodata.splice(index, 1);
    const dialogRef = this.dialog.open(InjuryDialog, {
      width: '800px',
      data: { claimant: this.claimant.value, bodyparts: this.bodyPartsList, isEdit: true, injuryData: this.injuryInfo }
    });
    localStorage.setItem("editingInjury", JSON.stringify(element));
    dialogRef.afterClosed().subscribe(result => {
      this.loader.show();
      if (result) {
        console.log(result)
        this.dataSource = new MatTableDataSource([]);
        this.logger.log("success");
        localStorage.removeItem("editingInjury");
        let a = 0;
        for (var i in result['body_part_id']) {
          var part = {
            id: result['id'] ? result['id'] : null,
            body_part_id: [result['body_part_id'][i]],
            date_of_injury: new Date(result['date_of_injury']).toDateString(),
            continuous_trauma: result['continuous_trauma'],
            continuous_trauma_start_date: result['continuous_trauma_start_date'] ? new Date(result['continuous_trauma_start_date']).toDateString() : null,
            continuous_trauma_end_date: result['continuous_trauma_end_date'] ? new Date(result['continuous_trauma_end_date']).toDateString() : null,
            injury_notes: result['injury_notes'],
            diagram_url: result['diagram_url'],
          };
          if (a == 0) {
            this.injuryInfodata[index] = part;
          } else {
            this.injuryInfodata.push(part);
          }
          a = a + 1;
        }
        this.dataSource = new MatTableDataSource(this.injuryInfodata)
        this.injuryInfo = { id: null, body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
        this.loader.hide();
        this.alertService.openSnackBar("Injury updated successfully", "success");
      } else {
        let editingInjury = localStorage.getItem("editingInjury");
        let data = JSON.parse(editingInjury)
        data.date_of_injury = new Date(data.date_of_injury).toDateString(),
          this.injuryInfodata[index] = data;
        this.dataSource = new MatTableDataSource(this.injuryInfodata)
        this.loader.hide();
      }
    });
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  eamsStatus: boolean = false;
  searchEAMS() {
    this.injuryInfodata = [];
    this.eamsStatus = true;
    if (this.emasSearchInput.invalid) {
      return;
    }
    if (this.emasSearchInput.value != "") {
      var adjValue = this.emasSearchInput.value.replace(/\s/g, '');
      if (adjValue.substring(0, 3).toLowerCase() == 'adj') {
      } else {
        this.alertService.openSnackBar("EAMS Number Not Valid", "error")
        this.eamsStatus = true;
        return
      }
    }
    if (this.emasSearchInput.value) {
      let data = {};
      if (!this.fromClaimant) {
        this.claimant.reset();
        data = {
          wcabNumber: this.emasSearchInput.value.replace(/\s/g, ''),
        }
      } else {
        data = {
          wcabNumber: this.emasSearchInput.value.replace(/\s/g, ''),
          claimant_first_name: this.claimant.value.first_name,
          claimant_last_name: this.claimant.value.last_name,
          claimant_date_of_birth: this.claimant.value.date_of_birth,
        }
      }
      this.claimant.patchValue({ ssn: "999999999" })
      this.claimService.searchbyEams(this.emasSearchInput.value.replace(/\s/g, ''), data).subscribe(res => {
        if (res.data) {
          this.isEdit = false;
          // this.claimant.reset();
          this.claim.reset();
          this.billable_item.reset();
          this.isNewClaim = true;
          this.claimId = "";
          this.correspondenceSource = new MatTableDataSource([]);
          if (!this.fromClaimant) {
            this.isClaimantEdit = false;
            this.addNewClaimant = true;
            this.changeState(res.data.claimant.state, 'claimant')
            this.claimant.patchValue(res.data.claimant);
            this.claimant.patchValue({
              state: res.data.claimant.state_id
            })
            this.changeState(res.data.claimant.state_id, 'claimant');
          }
          if (!this.isClaimantFilled)

            this.claim.patchValue({
              claim_details: res.data.claim,
            });
          res.data.injuryInfodata.map(injury => {
            let inj = injury;
            inj.date_of_injury = injury.date_of_injury ? injury.date_of_injury : null;
            inj.continuous_trauma_start_date = injury.continuous_trauma_start_date ? injury.continuous_trauma_start_date : null;
            inj.continuous_trauma_end_date = injury.continuous_trauma_end_date ? injury.continuous_trauma_end_date : null;
            this.injuryInfodata.push(inj)
          })
          let moments = res.data.injuryInfodata.map(d => moment(d.date_of_injury))
          this.minInjuryDate = moment.min(moments)

          // this.injuryInfodata = res.data.injuryInfodata;
          if (res.data.employer.length > 0) {
            this.employerList = res.data.employer;
            this.empDetails = res.data.employer;
          }
          // this.changeState(res.data.employer[0].state, 'emp')
          // this.appEmployer(res.data.employer[0])
          // } else {
          //   this.empDetails = res.data.employer;
          // }
          // if (res.data.claims_administrator.length == 1) {
          //   this.claimAdminList = [];
          //   // this.appClaimAdmin(res.data.claims_administrator[0])
          // } else {
          // this.claimAdminList = res.data.claims_administrator;
          // let data = [];
          let claim_admin = [];
          // res.data.claims_administrator.map(res => {
          //   res.name = res.company_name;
          //   claim_admin.push(res)
          // })
          if (res.data.claims_administrator.length != 0) {
            this.claimAdminList = [{ name: "EAMS ADJ Addresses", data: res.data.claims_administrator }, { name: "Simplexam Addresses", data: this.eamsClaimsAdministrator }]
          } else {
            this.claimAdminList = [{ name: "Simplexam Addresses", data: this.eamsClaimsAdministrator }]
          }
          this.claimAdminGroupOptions = this.claimAdminList;
          // this.claimAdminGroupOptions = this.claim.get(['InsuranceAdjuster', 'company_name'])!.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this._filterClaimAdmin(value, this.claimAdminList))
          // );

          this.dataSource = new MatTableDataSource(this.injuryInfodata)
          if (res.data.attroney.length != 0) {
            // this.attroneylist = res.data.attroney;
            // let attroney = [];
            // res.data.attroney.map(res => {
            //   res.name = res.company_name;
            //   attroney.push(res)
            // })
            this.attroneylist = [{ name: "EAMS ADJ Addresses", data: res.data.attroney }, { name: "Simplexam Addresses", data: this.eamsRepresentatives }];
            this.aattroneyGroupOptions = this.attroneylist;
            this.dattroneyGroupOptions = this.attroneylist;
            // this.aattroneyGroupOptions = this.claim.get(['ApplicantAttorney', 'company_name'])!.valueChanges
            //   .pipe(
            //     startWith(''),
            //     map(value => this._filterAttroney(value, this.attroneylist))
            //   );
            // this.dattroneyGroupOptions = this.claim.get(['DefenseAttorney', 'company_name'])!.valueChanges
            //   .pipe(
            //     startWith(''),
            //     map(value => this._filterAttroney(value, this.attroneylist))
            //   );
          }
          this.iseams_entry = true;
        } else {
          this.alertService.openSnackBar("EAMS Number Not Found", "error")
        }
      }, error => {
        this.alertService.openSnackBar(error.error.message, "error")
      })
    } else {
      this.alertService.openSnackBar("Please enter EAMS Number", "error")
    }
  }
  AattroneySelect = true;
  DattroneySelect = true;
  CASelect = true;
  attroneylist = [];
  bodyPartId(id) {
    let data = "";
    this.bodyPartsList.map(res => {
      // id.include
    })
  }
  isAddressSelected = false;
  selectedExaminarAddress: any = {};
  changeExaminarAddress(address) {
    this.logger.log(address)
    this.billable_item.patchValue({
      appointment: {
        is_virtual_location: false,
        examiner_service_location_id: address.address_id,
        conference_url: null,
        conference_phone: null
      }
    })
    this.isAddressSelected = true;
    this.selectedExaminarAddress = address;
  }
  selectedAAttorney: any;
  appAttorney(attroney) {
    this.claim.get('ApplicantAttorney').patchValue({
      city: null,
      email: null,
      company_name: null,
      fax: null,
      name: null,
      phone: null,
      state: null,
      street1: null,
      street2: null,
      zip_code: null
    });
    this.changeState(attroney.state, 'aa');
    // this.selectedAAttorney = attroney.id;
    delete attroney['id'];
    this.claim.patchValue({
      ApplicantAttorney: attroney
    })
    // }
  }
  selectedDAttorney: any;
  defAttornety(attroney) {
    this.claim.get('DefenseAttorney').patchValue({
      city: null,
      email: null,
      company_name: null,
      fax: null,
      name: null,
      phone: null,
      state: null,
      street1: null,
      street2: null,
      zip_code: null
    });
    this.changeState(attroney.state, 'da');
    delete attroney['id'];
    this.claim.patchValue({
      DefenseAttorney: attroney
    })
    // }
  }
  appClaimAdmin(claimadmin) {
    this.claim.get("InsuranceAdjuster").patchValue({
      city: null,
      company_name: null,
      email: null,
      fax: null,
      name: null,
      payor_id: null,
      phone: null,
      state: null,
      street1: null,
      street2: null,
      zip_code: null
    });
    this.changeState(claimadmin.state, 'ca');
    delete claimadmin['id'];
    this.claim.patchValue({
      InsuranceAdjuster: claimadmin
    })
  }
  clearAutoComplete(form) {
    switch (form) {
      case 'aa':
        this.selectedAAttorney = null;
        this.claim.get('ApplicantAttorney').patchValue({
          city: null,
          company_name: null,
          email: null,
          fax: null,
          name: null,
          phone: null,
          state: null,
          street1: null,
          street2: null,
          zip_code: null,
        });
        this.aaState = null;
        break;
      case 'da':
        this.selectedDAttorney = null;
        this.daState = null;
        this.claim.get('DefenseAttorney').patchValue({
          city: null,
          email: null,
          company_name: null,
          fax: null,
          name: null,
          phone: null,
          state: null,
          street1: null,
          street2: null,
          zip_code: null
        });
        break;
      case 'ca':
        this.caState = null;
        this.claim.get('InsuranceAdjuster').patchValue({
          city: null,
          company_name: null,
          email: null,
          fax: null,
          name: null,
          payor_id: null,
          phone: null,
          state: null,
          street1: null,
          street2: null,
          zip_code: null
        });
        break;
      case 'emp':
        this.empState = null;
        this.claim.get('Employer').patchValue({
          city: null,
          email: null,
          fax: null,
          name: null,
          phone: null,
          state: null,
          street1: null,
          street2: null,
          zip_code: null
        });
        break;
      case 'deu':
        this.deuState = null;
        this.deuCtrl.reset();
        this.claim.get('DEU').reset();
        // this.claim.get(["DEU", "street1"]).disable();
        // this.claim.get(["DEU", "street2"]).disable();
        // this.claim.get(["DEU", "city"]).disable();
        // this.claim.get(["DEU", "state"]).disable();
        // this.claim.get(["DEU", "zip_code"]).disable();
        // this.claim.get(["DEU", "phone"]).disable();
        // this.claim.get(["DEU", "phone_ext"]).disable();
        // this.claim.get(["DEU", "email"]).disable();
        // this.claim.get(["DEU", "fax"]).disable();
        break;
    }
  }
  todayDate = { appointment: new Date(), intake: new Date() }
  minDate: any;
  pickerOpened(type) {
    // this.minDate = new Date(this.claimant.value.date_of_birth);
    if (type = 'intake') {
      let date = moment();
      this.minDate = date.subtract(1, 'year');
      this.todayDate.intake = new Date();
    } else {
      let date = new Date();
      date.setSeconds(0);
      this.todayDate.appointment = date;
    }
  }
  getErrorCount(container: FormGroup): number {
    let errorCount = 0;
    for (let controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        if (container.controls[controlKey].errors) {
          errorCount += Object.keys(container.controls[controlKey].errors).length;
          this.logger.log(errorCount);
        }
      }
    }
    return errorCount;
  }
  changeDateType(date) {
    if (date) {
      this.billable_item.patchValue({
        appointment: { duration: 60 }
      })
      let timezone = moment.tz.guess();
      return this.appointment_scheduled_date_time = moment(date.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
    } else {
      return this.appointment_scheduled_date_time = null;
    }
  }
  examTypeChange(value) {
    this.procuderalCodes.map(res => {
      if (res.exam_procedure_type_id == value) {
        this.procedure_type(res);

      }
    })
  }
  isSuplimental = false;
  isDeposition = false;
  procedure_type(procuderalCode) {
    console.log(procuderalCode)
    if (procuderalCode.exam_procedure_type.includes("SUPP") || procuderalCode.exam_procedure_type_id == 28) {
      this.isSuplimental = true;
      this.billable_item.patchValue({
        appointment: {
          appointment_scheduled_date_time: null,
          duration: null,
          examiner_service_location_id: null,
          is_virtual_location: false,
          conference_url: null,
          conference_phone: null
        },
        intake_call: {
          caller_affiliation: null,
          caller_name: null,
          call_date: null,
          call_type: null,
          call_type_detail: null,
          notes: null,
          caller_phone: null,
          caller_email: null,
          caller_fax: null,
        }
      })
      if (this.billable_item.get('documents_received')) {
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
      }
      this.appointment_scheduled_date_time = null
    } else {
      if (procuderalCode.exam_procedure_type.includes("DEPO")) {
        this.isDeposition = true;
      } else {
        this.isDeposition = false;
      }
      this.isSuplimental = false;
    }

    if (procuderalCode.exam_procedure_type_id == 28) {
      this.isSuplimental = true;
    }
  }

  supplementalCheck() {
    if (!this.billable_item.get('documents_received').value[this.supplementalOtherIndex]) {
      this.billable_item.patchValue({
        intake_call: { notes: null }
      })
    }
  }
  selectedFile: File;
  fileErrors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  uploadFile(event) {

    let fileTypes = ['pdf', 'doc', 'docx']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.file = null;
        this.fileErrors.file.isError = true;
        this.fileErrors.file.error = "File size is too large";
        // this.alertService.openSnackBar("File size is too large", 'error');
        return;
      }
      this.selectedFile = event.target.files[0];
      this.fileErrors.file.isError = false;
      this.fileErrors.file.error = "";
      this.file = event.target.files[0].name;
    } else {
      this.selectedFile = null;
      this.file = null;
      this.fileErrors.file.isError = true;
      this.fileErrors.file.error = "This file type is not accepted";
      //this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }
  file: any = null;
  note: string = '';
  documents_ids = [];
  correspondFormSubmit() {
    if (this.file == null) {
      this.fileErrors.file.isError = true;
      this.fileErrors.file.error = "Please select file";
      return;
    }
    let formData = new FormData();
    formData.append('file', this.selectedFile);
    this.note = this.note ? this.note.trim() : this.note;
    formData.append('notes', this.note);
    if (this.claim.value.claim_details.id) {
      formData.append('claim_id', this.claim.value.claim_details.id)
    }
    this.claimService.postcorrespondence(formData).subscribe(data => {
      let details = {
        id: data['data'].id,
        file_name: data['data'].file_name,
        notes: this.note,
        updatedAt: data['data'].createdAt,
        exam_report_file_url: data['data'].exam_report_file_url
      }
      const tabledata = this.correspondenceSource.data ? this.correspondenceSource.data : this.correspondenceSource.data = [];
      tabledata.push(details);
      this.correspondenceSource = new MatTableDataSource(tabledata);
      if (!this.claim.value.claim_details.id) {
        this.documents_ids.push(data['data'].documents_id)
      }
      this.logger.log(this.documents_ids);
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      //this.correspondForm.reset();
      this.file = null;
      this.note = null;
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      this.logger.log(error);
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  deletecorrespondence(data) {
    this.openDialog('remove', data);
  }
  appEmployer(employer) {
    this.changeState(employer.state, 'emp')
    this.claim.patchValue({
      Employer: employer
    })
  }

  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.claimService.deleteCorrespondence(data.id, 1).subscribe(deleteRes => {
          let type = this.correspondenceSource.data.findIndex(element => element.id == data.id);
          const tabledata = this.correspondenceSource.data;
          tabledata.splice(type, 1);
          this.documents_ids.splice(type, 1)
          this.correspondenceSource = new MatTableDataSource(tabledata);
          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          this.logger.log(error);
        })
      }
    })
  }
  deuSelect(deu) {
    this.claim.get("DEU").enable();
    this.claim.patchValue({
      DEU: {
        city: deu.city,
        email: deu.email,
        fax: deu.fax,
        name: deu.name,
        phone: deu.phone,
        state: deu.state,
        street1: deu.street1,
        street2: deu.street2,
        zip_code: deu.zip_code
      }
    })
    this.changeState(deu.state, 'deu')
    this.claim.patchValue({
      DEU: {
        name: this.deuCtrl.value
      }
    })
  }

  routeDashboard() {
    this.role = this.cookieService.get('role_id')
    switch (this.role) {
      case '1':
        this.router.navigate(["/admin"]);
        break;
      case '2':
        this.router.navigate(["/subscriber"]);
        break;
      case '3':
        this.router.navigate(["/subscriber/manager"]);
        break;
      case '4':
        this.router.navigate(["/subscriber/staff"]);
        break;
      case '11':
        this.router.navigate(["/subscriber/examiner"]);
        break;
      case '12':
        this.router.navigate(["/subscriber/staff"]);
        break;
      default:
        this.router.navigate(["/"]);
        break;
    }
  }

  openDialogCancel(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.routeDashboard();
      }
    })
  }
  openPopup(title, value) {
    let data = this.userService.getRegulation(value)
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: title, regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
  selectedLanguage: any;
  modifyChange() {
    if (this.billable_item.value.exam_type.modifier_id)
      if (this.billable_item.value.exam_type.modifier_id.includes(2)) {
        this.languageList.map(res => {
          if (res.id == this.claimant.value.primary_language_spoken) {
            this.selectedLanguage = res;
          }
        })
        this.billable_item.patchValue({
          exam_type: { primary_language_spoken: this.claimant.value.primary_language_spoken }
        })
      }
  }
  errors = { claim_details: 0, claim: 0, Employer: 0, InsuranceAdjuster: 0, ApplicantAttorney: 0, DefenseAttorney: 0, DEU: 0, }
  getFormValidationErrors() {
    document.getElementById("claimant").scrollIntoView();

    Object.keys(this.claim.controls).forEach(key => {
      this.errors[key] = 0;
      if (this.claim.get(key).status == 'INVALID') {
        Object.keys(this.claim.get(key)['controls']).map(res => {
          if (this.claim.get(key)['controls'][res].status == 'INVALID' && this.claim.get(key)['controls'][res].touched) {
            this.logger.log(this.claim.get(key)['controls'])
            this.errors[key] = this.errors[key] + 1;
          }
        })
      }
    });
  }
  changeDate(event) {
    this.logger.log(event)
  }
  updateCalcs(event) {
    this.logger.log(event)
  }
  claimantDateOfBirth: any;
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  deleteInjury(data, index) {
    let body_part = this.bodyPart(data);
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: 'remove', address: true, title: body_part }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.injuryInfodata.splice(index, 1);
        this.injuryInfo = { id: null, body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
        this.dataSource = new MatTableDataSource(this.injuryInfodata);
        this.alertService.openSnackBar("Injury removed successfully", "success");
      }
    })

  }

  injuryCancel() {
    this.injuryInfo = { id: null, body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
  }
  psychiatric(event) {
    this.isChecked = event.checked;
    // this.modifiers = [];
    if (event.checked) {
      let modi = [];
      if (this.modifiers.find(obj => obj.id === 5)) {
        modi.push(5)
      }
      if (this.billable_item.value.exam_type.modifier_id != null) {
        this.billable_item.value.exam_type.modifier_id.map(res => {
          modi.push(res)
        })
      }
      this.billable_item.patchValue({
        exam_type: {
          is_psychiatric: true,
          modifier_id: modi,
        }
      })
      // this.modifiers = this.modifierList;
    } else {
      let modi = [];
      this.billable_item.value.exam_type.modifier_id.map(res => {
        if (res != 5) {
          modi.push(res)
        }
      })
      this.billable_item.patchValue({
        exam_type: {
          modifier_id: modi,
          is_psychiatric: false
        }
      })
      // this.modifiers = [];
      // this.modifierList.map(res => {
      //   if (res.modifier_code != "96")
      //     this.modifiers.push(res);
      // })
    }
  }

  langChange() {
    this.claimant.patchValue({ primary_language_spoken: null })
    this.billable_item.patchValue({ exam_type: { primary_language_spoken: this.claimant.value.primary_language_spoken } })
    if (this.languageStatus) {
      this.claimant.get('primary_language_spoken').setValidators([Validators.required]);
    } else {
      this.claimant.get('primary_language_spoken').setValidators([]);
    }
    this.claimant.get('primary_language_spoken').updateValueAndValidity();
    this.primary_language_spoken = this.claimant.value.primary_language_spoken ? true : false
  }
  primryLangChange() {
    this.modifyChange();
    this.billable_item.patchValue({ exam_type: { primary_language_spoken: this.claimant.value.primary_language_spoken } })
    this.primary_language_spoken = this.claimant.value.primary_language_spoken ? true : false
    if (this.claimant.value.primary_language_spoken == 20) {
      this.claimant.get('other_language').setValidators([Validators.required]);
    } else {
      this.claimant.get('other_language').setValidators([]);
    }
    this.claimant.get('other_language').updateValueAndValidity();
  }
  openInjuryDialog(): void {
    const dialogRef = this.dialog.open(InjuryDialog, {
      width: '800px',
      data: { claimant: this.claimant.value, bodyparts: this.bodyPartsList, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isInjuryEdit = false;
        this.injuryInfo = result;
        this.addInjury();
      }
    });
  }
  downloadDoc(file, file_name) {
    this.alertService.openSnackBar("File downloaded successfully", "success");
    saveAs(file, file_name);
  }
}

@Component({
  selector: 'injury-dialog',
  templateUrl: 'injury-dialog.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class InjuryDialog {
  @Output('opened') openedStream: EventEmitter;
  injuryInfo = { id: null, body_part_id: [], date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
  bodyPartsList = [];
  today = new Date();
  claimant: any;
  isLoding: boolean = false;
  minDate: any;
  injuryData: any;
  isEdit: any = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  bodyPartCtrl = new FormControl();
  filteredBodyParts: Observable<string[]>;
  bodyParts: string[] = [];
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InjuryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private claimService: ClaimService,
    private alertService: AlertService,
    private logger: NGXLogger) {
    dialogRef.disableClose = true;
    this.isLoding = true;
    this.claimant = data['claimant']
    data['bodyparts'].map(bp => {
      let body_part = bp;
      body_part.body_part_with_code = (bp.body_part_code + " - " + bp.body_part_name)
      this.bodyPartsList.push(body_part);
    })
    this.filteredBodyParts = this.bodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((body_part: string | null) => body_part ? this._filter(body_part) : this.bodyPartsList.slice()));
    this.isEdit = data['isEdit'];
    if (data['isEdit']) {
      data['injuryData'].body_part_id.map(id => {
        this.bodyPartsList.map(bp => {
          if (bp.id == id) {
            this.bodyParts.push(bp.body_part_code + " - " + bp.body_part_name)
          }
        })
      })
      console.log(data['injuryData'])
      this.injuryInfo.id = data['injuryData'].id ? data['injuryData'].id : null;
      this.injuryInfo.body_part_id = data['injuryData'].body_part_id;
      this.injuryInfo.date_of_injury = data['injuryData'].date_of_injury ? new Date(data['injuryData'].date_of_injury) : "";
      this.injuryInfo.continuous_trauma = data['injuryData'].continuous_trauma;
      this.injuryInfo.continuous_trauma_start_date = data['injuryData'].continuous_trauma_start_date ? new Date(data['injuryData'].continuous_trauma_start_date) : "";
      this.injuryInfo.continuous_trauma_end_date = data['injuryData'].continuous_trauma_end_date ? new Date(data['injuryData'].continuous_trauma_end_date) : "";
      this.injuryInfo.injury_notes = data['injuryData'].injury_notes;
      this.injuryData = data['injuryData']
    }
    this.isLoding = false;
  }
  onDate(event): void {
    if (this.injuryInfo.continuous_trauma) {
      this.injuryInfo.continuous_trauma_start_date = new Date(this.injuryInfo.date_of_injury);
    }
  }
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.bodyParts.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.bodyPartCtrl.setValue(null);
    }
  }

  remove(body_part: string): void {
    console.log(body_part)
    const index = this.bodyParts.indexOf(body_part);

    if (index >= 0) {
      this.injuryInfo.body_part_id.splice(index, 1)
      this.bodyParts.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option)
    this.bodyParts.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.bodyPartCtrl.setValue(null);
  }
  selectBodypart(body_part) {
    this.injuryInfo.body_part_id.push(body_part.id)
  }

  private _filter(value: string): string[] {
    let filterValue = "";
    if (typeof (value) == 'string')
      filterValue = value.toLowerCase();
    return this.bodyPartsList.filter(body_part => body_part.body_part_with_code.toLowerCase().indexOf(filterValue) >= 0);
  }
  bodyPart(bodypart) {
    for (var i in this.bodyPartsList) {
      if (this.bodyPartsList[i].id == bodypart[0]) {
        return this.bodyPartsList[i].body_part_code + "-" + this.bodyPartsList[i].body_part_name
      }
    }
  }
  onNoClick(): void {
    this.isEdit = false;
    this.dialogRef.close(false);
  }
  isInjurySubmit = false;
  addInjury() {
    let date_of_birth = moment(this.claimant.date_of_birth, "MM-DD-YYYY");
    let injury_date = this.injuryInfo.date_of_injury ? moment(this.injuryInfo.date_of_injury, "MM-DD-YYYY") : null;
    let ct_start_date = this.injuryInfo.continuous_trauma_start_date ? moment(this.injuryInfo.continuous_trauma_start_date, "MM-DD-YYYY") : null;
    let ct_end_date = this.injuryInfo.continuous_trauma_end_date ? moment(this.injuryInfo.continuous_trauma_end_date, "MM-DD-YYYY") : null;
    if (this.injuryInfo.body_part_id.length == 0) {
      this.alertService.openSnackBar("Please select body part", "error")
      return
    }
    if (!this.injuryInfo.date_of_injury) {
      this.alertService.openSnackBar("Please select injury date", "error")
      return
    } else {
      if (!(injury_date.isSameOrAfter(date_of_birth))) {
        this.alertService.openSnackBar("Please select injury date greater than date of birth", "error")
        return
      }
      if (!(moment(injury_date).isSameOrBefore(moment(new Date())))) {
        this.alertService.openSnackBar("Please select injury date before today", "error");
        return
      }
    }
    if (this.injuryInfo.continuous_trauma) {
      if (this.injuryInfo.continuous_trauma_start_date) {
        if (!(ct_start_date.isSameOrAfter(date_of_birth))) {
          this.alertService.openSnackBar("Continuous trauma Start date should after date of birth", "error")
          return
        }
        if (!(ct_start_date.isSameOrBefore(moment(new Date())))) {
          this.alertService.openSnackBar("Continuous trauma Start date should be before today", "error");
          return
        }
        if (this.injuryInfo.continuous_trauma_end_date) {
          if (!(ct_end_date.isSameOrAfter(date_of_birth))) {
            this.alertService.openSnackBar("Continuous trauma End date should after date of birth", "error")
            return
          }
          if (!(ct_end_date.isSameOrBefore(moment(new Date())))) {
            this.alertService.openSnackBar("Continuous trauma End date should be before today", "error");
            return
          }
          if (!(ct_start_date.isSameOrBefore(ct_end_date))) {
            this.alertService.openSnackBar("Continuous trauma end date should below than start date", "error")
            return
          }
        }
      } else {
        this.alertService.openSnackBar("Please select start date", "error")
        return;
      }
    }
    if (!this.injuryInfo.body_part_id) {
      this.alertService.openSnackBar("Please fill the injury information", "error")
      return;
    } else {
      if (!this.injuryInfo.date_of_injury) {
        this.alertService.openSnackBar("Please fill the injury date", "error")
        return
      }
    }
    console.log(this.injuryInfo)
    this.dialogRef.close(this.injuryInfo)

  }
  changeEvent() {
    this.minDate = moment(this.claimant.date_of_birth, "MM-DD-YYYY");// moment(this.claimant.date_of_birth);
  }
  ctChange() {
    if (!this.injuryInfo.continuous_trauma) {
      this.injuryInfo.continuous_trauma_start_date = null;
      this.injuryInfo.continuous_trauma_end_date = null;
    }
    if (this.injuryInfo.continuous_trauma) {
      // if (!this.isEdit) {
      this.injuryInfo.continuous_trauma_start_date = new Date(this.injuryInfo.date_of_injury);
      // }
    }
  }

}