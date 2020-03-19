import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
export interface Claimant {
  last_name: string;
  first_name: string;
  middle_name: string;
}
@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {
  step = 0;
  isLinear = true;
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
  claimantList = [
    {
      last_name: 'John',
      first_name: "Abraham",
      middle_name: "JA"
    },
    {
      last_name: 'Lee',
      first_name: "Brues",
      middle_name: "LB"

    },
    {
      last_name: 'Rajan',
      first_name: "Mariyappan",
      middle_name: "RM"
    },
    {
      first_name: 'Banner',
      last_name: "Brues",
      middle_name: "BB"
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimService) {
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
    // .pipe(
    //   startWith(''),
    //   map(claim => claim ? this._filterStates(claim) : this.claimantList.slice())
    // );
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
  changeOption(option) {
    this.claimant.setValue(option)
  }
  private _filterStates(value: string) {
    console.log(value)
    const filterValue = value.toLowerCase();

    return this.claimantList.filter(state => state.first_name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
    this.claimant = this.formBuilder.group({
      last_name: ["", Validators.required],
      first_name: ["", Validators.required],
      middle_name: ["", Validators.required],
    })
    // this.claimForm = this.formBuilder.group({
    this.claim = this.formBuilder.group({
      claim_id: ["", Validators.required],
      date_of_injury: ["", Validators.required],
      insurance: ["", Validators.required],
      injuries: ["", Validators.required],
      continuous_trauma: ["", Validators.required],
      ct_start_date: ["", Validators.required],
      ct_end_date: ["", Validators.required],
      panel_number: ["", Validators.required],
      wcab_number: ["", Validators.required],
      deu_office: ["", Validators.required]
    }),
      this.adjuster = this.formBuilder.group({
        adjuster: ["", Validators.required],
        adj_insurance: ["", Validators.required],
        adjuster_pone: ["", Validators.required],
        adjuste_fax: ["", Validators.required],
        adjuster_email: ["", Validators.required],
      }),
      this.employer = this.formBuilder.group({
        employer: ["", Validators.required],
        phone: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required],
      }),
      this.application_attorney = this.formBuilder.group({
        applicant_attorney: ["", Validators.required],
        phone: ["", Validators.required],
        fax: ["", Validators.required],
        email: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required]
      }),
      this.defance_attorney = this.formBuilder.group({
        defense_attorney: ["", Validators.required],
        phone: ["", Validators.required],
        fax: ["", Validators.required],
        email: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required]
      })
    this.billable_item = this.formBuilder.group({

    })
    // })
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
  submitClaim() {
    console.log("res", this.claimForm.value)
  }
  cancle(){
    
  }
}
