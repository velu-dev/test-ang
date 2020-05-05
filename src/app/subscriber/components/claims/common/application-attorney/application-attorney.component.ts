import { Component, OnInit, Input } from '@angular/core';
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
    this.ApplicantAttorney.patchValue(this.aattorneyDetail)
  }
  appAttorney(sdsd) {

  }
  updateAAttorney() {
    this.claimService.updateAgent(this.ApplicantAttorney.value.id, { ApplicantAttorney: this.ApplicantAttorney.value }).subscribe(res => {
      this.isEdit = false;
      this.aattorneyDetail = this.ApplicantAttorney.value
      this.alertService.openSnackBar("Application Attorney updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
}
