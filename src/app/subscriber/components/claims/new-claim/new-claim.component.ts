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
      adjuster: this.formBuilder.group({
        adjuster: ["", Validators.required],
        adj_insurance: ["", Validators.required],
        adjuster_pone: ["", Validators.required],
        adjuste_fax: ["", Validators.required],
        adjuster_email: ["", Validators.required],
      }),
      employer: this.formBuilder.group({
        employer: ["", Validators.required],
        phone: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required],
      }),
      application_attorney: this.formBuilder.group({
        applicant_attorney: ["", Validators.required],
        phone: ["", Validators.required],
        fax: ["", Validators.required],
        email: ["", Validators.required],
        address: ["", Validators.required],
        aity: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required]
      }),
      defance_attorney: this.formBuilder.group({
        defense_attorney: ["", Validators.required],
        phone: ["", Validators.required],
        fax: ["", Validators.required],
        email: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zip: ["", Validators.required]
      })
    })
  }
  submitClaim() {
    console.log("res", this.claimForm.value)

  }
}
