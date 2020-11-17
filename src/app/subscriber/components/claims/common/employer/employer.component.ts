import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatDialog } from '@angular/material';
import { stat } from 'fs';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss']
})
export class EmployerComponent implements OnInit {
  // @Input('edit') isEdit;
  @Input('fromPop') fromPop = false;
  @Input('employer') employerDetail;
  employer: FormGroup;
  employerList = [];
  @Input('state') states;
  employerEdit = false;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.employer = this.formBuilder.group({
      id: [],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
  }
  ngOnInit() {
    if (this.fromPop) {
      this.editEmployer();
    }
    if (this.fromPop) {
      this.employerDetail.state = this.employerDetail.state_name;
    }
    this.changeState(this.employerDetail.state, this.employerDetail.state_code)
    this.employer.patchValue(this.employerDetail)
  }
  empState: any;
  changeState(state, state_code?) {
    if (state_code) {
      this.empState = state_code;
      return
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.empState = res.state_code;
      }
    })
  }
  updateEmployer() {
    Object.keys(this.employer.controls).forEach((key) => {
      if (this.employer.get(key).value && typeof (this.employer.get(key).value) == 'string')
        this.employer.get(key).setValue(this.employer.get(key).value.trim())
    });
    if (this.employer.invalid) {
      return;
    }
    this.claimService.updateAgent(this.employer.value.id, { Employer: this.employer.value }).subscribe(res => {
      // this.isEdit = false;
      this.alertService.openSnackBar("Employer updated successfully", 'success');
      this.employer.disable();
      this.employerEdit = false;
      this.employer.patchValue(res.data);
      this.employerDetail = res.data;
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  editEmployer() {
    this.employerEdit = true;
    this.employer.enable();
  }
  cancel() {
    if (this.fromPop) {
      this.dialog.closeAll();
      return
    }
    this.employer.disable();
    this.employer.patchValue(this.employerDetail)
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
