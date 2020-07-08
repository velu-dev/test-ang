import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-application-attorney',
  templateUrl: './application-attorney.component.html',
  styleUrls: ['./application-attorney.component.scss']
})
export class ApplicationAttorneyComponent implements OnInit {
  @Input('edit') isEdit;
  @Input('aattorney') aattorneyDetail;
  @Input('state') states;
  @Input('save') isSave;
  ApplicantAttorney: FormGroup;
  attroneylist = [];
  @Output() isEditComplete = new EventEmitter();
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.ApplicantAttorney = this.formBuilder.group({
      id: [],
      company_name: [{ value: null, disabled: true }],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.isSave) {
      if (changes.isSave.currentValue)
        this.updateAAttorney()
    }
    if (changes.isEdit)
      this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      this.ApplicantAttorney.enable();
    } else {
      this.ApplicantAttorney.disable();
    }

  }
  ngOnInit() {
    this.ApplicantAttorney.patchValue(this.aattorneyDetail)
  }
  appAttorney(sdsd) {

  }
  updateAAttorney() {
    Object.keys(this.ApplicantAttorney.controls).forEach((key) => {
      if (this.ApplicantAttorney.get(key).value && typeof (this.ApplicantAttorney.get(key).value) == 'string')
        this.ApplicantAttorney.get(key).setValue(this.ApplicantAttorney.get(key).value.trim())
    });
    if (this.ApplicantAttorney.invalid) {
      return;
    }
    this.claimService.updateAgent(this.ApplicantAttorney.value.id, { ApplicantAttorney: this.ApplicantAttorney.value }).subscribe(res => {
      this.isEdit = false;
      this.ApplicantAttorney.patchValue(res.data);
      this.ApplicantAttorney.disable();
      this.isEditComplete.emit(true);
      this.alertService.openSnackBar("Application Attorney updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    this.isEditComplete.emit(true);
    this.ApplicantAttorney.disable();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
