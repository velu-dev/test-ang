import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export interface Claimant {
  last_name: string;
  first_name: string;
  middle_name: string;
}


export interface claimant1 {
  body_part_id: string,
  date_of_injury: string,
  continuous_trauma: string,
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
  titleName = "Create Claimant";
  languageStatus = false;
  callerAffliation = [];
  injuryInfodata = []
  searchStatus: boolean = false;
  advanceSearch: any;
  injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: "false", continuous_trauma_start_date: null, continuous_trauma_end_date: null, note: null, diagram_url: null }
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
  ALL_SEED_DATA = ["address_type", "body_part",
    "contact_type", "agent_type", "exam_type", "language", "modifier", "object_type", "role_level", "roles", "state",
    "user_account_status", "user_roles", "procedural_codes"];
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  intakeComType: string;
  addNewClaimant: boolean;
  examinarList: any = [];
  examinarAddress = [];
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(param => {
      if (param.id) {
        this.claimService.getClaim(param.id).subscribe(res => {
          console.log(res)
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
            this.procuderalCodes = res.data;
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
  advanceTabChanged(event) {
    this.searchStatus = false;
  }
  selectClaimant(option) {
    this.claimant.reset();
    this.claim.reset();
    this.addNewClaimant = true;
    this.isClaimantCreated = true;
    this.claimant_name = option.first_name + "  " + option.last_name
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
      salutation: [],
      organization_id: [],
      created_by: [],
      modified_by: [],
      createdAt: [],
      updatedAt: [],
      zip_code_plus_4: [],
      date_of_birth: [null, Validators.required],
      gender: [],
      email: ["", Validators.compose([Validators.email])],
      handedness: [],
      primary_language_spoken: [],
      certified_interpreter_required: [],
      ssn: [],
      phone_no_1: [],
      phone_no_2: [],
      street1: [],
      street2: [],
      city: [],
      state: [],
      zip_code: []
    })

    // this.claimForm = this.formBuilder.group({
    this.claim = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        // wcab_number: ["", Validators.required],
        // claim_number: ["", Validators.required],
        claimant_name: [{ value: "", disabled: true }],
        wcab_number: [],
        claim_number: [],
        panel_number: [],
        exam_type: [],
        claimant_id: []
      }),
      claim_injuries: [],
      InsuranceAdjuster: this.formBuilder.group({
        insurance_name: [],
        name: [],
        phone: [],
        fax: [],
        email: [],
        address: [],
      }),
      Employer: this.formBuilder.group({
        name: [],
        phone: [],
        address: [],
        city: [],
        state: [],
        zipcode: [],
      }),
      ApplicantAttorney: this.formBuilder.group({
        law_firm_name: [],
        attorney_name: [],
        phone: [],
        fax: [],
        email: [],
        address: [],
        city: [],
        state: [],
        zipcode: []
      }),
      DefenseAttorney: this.formBuilder.group({
        law_firm_name: [],
        attorney_name: [],
        phone: [],
        fax: [],
        email: [],
        address: [],
        city: [],
        state: [],
        zipcode: []
      }),
      DEU: this.formBuilder.group({
        name: [],
        phone: [],
        address: [],
        street1: [],
        street2: []
      })
    })
    this.billable_item = this.formBuilder.group({
      claim_id: [],
      claimant_id: [],
      exam_type: this.formBuilder.group({
        procudure_type: [],
        modifier_id: []
      }),
      appointment: this.formBuilder.group({
        examiner_id: [],
        appointment_scheduled_date_time: [],
        duration: [],
        examination_location_id: [1]
      }),
      intake_call: this.formBuilder.group({
        caller_affliation: [],
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
      this.titleName = "Create Claimant";
    } else if (event.selectedIndex == 1) {
      this.titleName = "Create Claim";
    } else if (event.selectedIndex == 2) {
      this.titleName = "Create Billable Item";
    }
  }
  isClaimCreated = false;
  submitClaim() {
    if (this.claim.invalid) {
      console.log("claim", this.claim)
      return;
    }
    let claim = this.claim.value;
    claim['claim_injuries'] = this.injuryInfodata;
    // let data = { ...this.claimant.value, ...claim };
    console.log("claim details", claim);
    this.claimService.createClaim(claim).subscribe(res => {
      this.isClaimCreated = true;
      this.billable_item.patchValue({
        claim_id: res.data.claim_id
      })
      this.alertService.openSnackBar(res.message, 'success');
      this.claim.reset();
    }, error => {
      console.log(error)
      this.isClaimCreated = false;
      this.alertService.openSnackBar(error.error.error, 'error');
    })
  }
  examinarId: any;
  examinarChange(examinar) {
    this.examinarId = examinar.id;
  }
  addressTypeChange(address) {
    let data = {
      "examiner_id": this.examinarId,
      "address_type_id": address.id
    }
    this.claimService.getExaminar(data).subscribe(res => {
      console.log(res)
    })
  }
  submitBillableItem() {
    this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
      console.log(res.data)
    })
  }
  cancle() {

  }
  claimant_name = "";
  isClaimantCreated = false;
  createClaimant() {
    if (this.claimant.invalid) {
      console.log("claimant", this.claimant)
      return;
    }
    let data = this.claimant.value;
    data['primary_language_not_english'] = this.languageStatus;
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
  }
  addInjury() {
    this.injuryInfodata.push(this.injuryInfo)
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
    this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: "false", continuous_trauma_start_date: null, continuous_trauma_end_date: null, note: null, diagram_url: null };
  }
  bodyPart(element) {
    let data = [];
    element.body_part_id.map(res => {
      let iii = this.bodyPartsList.find(element => element.id == res)
      data.push(iii.body_part + " - " + iii.body_part_name);
    })
    return data.join(",")
  }
  deleteInjury(data, index) {
    this.injuryInfodata.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  editInjury(element, index) {
    console.log(element)
    this.injuryInfo = element;
    this.injuryInfodata.splice(index, 1);
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
    this.claimant.reset();
    this.claimService.searchbyEams("ADJ" + this.emasSearchInput.value).subscribe(res => {
      if (res.status) {
        this.addNewClaimant = true;
        this.claimant.patchValue(res.data.claimant)
        this.claim.patchValue({
          claim_details: res.data.claim,
          Employer: res.data.employer
        });
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
  }
  attroneySelect = false;
  attroneylist = []
  bodyPartId(id) {
    let data = "";
    this.bodyPartsList.map(res => {
      // id.include
    })
  }
}

