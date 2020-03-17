import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {
  claimForm: FormGroup;
  errorMessages = errors;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.claimForm = this.formBuilder.group({
      claim: this.formBuilder.group({
        claim_id: [Validators.required],
        date_of_injury: [Validators.required],
        insurance: [Validators.required],
        injuries: [Validators.required],
        continuous_trauma: [Validators.required],
        ct_start_date: [Validators.required],
        ct_end_date: [Validators.required],
        panel_number: [Validators.required],
        wcab_number: [Validators.required],
        deu_office: [Validators.required]
      }),
      adjuster: this.formBuilder.group({
        adjuster: [Validators.required],
        adj_insurance: [Validators.required],
        adjuster_pone: [Validators.required],
        adjuste_fax: [Validators.required],
        adjuster_email: [Validators.required],
      }),
      employer: this.formBuilder.group({
        employer: [Validators.required],
        employer_phone: [Validators.required],
        employer_address: [Validators.required],
        employer_city: [Validators.required],
        employer_state: [Validators.required],
        employer_zip: [Validators.required],
      }),
      attorney: this.formBuilder.group({
        applicant_attorney: [Validators.required],
        aa_phone: [Validators.required],
        aa_fax: [Validators.required],
        aa_email: [Validators.required],
        aa_address: [Validators.required],
        aa_aity: [Validators.required],
        aa_state: [Validators.required],
        aa_zip: [Validators.required],
        defense_attorney: [Validators.required],
        da_phone: [Validators.required],
        da_fax: [Validators.required],
        da_email: [Validators.required],
        da_address: [Validators.required],
        da_city: [Validators.required],
        da_state: [Validators.required],
        da_zip: [Validators.required]
      })
    })
  }
  submitClaim() {
    console.log("res", this.claimForm.value)

  }
}
