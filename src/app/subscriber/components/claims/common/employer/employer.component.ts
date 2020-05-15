import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
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
  @Output() isEditComplete = new EventEmitter();
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.employer = this.formBuilder.group({
      id: [],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true },Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.isEdit)
      this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      this.employer.enable();
    } else {
      this.employer.disable();
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
    Object.keys(this.employer.controls).forEach((key) => {
      if(this.employer.get(key).value && typeof(this.employer.get(key).value) == 'string')
      this.employer.get(key).setValue(this.employer.get(key).value.trim())
    });
    if (this.employer.invalid) {
      return;
    }
    this.claimService.updateAgent(this.employer.value.id, { Employer: this.employer.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Employer updated successfully", 'success');
      this.employer.disable();
      this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    this.isEditComplete.emit(true);
    this.employer.disable();
    this.employer.patchValue(this.employerDetail)
  }
}
