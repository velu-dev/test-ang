import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material/table';
import * as globals from '../../../../globals';
export interface Claimant {
  last_name: string;
  first_name: string;
  middle_name: string;
}


export interface claimant1 {
  body_parts: string,
  date_of_injury: string,
  continuous_trauma: string,
  ct_start_date: string,
  ct_end_date: string,
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
  displayedColumns: string[] = ['body_parts', 'date_of_injury', 'note', "action"];
  dataSource: any;
  step = 0;
  isLinear = false;
  isSubmit = false;
  states = [];
  searchInput = new FormControl();
  filteredStates: any;
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
  languageList = [];
  languageStatus = false;
  callerAffliation = [];
  injuryInfodata: claimant1[] = []
  searchStatus: boolean = false;
  advanceSearch: any;
  injuryInfo = { body_parts: "", date_of_injury: "", continuous_trauma: "", ct_start_date: "", ct_end_date: "", note: "", diagram_url: "" }
  claimantList = [
    {
      last_name: 'John',
      first_name: "Abraham",
      middle_name: "JA",
      suffix: "",
      date_of_birth: "",
      gender: "",
      email: "",
      handedness: "",
      is_primary_lanuguage_english: "",
      primary_language: "",
      certified_inpreted: "",
      ssn: "",
      phone_number: "",
      phone_number_1: "",
      street_1: "",
      street_2: "",
      city: "",
      state: "",
      zipcode: ""
    },
    {
      last_name: 'Lee',
      first_name: "Brues",
      middle_name: "LB",
      suffix: "",
      date_of_birth: "",
      gender: "",
      email: "",
      handedness: "",
      is_primary_lanuguage_english: "",
      primary_language: "",
      certified_inpreted: "",
      ssn: "",
      phone_number: "",
      phone_number_1: "",
      street_1: "",
      street_2: "",
      city: "",
      state: "",
      zipcode: ""

    },
    {
      last_name: 'Rajan',
      first_name: "Mariyappan",
      middle_name: "RM",
      suffix: "",
      date_of_birth: "",
      gender: "",
      email: "",
      handedness: "",
      is_primary_lanuguage_english: "",
      primary_language: "",
      certified_inpreted: "",
      ssn: "",
      phone_number: "",
      phone_number_1: "",
      street_1: "",
      street_2: "",
      city: "",
      state: "",
      zipcode: ""
    },
    {
      first_name: 'Banner',
      last_name: "Brues",
      middle_name: "BB",
      suffix: [""],
      date_of_birth: [""],
      gender: [""],
      email: "",
      handedness: [""],
      is_primary_lanuguage_english: [""],
      primary_language: [""],
      certified_inpreted: [""],
      ssn: [""],
      phone_number: [""],
      phone_number_1: [""],
      street_1: [""],
      street_2: [""],
      city: [""],
      state: [""],
      zipcode: [""]
    }
  ];
  bodyParts = new FormControl();
  bodyPartsList = [];
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  intakeComType: string;
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService) {
    this.claimService.seedData('body_part').subscribe(res => {
      this.bodyPartsList = res.data;
    })
    this.claimService.getCallerAffliation().subscribe(res => {
      this.callerAffliation = res.data;
    })
    this.searchInput.valueChanges.subscribe(res => {
      if (res) {
        this.filteredStates = this._filterStates(res);
      } else {
        this.filteredStates = this.claimantList.slice()
      }
    })

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('language').subscribe(response => {
      this.languageList = response['data'];
    }, error => {
      console.log("error", error)
    })
  }

  advanceTabChanged(event) {
    this.searchStatus = false;
  }
  changeOption(option) {
    this.claimant.setValue(option)
  }
  private _filterStates(value: string) {
    console.log(value)
    const filterValue = value.toLowerCase();

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
      last_name: [''],
      first_name: [''],
      date_of_birth: [''],
      city: [""],
      zipcode: [""]
    })
    this.claimant = this.formBuilder.group({
      // last_name: ['', Validators.compose([Validators.required,Validators.pattern('[A-Za-z]+')])],
      // first_name: ['', Validators.compose([Validators.required,Validators.pattern('[A-Za-z]+')])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      middle_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      suffix: [""],
      // date_of_birth: ["",Validators.required],
      date_of_birth: ["", Validators.required],
      gender: [""],
      email: ["", Validators.compose([Validators.email])],
      handedness: [""],
      is_primary_lanuguage_english: [""],
      primary_language: [""],
      certified_inpreted: [""],
      ssn: [""],
      phone_number: [""],
      phone_number_1: [""],
      street_1: [""],
      street_2: [""],
      city: [""],
      state: [""],
      zipcode: [Number]
    })

    // this.claimForm = this.formBuilder.group({
    this.claim = this.formBuilder.group({
      claim_details: this.formBuilder.group({
        // wcab_number: ["", Validators.required],
        // claim_number: ["", Validators.required],
        wcab_number: [Number],
        claim_number: ["",],
        panel_number: [Number],
        claimant_id: ["1"]
      }),
      claim_injuries: [],
      InsuranceAdjuster: this.formBuilder.group({
        insurance_name: [""],
        name: [""],
        phone: [""],
        fax: [""],
        email: [""],
        address: [""],
      }),
      Employer: this.formBuilder.group({
        name: [""],
        phone: [""],
        address: [""],
        city: [""],
        state: [""],
        zipcode: [Number],
      }),
      ApplicantAttorney: this.formBuilder.group({
        law_firm_name: [""],
        attorney_name: [""],
        phone: [""],
        fax: [""],
        email: [""],
        address: [""],
        city: [""],
        state: [""],
        zipcode: [Number]
      }),
      DefenseAttorney: this.formBuilder.group({
        law_firm_name: [""],
        attorney_name: [""],
        phone: [""],
        fax: [""],
        email: [""],
        address: [""],
        city: [""],
        state: [""],
        zipcode: [Number]
      }),
      DEU: this.formBuilder.group({
        office_name: [""],
        phone: [""],
        address: [""]
      })
    })
    this.billable_item = this.formBuilder.group({
      exam_type: this.formBuilder.group({
        procudure_type: [""],
        modifiers: []
      }),
      appoinment: this.formBuilder.group({
        examinar: [""],
        date: [""],
        duration: [""],
        address: [""]
      }),
      intake_call_info: this.formBuilder.group({
        caller_affliation: [""],
        intake_caller: [""],
        communication_type: [""],
        communication_details: [""],
        call_time: [""],
        note: [""]
      })

    })
    // })
  }

  advanceSearchSubmit() {
    console.log("advanceSearch", this.advanceSearch.value)
  }
  selectionChange(event) {
    console.log("event", event)
    if (event.selectedIndex == 0) {
      this.titleName = "Create Claimant";
    } else if (event.selectedIndex == 1) {
      this.titleName = "Create Claim";
    } else if (event.selectedIndex == 2) {
      this.titleName = "Create Billable Item";
    }
  }

  submitClaim() {
    let claim = this.claim.value;
    claim['claim_injuries'] = this.injuryInfodata;
    // let data = { ...this.claimant.value, ...claim };
    // console.log("data", data);
    this.claimService.createClaim(claim).subscribe(res => {
      console.log("Response", res)
    })
  }
  cancle() {

  }
  addInjury() {
    this.injuryInfodata.push(this.injuryInfo)
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
    this.injuryInfo = { body_parts: "", date_of_injury: "", continuous_trauma: "", ct_start_date: "", ct_end_date: "", note: "", diagram_url: "" };
  }
  deleteInjury(data, index) {
    this.injuryInfodata.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.injuryInfodata)
  }
  editInjury(element, index) {
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
}

