import { Component, OnInit, ViewChild, ElementRef, Input, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material/table';
import * as globals from '../../../../globals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NativeDateAdapter, DateAdapter,
  MAT_DATE_FORMATS,
  MatDialog
} from '@angular/material';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
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
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class NewClaimComponent implements OnInit {

  displayedColumns_1 = ['doc_image', 'doc_name', 'date', 'action'];
  correspondenceSource: any = [];

  xls = globals.xls
  xls_1 = globals.xls_1
  docx = globals.docx
  pdf = globals.pdf


  claimAdminList = [];
  today = new Date();
  isMobile = false;
  displayedColumns: string[] = ['body_part_id', 'date_of_injury', "action"];
  dataSource: any;
  step = 0;
  isLinear = false;
  isSubmit = false;
  emasSearchInput = new FormControl();
  searchInput = new FormControl();
  filteredClaimant: Observable<any[]>;
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
  private _filterAddress(value: string): any {
    const filterValue = value.toLowerCase();
    return this.examinerOptions.filter(option => option.street1.toLowerCase().includes(filterValue));
  }

  dateOfbirthEndValue = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location) {

    this.route.params.subscribe(param => {
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
            res.data.map(caller => {
              if (caller.id != 5 && caller.id != 6 && caller.id != 7) {
                this.callerAffliation.push(caller);
              }
            })
            break;
          case "body_part":
            this.bodyPartsList = res.data;
            break;
          case "contact_type":
            this.contactTypes = res.data;
            if (this.isEdit) {
              if (this.contactType) {
                let type = this.contactTypes.find(element => element.id == this.contactType)
                this.changeCommunicationType(type, 'auto');
              }
            }
            break;
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
    this.filteredClaimant = this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.claimService.searchClaimant({ basic_search: value, isadvanced: this.searchStatus })));
  }
  isLoading = false;
  tabIndex = 0;
  advanceTabChanged(event) {
    this.tabIndex = event.index;
    this.searchStatus = false;
  }
  isClaimantEdit = false;
  selectClaimant(option) {
    this.isClaimantEdit = true;
    this.claimant.reset();
    this.claim.reset();
    this.addNewClaimant = true;
    this.languageStatus = option.certified_interpreter_required;
    this.isClaimantCreated = true;
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
    this.claimant.setValue(option);
    this.filteredClaimant = new Observable<[]>();
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
      middle_name: ['',],
      suffix: [null],
      zip_code_plus_4: [null],
      date_of_birth: [null, Validators.required],
      // date_of_birth: [new Date()],
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
      salutation: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      created_by: [null],
      modified_by: [null],
      createdAt: [null],
      updatedAt: [null]
    })

    this.claim = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        id: [null],
        claimant_name: [{ value: "", disabled: true }],
        wcab_number: [{ value: null, disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(15)])],
        claim_number: [{ value: null, disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
        panel_number: [{ value: null, disabled: this.isEdit }, Validators.compose([Validators.pattern('[0-9]+')])],
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
        zip_code: [null],
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
        zip_code: [null, Validators.compose([Validators.pattern('[0-9]+')])],
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
        zip_code: [null, Validators.compose([Validators.pattern('[0-9]+')])],
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
        zip_code: [null, Validators.compose([Validators.pattern('[0-9]+')])],
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
        zip_code: [null],
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
        modifier_id: [null]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [null],
        appointment_scheduled_date_time: [null],
        duration: [null],
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

  }
  newClaimant() {
    this.isEdit = false;
    this.isClaimantEdit = false;
    this.searchInput.reset();
    this.emasSearchInput.reset();
    this.addNewClaimant = true;
    this.claimant.reset();
    this.claim.reset();
  }

  advanceSearchSubmit() {
    console.log("advanceSearch", this.advanceSearch.value)
  }
  selectionChange(event) {
    if (event.selectedIndex == 0) {
      this.titleName = " Claimant";
    } else if (event.selectedIndex == 1) {
      this.titleName = " Claim";
    } else if (event.selectedIndex == 2) {
      this.titleName = " Billable Item";
    }


  }
  isClaimCreated = false;
  submitClaim() {
    this.isClaimSubmited = true;
    if (this.claim.invalid) {
      console.log("claim", this.claim)
      return;
    }
    let claim = this.claim.value;
    claim['claim_injuries'] = this.injuryInfodata;
    if (this.documents_ids.length > 0) {
      claim['claim_details'].documents_ids = this.documents_ids;
    }
    console.log("!this.isEdit ||  !this.isClaimantEdit", !this.isEdit || !this.isClaimantEdit)
    if (!this.isEdit) {
      this.claimService.createClaim(claim).subscribe(res => {
        this.isClaimCreated = true;
        this.billable_item.patchValue({
          claim_id: res.data.claim_id
        })
        this.alertService.openSnackBar(res.message, 'success');
      }, error => {
        console.log(error)
        this.isClaimCreated = false;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateClaim(this.claim.value, this.claimId).subscribe(res => {
        this.alertService.openSnackBar(res.message, 'success');
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
    if (this.billable_item.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        this.router.navigate(['/subscriber/claims'])
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }
  cancle() {

  }
  claimant_name = "";
  isClaimantCreated = false;
  createClaimant() {
    this.isClaimantSubmited = true;
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
        this.claimant_name = res.data.first_name + " " + res.data.last_name
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
      }, error => {
        console.log(error)
        this.isClaimantCreated = false;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateClaimant(this.claimant.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
      }, error => {
        this.isClaimantCreated = false;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
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
          this.injuryInfodata[index] = this.injuryInfo;
        }
        index = index + 1;
      })
      this.dataSource = new MatTableDataSource(this.injuryInfodata)
      this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
      this.isInjuryEdit = false;
    } else {
      this.injuryInfodata.push(this.injuryInfo);
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
    return data.join(",")
  }
  deleteInjury(data, index) {
    this.injuryInfodata.splice(index, 1);
    this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null };
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  editInjury(element, index) {
    this.isInjuryEdit = true;
    console.log(element)
    this.injuryInfo = element;
    // this.injuryInfodata.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }

  searchEAMS() {
    console.log(this.emasSearchInput.value != "", this.emasSearchInput.value)
    if (this.emasSearchInput.value) {
      this.claimant.reset();
      this.claimService.searchbyEams(this.emasSearchInput.value).subscribe(res => {
        if (res.status) {
          this.isEdit = false;
          this.isClaimantEdit = false;
          this.addNewClaimant = true;
          this.claimant.patchValue(res.data.claimant)
          this.claim.patchValue({
            claim_details: res.data.claim,
          });
          this.injuryInfodata = res.data.injuryInfodata;
          this.employerList = res.data.employer;
          this.claimAdminList = res.data.claims_administrator;
          this.dataSource = new MatTableDataSource(this.injuryInfodata)
          if (res.data.attroney.length != 0) {
            this.attroneylist = res.data.attroney;
            this.attroneySelect = true;
          }
        } else {
          this.alertService.openSnackBar("EAMS Number Not Found", "error")
        }
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
        this.contactMask.type = "email";
        break;
      case "E2":
        this.contactMask.mask = "email";
        break;
      case "M1":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "M2":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "L1":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "L2":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "F1":
        this.contactMask.mask = "000-000-0000";
        break;
      case "F2":
        this.contactMask.mask = "000-000-0000";
        break;
    }

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
    } else {
      this.selectedFile = null;
      //this.errorMessage = 'This file type is not accepted';
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }

  documents_ids = [];
  correspondFormSubmit() {
    console.log(this.correspondForm.value)
    console.log(this.claim.value.claim_details.id)
    if (this.correspondForm.invalid) {
      this.correspondForm.get('note').markAsTouched();
      this.correspondForm.get('file').markAsTouched();
      return;
    }
    let formData = new FormData()
    formData.append('file', this.selectedFile);
    formData.append('notes', this.correspondForm.value.note);
    if (this.claim.value.claim_details.id) {
      formData.append('claim_id', this.claim.value.claim_details.id)
    }
    this.claimService.postcorrespondence(formData).subscribe(data => {
      let details = {
        id: data['data'].id,
        file_name: data['data'].file_name,
        notes: this.correspondForm.value.note,
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
      this.correspondForm.reset();
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
    if (this.injuryInfo.date_of_injury) {
      this.injuryInfo.continuous_trauma = false;
      return
    } else {
      this.alertService.openSnackBar("Please Select Injury Date", "error");
    }
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
          this.documents_ids.splice(type,1)
          this.correspondenceSource = new MatTableDataSource(tabledata);
          this.alertService.openSnackBar("File deleted successfully", 'success');
        }, error => {
          console.log(error);
        })
      }
    })
  }
}
