import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-new-claimant',
  templateUrl: './new-claimant.component.html',
  styleUrls: ['./new-claimant.component.scss']
})
export class NewClaimantComponent implements OnInit {
  claimantForm: FormGroup;
  errorMessages = errors;
  languageStatus: boolean = false;
  states: any;
  languageList: any;
  certifiedStatusYes: boolean = false;
  certifiedStatusNo: boolean = false;
  isClaimantSubmited:boolean = false;
  constructor(
    private claimService: ClaimService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    this.claimantForm = this.formBuilder.group({
      id: [""],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      suffix: [null],
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
      salutation: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      created_by: [null],
      modified_by: [null],
      createdAt: [null],
      updatedAt: [null]
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
  createClaimant() {
    console.log("claimantForm", this.claimantForm)

    this.isClaimantSubmited = true;
    if (this.claimantForm.invalid) {
      console.log("claimantForm", this.claimantForm)
      return;
    }
    //this.claimantForm.value.date_of_birth = moment(this.claimantForm.value.date_of_birth).format("MM-DD-YYYY")
    this.claimService.createClaim(this.claimantForm.value).subscribe(res => {
      this.alertService.openSnackBar("User updated successful", 'success');
      this._location.back();
    }, error => {
      this.alertService.openSnackBar(error.error, 'error');
    })
  }
  cancle() {
    this._location.back();
  }
}
