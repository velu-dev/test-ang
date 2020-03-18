import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  claimForm: FormGroup;
  errorMessages = errors;
  claim: any;
  adjuster: any;
  employer: any;
  application_attorney: any;
  defance_attorney: any;
  states = [
    {
      name: 'John'
    },
    {
      name: 'Lee'
    },
    {
      name: 'Rajan  '
    },
    {
      name: 'Venkat'
    }
  ];
  stateCtrl = new FormControl();

  filteredStates: Observable<any>;
  constructor(private formBuilder: FormBuilder) { 
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this._filterStates(state) : this.states.slice())
    );
  }
  private _filterStates(value: string) {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
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
    // })
  }
  submitClaim() {
    console.log("res", this.claimForm.value)

  }
}
