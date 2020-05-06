import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  ApplicantAttorney: FormGroup;
  attroneylist = [];
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.ApplicantAttorney = this.formBuilder.group({
      id: [],
      company_name: [],
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
    this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      Object.keys(this.ApplicantAttorney.controls).map(key => {
        this.ApplicantAttorney.controls[key].enable()
      })
    }
  }
  ngOnInit() {
    this.ApplicantAttorney.patchValue(this.aattorneyDetail)
  }
  appAttorney(sdsd) {

  }
  updateAAttorney() {
    this.claimService.updateAgent(this.ApplicantAttorney.value.id, { ApplicantAttorney: this.ApplicantAttorney.value }).subscribe(res => {
      this.isEdit = false;
      this.aattorneyDetail = this.ApplicantAttorney.value;
      Object.keys(this.ApplicantAttorney.controls).map(key => {
        this.ApplicantAttorney.controls[key].disable()
      })
      this.alertService.openSnackBar("Application Attorney updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
}
