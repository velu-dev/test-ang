import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatDialog } from '@angular/material';
import { stat } from 'fs';
import { debounceTime } from 'rxjs/operators';

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
  id: any;
  streetEmpAddressList = [];
  isEmpAddressError = false;
  isEmpAddressSearched = false;
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
      phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
    this.employer.get('phone')!.valueChanges.subscribe(input => {
      if (this.employerEdit)
        if (this.employer.get("phone").value && this.employer.get("phone").valid) {
          this.employer.get("phone_ext").enable();
        } else {
          this.employer.get("phone_ext").reset();
          this.employer.get("phone_ext").disable();
        }
    })
    this.employer.get('street1').valueChanges
    .pipe(
      debounceTime(500),
    ).subscribe(key => {
      if (key && typeof (key) == 'string')
        key = key.trim();
      this.isEmpAddressSearched = true;
      if (key)
        this.claimService.searchAddress(key).subscribe(address => {
          this.streetEmpAddressList = address.suggestions;
          this.isEmpAddressError = false;
        }, error => {
          if (error.status == 0)
            this.isEmpAddressError = true;
          this.streetEmpAddressList = [];
        })
    })
    
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })

    this.employer.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
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
    this.id = this.employerDetail.id;
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
  clearAutoComplete() {
    this.employer.reset();
    this.empState = null;
  }
  updateEmployer() {
    Object.keys(this.employer.controls).forEach((key) => {
      if (this.employer.get(key).value && typeof (this.employer.get(key).value) == 'string')
        this.employer.get(key).setValue(this.employer.get(key).value.trim())
    });
    if (this.employer.invalid) {
      return;
    }
    this.employer.value['id'] = this.id;
    this.claimService.updateAgent(this.employer.value.id, { Employer: this.employer.value }).subscribe(res => {
      // this.isEdit = false;
      this.alertService.openSnackBar("Employer updated successfully", 'success');
      this.employerEdit = false;
      console.log()
      this.employer.patchValue(this.employer.getRawValue());
      this.employerDetail = this.employer.value;
      this.employer.disable();
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  editEmployer() {
    this.employerEdit = true;
    this.employer.enable();
    if (this.employer.get("phone").value && this.employer.get("phone").valid) {
      this.employer.get("phone_ext").enable();
    } else {
      this.employer.get("phone_ext").reset();
      this.employer.get("phone_ext").disable();
    }
  }
  cancel() {
    if (this.fromPop) {
      this.dialog.closeAll();
      return
    }
    this.employer.disable();
    this.changeState(this.employerDetail.state, this.employerDetail.state_code);
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
