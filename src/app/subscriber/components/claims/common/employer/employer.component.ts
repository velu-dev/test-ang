import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss']
})
export class EmployerComponent implements OnInit {
  @Input('edit') isEdit;
  @Input('employer') employerDetail;
  employer: FormGroup;
  employerList = [];
  @Input('state') states;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.employer = this.formBuilder.group({
      id: [],
      name: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: [''],
      phone: [''],
      email: [''],
      fax: [''],
    });
  }

  ngOnInit() {
    this.employer.patchValue(this.employerDetail)
  }
  updateEmployer() {
    this.claimService.updateAgent(this.employer.value.id, { Employer: this.employer.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Employer updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
}
