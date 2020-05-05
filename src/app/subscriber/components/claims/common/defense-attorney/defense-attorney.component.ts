import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-defense-attorney',
  templateUrl: './defense-attorney.component.html',
  styleUrls: ['./defense-attorney.component.scss']
})
export class DefenseAttorneyComponent implements OnInit {
  @Input('edit') isEdit;
  @Input('dattroney') dattorneyDetail;
  DefanceAttorney: FormGroup;
  attroneylist = [];
  @Input('state') states;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DefanceAttorney = this.formBuilder.group({
      company_name: [],
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
    this.DefanceAttorney.patchValue(this.dattorneyDetail)
  }
  appAttorney(sdsd) {

  }
  updateDAttorney() {
    this.claimService.updateAgent(this.DefanceAttorney.value.id, { DefenseAttorney: this.DefanceAttorney.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Defence Attorney updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
}
