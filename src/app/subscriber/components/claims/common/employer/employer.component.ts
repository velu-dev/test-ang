import { Component, OnInit, Input, SimpleChange } from '@angular/core';
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
  @Input('save') isSave = false;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.employer = this.formBuilder.group({
      id: [],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }],
      phone: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      fax: [{ value: null, disabled: true }],
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.isEdit)
      this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      Object.keys(this.employer.controls).map(key => {
        this.employer.controls[key].enable()
      })
    }
    if (changes.isSave) {
      if (changes.isSave.currentValue)
        this.updateEmployer()
    }
  }
  ngOnInit() {
    this.employer.patchValue(this.employerDetail)
  }
  updateEmployer() {
    this.claimService.updateAgent(this.employer.value.id, { Employer: this.employer.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Employer updated successfully", 'success');
      Object.keys(this.employer.controls).map(key => {
        this.employer.controls[key].disable()
      })
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancle() {
    Object.keys(this.employer.controls).map(key => {
      this.employer.controls[key].disable()
    })
  }
}
