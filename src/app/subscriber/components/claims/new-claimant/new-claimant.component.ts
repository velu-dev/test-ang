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
  constructor(
    private claimService: ClaimService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    this.claimantForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      suffix: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      date_of_birth: [''],
      gender: ['', Validators.required],
      caller_affiliation: ['', Validators.required],
      phone_no_1: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9_-]{10}")])],
      phone_no_2: ['',Validators.compose([Validators.required, Validators.pattern("^[0-9_-]{10}")])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      street1: ['', Validators.required],
      language: ['', Validators.required],
      street2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', Validators.required],
      handedness: ['', Validators.required],
    });
  }
  isSubmit = false;
  submitClaim() {
    
   
    this.isSubmit = true;
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
