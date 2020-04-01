import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material/table';
import * as globals from '../../../../globals';
import { AlertService } from 'src/app/shared/services/alert.service';
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
  displayedColumns: string[] = ['body_part_id', 'date_of_injury', 'continuous_trauma', 'note', "action"];
  dataSource: any;
  step = 0;
  isLinear = false;
  isSubmit = false;
  searchInput = new FormControl();
  filteredStates: Observable<any[]>;
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
  injuryInfodata: claimant1[] = []
  searchStatus: boolean = false;
  advanceSearch: any;
  injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: null, continuous_trauma_start_date: null, continuous_trauma_end_date: null, note: null, diagram_url: null }
  claimantList = [{ "id": 1, "first_name": "Velusamy", "last_name": "v", "middle_name": "v", "suffix": "v", "salutation": null, "date_of_birth": "2020-03-18", "gender": "M", "phone_no_1": "1223343234", "phone_no_2": "3253434243", "email": "sfdsfdsfddfd@samdhashd", "street1": null, "street2": null, "city": "rfdsfdsf", "state": 1, "zip_code": 213424423, "zip_code_plus_4": null, "handedness": "R", "primary_language_spoken": 1, "certified_interpreter_required": false, "ssn": "1111111111", "organization_id": 33, "created_by": null, "modified_by": null, "createdAt": "2020-03-26T09:55:41.244Z", "updatedAt": "2020-03-26T09:55:41.244Z" }, { "id": 5, "first_name": "Velusamy", "last_name": "v", "middle_name": "v", "suffix": "v", "salutation": null, "date_of_birth": "2020-03-01", "gender": "M", "phone_no_1": "6556576576", "phone_no_2": "8787575757", "email": "vvvveevveev@vv.com", "street1": null, "street2": null, "city": "city 2", "state": 44, "zip_code": 656757, "zip_code_plus_4": null, "handedness": "L", "primary_language_spoken": 1, "certified_interpreter_required": false, "ssn": "5655556666", "organization_id": 33, "created_by": null, "modified_by": null, "createdAt": "2020-03-27T07:08:22.084Z", "updatedAt": "2020-03-27T07:08:22.084Z" }, { "id": 8, "first_name": "velusay", "last_name": "sfvbhj", "middle_name": "sdfhvdh", "suffix": "hsbf<s", "salutation": null, "date_of_birth": "2020-03-09", "gender": "F", "phone_no_1": "3746237467", "phone_no_2": "3264263874", "email": "velusamy.v@auriss.com", "street1": null, "street2": null, "city": "city 1", "state": 3, "zip_code": 789645, "zip_code_plus_4": null, "handedness": "R", "primary_language_spoken": 1, "certified_interpreter_required": false, "ssn": "4637846746", "organization_id": 33, "created_by": null, "modified_by": null, "createdAt": "2020-03-27T08:10:22.498Z", "updatedAt": "2020-03-27T08:10:22.498Z" }, { "id": 4, "first_name": "Velusamy", "last_name": "V", "middle_name": "V", "suffix": "V", "salutation": null, "date_of_birth": "2020-01-21", "gender": "M", "phone_no_1": "3243434324", "phone_no_2": "3432434324", "email": "dsvvdvdvsdv@sdfdsf.dsfdsf", "street1": null, "street2": null, "city": "city 1", "state": 5, "zip_code": 789645, "zip_code_plus_4": null, "handedness": "R", "primary_language_spoken": 1, "certified_interpreter_required": false, "ssn": "2343242434", "organization_id": 33, "created_by": null, "modified_by": null, "createdAt": "2020-03-27T05:55:02.983Z", "updatedAt": "2020-03-27T05:55:02.983Z" }, { "id": 9, "first_name": "velusamyvn", "last_name": "vvv", "middle_name": "", "suffix": "vv", "salutation": null, "date_of_birth": "2020-02-12", "gender": "M", "phone_no_1": "3532535253", "phone_no_2": "5253532532", "email": "velusamy.v@auriss.com", "street1": "street 2", "street2": "street 2", "city": "city 1", "state": 15, "zip_code": 789633, "zip_code_plus_4": null, "handedness": "R", "primary_language_spoken": 1, "certified_interpreter_required": false, "ssn": "2432535523", "organization_id": 33, "created_by": null, "modified_by": null, "createdAt": "2020-03-27T13:26:06.881Z", "updatedAt": "2020-03-27T13:26:06.881Z" }, { "id": 6, "first_name": "Velu", "last_name": "v", "middle_name": "v", "suffix": "v", "salutation": null, "date_of_birth": "2020-03-16", "gender": "M", "phone_no_1": "", "phone_no_2": "", "email": "velusamy.v@auriss.com", "street1": null, "street2": null, "city": "city 1", "state": 6, "zip_code": 7896454, "zip_code_plus_4": null, "handedness": "R", "primary_language_spoken": 1, "certified_interpreter_required": false, "ssn": "4534554354", "organization_id": 33, "created_by": null, "modified_by": null, "createdAt": "2020-03-27T07:13:44.534Z", "updatedAt": "2020-03-27T07:13:44.534Z" }];
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
  ALL_SEED_DATA = ["address_type", "agent_type", "body_part",
    "contact_type", "exam_type", "language", "modifier", "object_type", "role_level", "roles", "state",
    "user_account_status", "user_roles"]
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  intakeComType: string;
  addNewClaimant:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService) {
    this.ALL_SEED_DATA.map(seed => {
      this.claimService.seedData(seed).subscribe(res => {
        switch (seed) {
          case "address_type":
            this.addressTypes = res.data;
            break;
          case "agent_type":
            this.agentTypes = res.data;
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
          case "procedural_code":
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
    this.claimService.getCallerAffliation().subscribe(res => {
      this.callerAffliation = res.data;
    })
    // this.searchInput.valueChanges.subscribe(res => {
    //   if (res) {
    //     this.filteredStates = this._filterStates(res);
    //   } else {
    //     this.filteredStates = this.claimantList.slice()
    //   }
    // })
    this.filteredStates = this.searchInput.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.claimantList.slice())
      );
  }

  advanceTabChanged(event) {
    this.searchStatus = false;
  }
  changeOption(option) {
    console.log(option)
    this.claim.patchValue({
      claim_details: {
        claimant_id: option.id
      }
    });
    this.claimant.setValue(option);
  }
  private _filterStates(value: string) {
    console.log(value)
    const filterValue = value.toLowerCase();
    let data: any;
    data = this.advanceSearch.value
    data['basic_search'] = value;
    data['isadvanced'] = this.searchStatus;
    this.claimService.searchClaimant(data).subscribe(res => {
      this.claimantList = res.data;
    })
    return this.claimantList.filter(state => state.first_name.toLowerCase().indexOf(filterValue) === 0);
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
        panel_number: [""],
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
      exam_type: this.formBuilder.group({
        procudure_type: [],
        modifiers: []
      }),
      appoinment: this.formBuilder.group({
        examinar: [],
        date: [],
        duration: [],
        address: []
      }),
      intake_call_info: this.formBuilder.group({
        caller_affliation: [],
        intake_caller: [],
        communication_type: [],
        communication_details: [],
        call_time: [],
        note: []
      })

    })
    // })
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
    // console.log("data", data);
    this.claimService.createClaim(claim).subscribe(res => {
      this.isClaimCreated = true;
      this.alertService.openSnackBar(res.message, 'success');
    }, error => {
      console.log(error)
      this.isClaimCreated = false;
      this.alertService.openSnackBar(error.error.error, 'error');
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
      this.isClaimantCreated = true;
    }, error => {
      this.isClaimantCreated = false;
      this.alertService.openSnackBar(error.error.error, 'error');
    })
  }
  addInjury() {
    this.injuryInfodata.push(this.injuryInfo)
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
    this.injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: null, continuous_trauma_start_date: null, continuous_trauma_end_date: null, note: null, diagram_url: null };
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
    this.claimService.searchbyEams(this.searchInput.value).subscribe(res => {
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

