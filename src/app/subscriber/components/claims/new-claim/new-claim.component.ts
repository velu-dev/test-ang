import { Component, OnInit, ViewChild, ElementRef, Input, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material/table';
import * as globals from '../../../../globals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { runInThisContext } from 'vm';
import { ActivatedRoute } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
export interface Claimant {
  last_name: string;
  first_name: string;
  middle_name: string;
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
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {
  today = new Date();
  isMobile = false;
  xls = globals.xls
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
  private _filterAddress(value: string): any[] {
    let val = value.replace(",", "")//.toLowerCase();
    const filterValue = val.replace(" ", "")
    return this.address.filter(add => add.street1.indexOf(filterValue.toLowerCase()) === 0);
  }
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute) {
    // super(dateLocale);
    this.examinarAddress = this.addressCtrl.valueChanges
      .pipe(
        startWith(''),
        map(address => address ? this._filterAddress(address) : this.address.slice())
      );
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
          console.log("fsdhfgdsfdhfdshu", res.data.claim_injuries)
          this.injuryInfodata = res.data.claim_injuries;
          this.dataSource = new MatTableDataSource(this.injuryInfodata);
          this.billable_item.patchValue({
            claim_id: res.data.claim_details.id,
            claimant_id: res.data.claimant_details.id,
            exam_type: res.data.exam_type,
            intake_call: res.data.intake_calls,
            appointment: res.data.appointments
          })
          console.log("examinar location")
          let ex = { id: res.data.appointments.examiner_id, address_id: res.data.appointments.examination_location_id }
          this.examinarChange(ex)
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
    // this.claimService.getCallerAffliation().subscribe(res => {
    //   this.callerAffliation = res.data;
    // })
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
    this.isClaimantCreated = true;
    this.claimant_name = option.first_name + " " + option.last_name
    console.log("claimant_name", this.claimant_name)
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
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      suffix: [],
      zip_code_plus_4: [],
      date_of_birth: [null, Validators.required],
      gender: [],
      email: ["", Validators.compose([Validators.email])],
      handedness: [],
      primary_language_spoken: [],
      certified_interpreter_required: [],
      ssn: [],
      phone_no_1: [],
      organization_id: [],
      phone_no_2: [],
      street1: [],
      street2: [],
      salutation: [],
      city: [],
      state: [],
      zip_code: []
    })

    // this.claimForm = this.formBuilder.group({
    this.claim = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        // wcab_number: ["", Validators.required],
        // claim_number: ["", Validators.required],
        id: [],
        claimant_name: [{ value: "", disabled: true }],
        wcab_number: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
        claim_number: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
        panel_number: [],
        exam_type: [null, Validators.required],
        claimant_id: []
      }),
      claim_injuries: [],
      InsuranceAdjuster: this.formBuilder.group({
        id: [],
        insurance_name: [],
        name: [],
        phone: [],
        fax: [],
        email: [],
        street1: [],
      }),
      Employer: this.formBuilder.group({
        id: [],
        name: [],
        phone: [],
        street1: [],
        city: [],
        state: [],
        zip_code: [],
      }),
      ApplicantAttorney: this.formBuilder.group({
        id: [],
        law_firm_name: [],
        name: [],
        phone: [],
        fax: [],
        email: [],
        street1: [],
        city: [],
        state: [],
        zip_code: []
      }),
      DefenseAttorney: this.formBuilder.group({
        id: [],
        law_firm_name: [],
        name: [],
        phone: [],
        fax: [],
        email: [],
        street1: [],
        city: [],
        state: [],
        zip_code: []
      }),
      DEU: this.formBuilder.group({
        id: [],
        name: [],
        phone: [],
        street1: [],
        street2: []
      })
    })
    this.billable_item = this.formBuilder.group({
      claim_id: [],
      claimant_id: [],
      exam_type: this.formBuilder.group({
        procudure_type: [null, Validators.required],
        modifier_id: []
      }),
      appointment: this.formBuilder.group({
        examiner_id: [],
        appointment_scheduled_date_time: [],
        duration: [],
        examination_location_id: []
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [],
        caller_name: [],
        call_date: [],
        call_type: [],
        call_type_detail: [],
        notes: []
      })

    })
    // })
  }
  newClaimant() {
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
        this.alertService.openSnackBar(error.error.error, 'error');
      })
    } else {
      this.claimService.updateClaim(this.claim.value, this.claimId).subscribe(res => {
        this.alertService.openSnackBar(res.message, 'success');
      }, error => {
        this.isClaimCreated = false;
        this.alertService.openSnackBar(error.error.error, 'error');
      })
    }
  }
  examinarId: any;
  examinarChange(examinar) {
    this.examinarId = examinar.id;
    this.claimService.getExaminarAddress(this.examinarId).subscribe(res => {
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
      }, error => {
        this.alertService.openSnackBar(error.error.error, 'error');
      })
    } else {
      this.claimService.updateBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
      }, error => {
        this.alertService.openSnackBar(error.error.error, 'error');
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
    if (!this.isClaimantEdit) {
      this.claimService.createClaimant(this.claimant.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        this.claimant_name = res.data.first_name + "  " + res.data.last_name
        console.log("claimant_name", this.claimant_name)
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
      }, error => {
        console.log(error)
        this.isClaimantCreated = false;
        this.alertService.openSnackBar(error.error.error, 'error');
      })
    } else {
      this.claimService.updateClaimant(this.claimant.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
      }, error => {
        this.isClaimantCreated = false;
        this.alertService.openSnackBar(error.error.error, 'error');
      })
    }
  }
  isInjuryEdit = false;
  addInjury() {
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
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  editInjury(element, index) {
    this.isInjuryEdit = true;
    console.log(element)
    this.injuryInfo = element;
    // this.injuryInfodata.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  selectedFile: File;
  uploadFile(event) {
    this.selectedFile = event.target.files[0];
    console.log(" this.selectedFile", this.selectedFile);
    let formData = new FormData()
    formData.append('file', this.selectedFile)
    console.log("formData", formData)

  }
  searchEAMS() {
    console.log(this.emasSearchInput.value != "", this.emasSearchInput.value)
    if (this.emasSearchInput.value != "") {
      this.claimant.reset();
      this.claimService.searchbyEams("ADJ" + this.emasSearchInput.value).subscribe(res => {
        if (res.status) {
          this.addNewClaimant = true;
          this.claimant.patchValue(res.data.claimant)
          this.claim.patchValue({
            claim_details: res.data.claim,
            Employer: res.data.employer
          });
          // this.claim.patchValue({
          //   claim_details: {
          //     wcab_number: res.data.claim.wcab_number.substr(3)
          //   }
          // })
          this.injuryInfodata = res.data.injuryInfodata;
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
  attroneylist = []
  bodyPartId(id) {
    let data = "";
    this.bodyPartsList.map(res => {
      // id.include
    })
  }
  isAddressSelected = false;
  selectedExaminarAddress: any = {};
  changeExaminarAddress(address) {
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
  contactMask: any;
  changeCommunicationType(contact) {
    switch (contact.contact_type) {
      case "E1":
        this.contactMask = "";
        break;
      case "E2":
        this.contactMask = "";
        break;
      case "M1":
        this.contactMask = "";
        break;
      case "M2":
        this.contactMask = "";
        break;
      case "L1":
        this.contactMask = "";
        break;
      case "L2":
        this.contactMask = "";
        break;
      case "F1":
        this.contactMask = "";
        break;
      case "F2":
        this.contactMask = "";
        break;
    }
  }
}

