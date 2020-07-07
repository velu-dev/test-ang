import { Component, OnInit, ViewChild, ElementRef, Input, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  MAT_DATE_LOCALE
} from '@angular/material';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  parseInput: 'L LT',
  fullPickerInput: 'L LT',
  datePickerInput: 'L',
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
const ELEMENT_DATA: claimant1[] = []
@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

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
  dataSource: any;
  step = 0;
  isLinear = false;
  isSubmit = false;
  emasSearchInput = new FormControl('', Validators.compose([Validators.maxLength(18), Validators.pattern('^[a-zA-Z]{3}[0-9]{1,15}$')]));
  searchInput = new FormControl();
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
  injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
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
  ALL_SEED_DATA = ["address_type", "body_part",
    "contact_type", "agent_type", "exam_type", "language", "modifier", "object_type", "role_level", "roles", "state",
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
  isClaimSubmited: boolean = false;
  isClaimantSubmited: boolean = false;
  isBillSubmited: boolean = false;
  examinerOptions: any = [];
  contactType: any;
  correspondForm: FormGroup;
  employerList = [];
  dataSource1 = [];
  deuDetails = [];
  filteredDeu: Observable<any[]>;
  deuCtrl = new FormControl();
  iseams_entry: boolean = false;
  role: string;
  date: any;
  primary_language_spoken: boolean = false;
  claimant_id: any;
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
  steperAutoChange = false;
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private _location: Location) {

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.claimService.getDeuDetails().subscribe(res => {
      this.deuDetails = res.data;
      this.filteredDeu = this.deuCtrl.valueChanges
        .pipe(
          startWith(''),
          map(deu => deu ? this._filteDeu(deu) : this.deuDetails.slice())
        );
    })

    this.route.params.subscribe(param => {
      if (param.claimant_id) {
        this.claimant_id = param.claimant_id;
        this.fromClaimant = true;
        this.isNewClaim = false;

        this.claimService.getSingleClaimant(this.claimant_id).subscribe(claimant => {
          if (claimant.status) {
            this.isRemoveSearchRemove = true;
            this.isClaimantCreated = true;
            this.searchStatus = false;
            this.isClaimantEdit = true;
            this.addNewClaimant = true;
            this.claimant_name = claimant.data[0].first_name + " " + claimant.data[0].last_name
            this.languageStatus = claimant['data'][0].certified_interpreter_required;
            this.claimant.patchValue(claimant.data[0])
            this.claim.patchValue({
              claim_details: {
                claimant_id: this.claimant_id
              }
            })
            this.billable_item.patchValue({
              claimant_id: this.claimant_id
            })
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
          this.claimant.patchValue(res.data.claimant_details)
          this.claimant_name = res.data.claimant_details.first_name + " " + res.data.claimant_details.last_name
          this.claim.patchValue({
            claim_details: {
              claimant_name: this.claimant_name
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
            exam_type: res.data.exam_type,
            intake_call: res.data.intake_calls,
            appointment: res.data.appointments
          })
          if (res.data.appointments) {
            let ex = { id: res.data.appointments.examiner_id, address_id: res.data.appointments.examination_location_id }
            this.examinarChange(ex)
          }

        })
      }
    })
    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;
    })
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
          // case "contact_type":
          //   // this.contactTypes = res.data;
          //   if (this.isEdit) {
          //     if (this.contactType) {
          //       let type = this.contactTypes.find(element => element.id == this.contactType)
          //       this.changeCommunicationType(type, 'auto');
          //     }
          //   }
          //   break;
          case "exam_type":
            this.examTypes = res.data;
            break;
          case "language":
            this.languageList = res.data;
            break;
          case "modifier":
            this.modifiers = res.data;
            break;
          case "object_type":
            this.objectTypes = res.data;
            break;
          case "procedural_codes":
            res.data.map(proc => {
              if (proc.procedural_code != "ML100") {
                this.procuderalCodes.push(proc);
              }
            })
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
        this.changeCommunicationType(type, 'auto');
      }
    })
    this.searchInput.valueChanges.subscribe(res => {
      this.claimService.searchClaimant({ basic_search: res, isadvanced: this.searchStatus }).subscribe(response => {
        this.filteredClaimant = response;
      })
    })
    // this.filteredClaimant = this.searchInput.valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     switchMap(value => this.claimService.searchClaimant({ basic_search: value, isadvanced: this.searchStatus })));
  }
  private _filteDeu(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.deuDetails.filter(deu => deu.deu_office.toLowerCase().indexOf(filterValue) === 0);
  }
  isLoading = false;
  advanceTabChanged(event) {
    console.log(event.index)
    this.tabIndex = event.index;
    this.searchStatus = false;
  }
  isClaimantEdit = false;
  selectClaimant(option) {
    console.log(option)
    this.isClaimantEdit = true;
    this.claimant.reset();
    this.claim.reset();
    this.addNewClaimant = true;
    this.languageStatus = option.certified_interpreter_required;
    this.isClaimantCreated = true;
    this.claimantDateOfBirth = option.date_of_birth;
    this.claimant_name = option.first_name + " " + option.last_name;
    this.claim.patchValue({
      claim_details: {
        claimant_id: option.id,
        claimant_name: this.claimant_name
      }
    });
    this.billable_item.patchValue({
      claimant_id: option.id
    })
    this.primary_language_spoken = option.primary_language_spoken ? true : false
    this.claimant.patchValue(option);
    //this.filteredClaimant = new Observable<[]>();

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
  ngOnInit() {
    this.advanceSearch = this.formBuilder.group({
      first_name: [],
      last_name: [],
      date_of_birth: [],
      city: [],
      zip_code: []
    })
    this.claimant = this.formBuilder.group({
      id: [""],
      last_name: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      middle_name: [''],
      salutation: [null, Validators.compose([Validators.maxLength(4)])],
      suffix: [null, Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      zip_code_plus_4: [null],
      date_of_birth: [null, Validators.required],
      gender: [null],
      email: ["", Validators.compose([Validators.email])],
      handedness: [null],
      primary_language_not_english: [null],
      primary_language_spoken: [null],
      certified_interpreter_required: [null],
      ssn: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_no_1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      organization_id: [null],
      phone_no_2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])]
    })

    this.claim = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        id: [null],
        claimant_name: [{ value: "", disabled: true }],
        wcab_number: [null, Validators.compose([Validators.maxLength(18), Validators.pattern('^[a-zA-Z]{3}[0-9]{1,15}$')])],
        claim_number: [null, Validators.compose([Validators.maxLength(25), Validators.pattern('[0-9]+')])],
        panel_number: [null, Validators.compose([Validators.pattern('[0-9]+'), Validators.maxLength(9)])],
        exam_type_id: [null, Validators.required],
        claimant_id: [null]
      }),
      claim_injuries: [null],
      InsuranceAdjuster: this.formBuilder.group({
        id: [null],
        company_name: [null],
        name: [null],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        fax: [null],
        email: [null, Validators.compose([Validators.email])],
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
        fax: [null],
        email: [null, Validators.compose([Validators.email])],

      }),
      ApplicantAttorney: this.formBuilder.group({
        id: [null],
        company_name: [null],
        name: [null],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        email: [null, Validators.compose([Validators.email])],
        fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      }),
      DefenseAttorney: this.formBuilder.group({
        id: [null],
        company_name: [null],
        name: [null],
        email: [null, Validators.compose([Validators.email])],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      }),
      DEU: this.formBuilder.group({
        id: [null],
        name: [null],
        street1: [null],
        street2: [null],
        city: [null],
        state: [null],
        zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
        phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        email: [null, Validators.compose([Validators.email])],
        fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      })
    })
    this.billable_item = this.formBuilder.group({
      claim_id: [null],
      claimant_id: [null],
      exam_type: this.formBuilder.group({
        procedure_type: [null, Validators.required],
        modifier_id: [null],
        is_psychiatric: [false],
        primary_language_spoken: [{ value: '', disabled: true }]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [null],
        appointment_scheduled_date_time: [null],
        duration: [null, Validators.compose([Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(450)])],
        examination_location_id: [null]
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [null],
        caller_name: [null],
        call_date: [null],
        call_type: [null],
        call_type_detail: [null],
        notes: [null]
      })

    })
    // })

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
  }
  newClaimant() {
    Object.keys(this.claimant.controls).forEach(key => {
      this.claimant.controls[key].setErrors(null)
    });
    this.isEdit = false;
    this.isClaimantEdit = false;
    this.addNewClaimant = true;
    this.claimant.reset();
    this.claim.reset();
    this.iseams_entry = false;
  }

  advanceSearchSubmit(auto) {
    console.log("advanceSearch", this.advanceSearch.value)
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

  selectionChange(event) {
    if (!this.steperAutoChange) {
      if (event.selectedIndex == 0) {
        this.titleName = " Claimant";
      } else if (event.selectedIndex == 1) {
        if (this.claimant.touched) {
          console.log(this.steperAutoChange, "fddsfsdfdfS")
          this.createClaimant('tab');
        }
        this.titleName = " Claim";
      } else if (event.selectedIndex == 2) {
        this.submitClaim('tab')
        this.titleName = " Billable Item";
      }
    }
  }
  isClaimCreated = false;
  submitClaim(status) {
    if (!this.claimChanges) {
      if (status == 'next') {
        this.stepper.next();
      } else if (status == 'save') {
        this.routeDashboard();
      }
      return;
    }

    this.claimChanges = false;
    this.isClaimSubmited = true;
    Object.keys(this.claim.controls).forEach((key) => {
      if (this.claim.get(key).value && typeof (this.claim.get(key).value) == 'string')
        this.claim.get(key).setValue(this.claim.get(key).value.trim())
    });
    if (this.claim.invalid) {
      this.getFormValidationErrors();
      return;
    }
    this.errors = { claim_details: 0, claim: 0, Employer: 0, InsuranceAdjuster: 0, ApplicantAttorney: 0, DefenseAttorney: 0, DEU: 0, }
    let claim = this.claim.value;
    claim['claim_injuries'] = this.injuryInfodata;
    if (this.documents_ids.length > 0) {
      claim['claim_details'].documents_ids = this.documents_ids;
    }
    if (this.iseams_entry) {
      claim['claim_details'].iseams_entry = this.iseams_entry;
    }
    console.log("!this.isEdit ||  !this.isClaimantEdit", !this.isEdit || !this.isClaimantEdit)
    if (!this.isEdit) {
      this.claimService.createClaim(claim).subscribe(res => {
        this.isClaimCreated = true;
        this.claimId = res.data.claim_id;
        this.billable_item.patchValue({
          claim_id: res.data.claim_id
        })
        this.alertService.openSnackBar(res.message, 'success');
        if (status == 'next') {
          this.stepper.next();
        } else if (status == 'save') {
          this.routeDashboard();
        }
        this.claimChanges = false;
        this.isEdit = true;
      }, error => {
        console.log(error)
        this.isClaimCreated = false;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateClaim(this.claim.value, this.claimId).subscribe(res => {
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
  examinarId: any;
  examinarChange(examinar) {
    this.addressCtrl.setValue('');
    this.selectedExaminarAddress = '';
    this.isAddressSelected = false;
    this.examinarId = examinar.id;
    this.claimService.getExaminarAddress(this.examinarId).subscribe(res => {
      this.examinerOptions = []
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
  submitBillableItem() {
    this.isBillSubmited = true;
    Object.keys(this.billable_item.controls).forEach((key) => {
      if (this.billable_item.get(key).value && typeof (this.billable_item.get(key).value) == 'string')
        this.billable_item.get(key).setValue(this.billable_item.get(key).value.trim())
    });
    if (this.billable_item.invalid) {
      return;
    }
    if (!this.billable_item.touched) {
      return;
    }
    //if (!this.isEdit) {
    this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
      this.alertService.openSnackBar(res.message, "success");
      //this._location.back();
      if (this.claimant.touched) {
        this.createClaimant('close')
      }
      if (this.claim.touched) {
        this.submitClaim('close')
      }
      this.routeDashboard();
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
  cancel() {
    this.openDialogCancel('cancel', null)
  }
  claimant_name = "";
  isClaimantCreated = false;
  createClaimant(status) {
    if (this.claimant.touched) {
      // if (!this.claimantChanges) {
      //   if (status == 'next') {
      //     this.stepper.next();
      //   } else if (status == 'save') {
      //     this.routeDashboard();
      //   } else if (status == 'close') {
      //     this.routeDashboard();
      //   }
      //   return;
      // } else {
      if (status == 'close') {
        if (this.claimant.invalid) {
          console.log("claimant", this.claimant)
          return;
        }
        this.routeDashboard();
      }
      // }
      this.claimantChanges = false;
      this.isClaimantSubmited = true;
      Object.keys(this.claimant.controls).forEach((key) => {
        if (this.claimant.get(key).value && typeof (this.claimant.get(key).value) == 'string')
          this.claimant.get(key).setValue(this.claimant.get(key).value.trim())
      });
      if (this.claimant.invalid) {
        console.log("claimant", this.claimant)
        return;
      }
      let data = this.claimant.value;
      data['certified_interpreter_required'] = this.languageStatus;
      data['date_of_birth'] = new Date(this.claimant.value.date_of_birth).toDateString();
      if (!this.isClaimantEdit) {
        this.claimService.createClaimant(this.claimant.value).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success");
          this.claimant_name = res.data.first_name + " " + res.data.last_name;
          this.claimant.patchValue({
            id: res.data.id
          })
          this.claim.patchValue({
            claim_details: {
              claimant_id: res.data.id,
              claimant_name: this.claimant_name
            }
          });
          this.billable_item.patchValue({
            claimant_id: res.data.id
          })
          this.isClaimantCreated = true;
          this.isClaimantEdit = true;
          this.claimantChanges = false;
          if (status == 'next') {
            console.log("check")
            this.steperAutoChange = true;
            this.stepper.next();
          } else if (status == 'save') {
            this.routeDashboard();
          } else if (status == 'close') {
            this.routeDashboard();
          }

        }, error => {
          console.log(error)
          this.isClaimantCreated = false;
          this.alertService.openSnackBar(error.error.message, 'error');
          this.stepper.previous();
        })
      } else {
        this.claimService.updateClaimant(this.claimant.value).subscribe(res => {
          this.alertService.openSnackBar(res.message, "success");
          if (status == 'next') {
            this.steperAutoChange = true;
            this.stepper.next();
          } else if (status == 'save') {
            this.routeDashboard();
          }
          this.claimantChanges = false;
        }, error => {
          this.isClaimantCreated = false;
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    }
  }
  isInjuryEdit = false;
  addInjury() {
    if (this.injuryInfo.continuous_trauma) {
      if (this.injuryInfo.continuous_trauma_start_date) {

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
    if (this.isInjuryEdit) {
      let index = 0;
      this.injuryInfodata.map(res => {
        if (res.body_part_id == this.injuryInfo.body_part_id) {
          this.injuryInfo.date_of_injury = new Date(this.injuryInfo.date_of_injury);
          this.injuryInfodata[index] = this.injuryInfo;
        }
        index = index + 1;
      })
      // let arrData = [];
      // for (var i in this.injuryInfo['body_part_id']) {
      //   var part = {
      //     body_part_id: [this.injuryInfo['body_part_id'][i]],
      //     date_of_injury: this.injuryInfo['date_of_injury'],
      //     continuous_trauma: this.injuryInfo['continuous_trauma'],
      //     continuous_trauma_start_date: this.injuryInfo['continuous_trauma_start_date'],
      //     continuous_trauma_end_date: this.injuryInfo['continuous_trauma_end_date'],
      //     injury_notes: this.injuryInfo['injury_notes'],
      //     diagram_url: this.injuryInfo['diagram_url'],
      //   };
      //   arrData.push(part)
      // }
      // for(var j in arrData){
      //   this.injuryInfodata.push(arrData[j])
      // }
      this.dataSource = new MatTableDataSource(this.injuryInfodata)
      this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
      this.isInjuryEdit = false;
    } else {
      let arrData = [];
      for (var i in this.injuryInfo['body_part_id']) {
        var part = {
          body_part_id: [this.injuryInfo['body_part_id'][i]],
          date_of_injury: new Date(this.injuryInfo['date_of_injury']),
          continuous_trauma: this.injuryInfo['continuous_trauma'],
          continuous_trauma_start_date: this.injuryInfo['continuous_trauma_start_date'],
          continuous_trauma_end_date: this.injuryInfo['continuous_trauma_end_date'],
          injury_notes: this.injuryInfo['injury_notes'],
          diagram_url: this.injuryInfo['diagram_url'],
        };
        arrData.push(part)
      }
      for (var j in arrData) {
        this.injuryInfodata.push(arrData[j])
      }
      console.log("injuryInfodata", this.injuryInfodata)
      this.dataSource = new MatTableDataSource(this.injuryInfodata)
      this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
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
    console.log(element)
    this.injuryInfo = element;
    // this.injuryInfodata.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  eamsStatus: boolean = false;
  searchEAMS() {
    this.eamsStatus = true;
    if (this.emasSearchInput.invalid) {
      return;
    }
    if (this.emasSearchInput.value != "") {
      var adjValue = this.emasSearchInput.value.replace(/\s/g, '');
      if (adjValue.substring(0, 3).toLowerCase() == 'adj') {
        console.log(adjValue);
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
      this.claimService.searchbyEams(this.emasSearchInput.value.replace(/\s/g, ''), data).subscribe(res => {
        if (res.data) {
          this.isEdit = false;
          if (!this.fromClaimant) {
            this.isClaimantEdit = false;
            this.addNewClaimant = true;
            this.claimant.patchValue(res.data.claimant)
          }
          this.claim.patchValue({
            claim_details: res.data.claim,
          });
          this.injuryInfodata = res.data.injuryInfodata;
          if (res.data.employer.length == 1) {
            this.employerList = [];
            this.appEmployer(res.data.employer[0])
          } else {
            this.employerList = res.data.employer;
          }
          ;
          if (res.data.claims_administrator.length == 1) {
            this.claimAdminList = [];
            this.appClaimAdmin(res.data.claims_administrator[0])
          } else {
            this.claimAdminList = res.data.claims_administrator;
          }
          this.dataSource = new MatTableDataSource(this.injuryInfodata)
          if (res.data.attroney.length != 0) {
            this.attroneylist = res.data.attroney;
            this.attroneySelect = true;
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
  attroneySelect = false;
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
    console.log(address)
    this.billable_item.patchValue({
      appointment: {
        examination_location_id: address.address_id
      }
    })
    this.isAddressSelected = true;
    this.selectedExaminarAddress = address;
  }
  appAttorney(attroney) {
    this.claim.patchValue({
      ApplicantAttorney: attroney
    })
  }
  defAttornety(attroney) {
    this.claim.patchValue({
      DefenseAttorney: attroney
    })
  }
  appClaimAdmin(claimadmin) {
    this.claim.patchValue({
      InsuranceAdjuster: claimadmin
    })
  }
  contactMask = { type: "", mask: "" }
  changeCommunicationType(contact, type) {
    if (contact)
      if (type == "man")
        this.billable_item.patchValue({
          intake_call: {
            call_type_detail: ""
          }
        })
    switch (contact.contact_type) {
      case "E1":
        this.contactMask.mask = "";
        this.billable_item.controls.intake_call.get('call_type_detail').setValidators(Validators.email);
        this.contactMask.type = "text";
        break;
      case "E2":
        this.contactMask.mask = "";
        this.billable_item.controls.intake_call.get('call_type_detail').setValidators(Validators.email)
        this.contactMask.type = "text";
        break;
      case "L1":
        this.contactMask.mask = "(000) 000-0000";
        this.billable_item.controls.intake_call.get('call_type_detail').setValidators([])
        this.contactMask.type = "text";
        break;
      case "L2":
        this.contactMask.mask = "(000) 000-0000";
        this.billable_item.controls.intake_call.get('call_type_detail').setValidators([])
        this.contactMask.type = "text";
        break;
      case "F1":
        this.contactMask.mask = "000-000-0000";
        this.contactMask.type = "text";
        break;
      case "F2":
        this.contactMask.mask = "000-000-0000";
        this.contactMask.type = "text";
        break;
      case "LE":
        this.contactMask.mask = "";
        this.contactMask.type = "text";
        break;
      default:
        this.contactMask.mask = "";
        this.contactMask.type = "text";
        break;
    }
    this.billable_item.get('call_type_detail').updateValueAndValidity();
  }
  todayDate = { appointment: new Date(), intake: new Date() }
  pickerOpened(type) {
    if (type = 'intake') {
      this.todayDate.intake = new Date();
    } else {
      this.todayDate.appointment = new Date();
    }
  }
  getErrorCount(container: FormGroup): number {
    let errorCount = 0;
    for (let controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        if (container.controls[controlKey].errors) {
          errorCount += Object.keys(container.controls[controlKey].errors).length;
          console.log(errorCount);
        }
      }
    }
    return errorCount;
  }
  procedure_type() {
    this.billable_item.patchValue({
      exam_type: { modifier_id: [] }
    })
  }
  selectedFile: File;
  uploadFile(event) {

    let fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.selectedFile = event.target.files[0];
      console.log(" this.selectedFile", this.selectedFile);
      this.file = event.target.files[0].name;
    } else {
      this.selectedFile = null;
      //this.errorMessage = 'This file type is not accepted';
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }
  file: any = null;
  note: string = null;
  documents_ids = [];
  correspondFormSubmit() {
    // console.log(this.correspondForm.value)
    // console.log(this.claim.value.claim_details.id)
    // if (this.correspondForm.invalid) {
    //   this.correspondForm.get('note').markAsTouched();
    //   this.correspondForm.get('file').markAsTouched();
    //   return;
    // }
    if (this.file == null || this.note == null || this.note.trim() == '') {
      return;
    }
    let formData = new FormData()
    formData.append('file', this.selectedFile);
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
      console.log(this.documents_ids);
      this.fileUpload.nativeElement.value = "";
      this.selectedFile = null;
      //this.correspondForm.reset();
      this.file = null;
      this.note = null;
      this.alertService.openSnackBar("File added successfully", 'success');
    }, error => {
      console.log(error);
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  deletecorrespondence(id) {
    this.openDialog('delete', id);
  }
  appEmployer(employer) {
    this.claim.patchValue({
      Employer: employer
    })
  }
  ctChange() {

    // if (this.injuryInfo.date_of_injury) {
    //   this.injuryInfo.continuous_trauma = false;
    //   return
    // } else {
    //   this.alertService.openSnackBar("Please Select Injury Date", "error");
    // }
  }
  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.claimService.deleteCorrespondence(data).subscribe(deleteRes => {
          let type = this.correspondenceSource.data.findIndex(element => element.id == data);
          const tabledata = this.correspondenceSource.data;
          tabledata.splice(type, 1);
          this.documents_ids.splice(type, 1)
          this.correspondenceSource = new MatTableDataSource(tabledata);
          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          console.log(error);
        })
      }
    })
  }
  deuSelect(deu) {
    deu.id = "";
    this.claim.patchValue({
      DEU: deu
    })
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
      default:
        this.router.navigate(["/"]);
        break;
    }
  }

  openDialogCancel(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.routeDashboard();
      }
    })
  }

  modifyChange() {
    if (this.billable_item.value.exam_type.modifier_id.includes(1)) {
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
            console.log(this.claim.get(key)['controls'])
            this.errors[key] = this.errors[key] + 1;
          }
        })
      }
    });
  }
  changeDate(event) {
    console.log(event)
  }
  updateCalcs(event) {
    console.log(event)
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
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: 'delete', address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.injuryInfodata.splice(index, 1);
        this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
        this.dataSource = new MatTableDataSource(this.injuryInfodata)
      }
    })

  }

  injuryCancel() {
    this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
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
    this.billable_item.patchValue({ exam_type: { primary_language_spoken: this.claimant.value.primary_language_spoken } })
    this.primary_language_spoken = this.claimant.value.primary_language_spoken ? true : false
  }

}
