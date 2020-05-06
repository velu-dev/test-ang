import { Component, OnInit, Input, SimpleChange } from '@angular/core';
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
  @Input('save') isSave = false;
  DefanceAttorney: FormGroup;
  attroneylist = [];
  @Input('state') states;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DefanceAttorney = this.formBuilder.group({
      company_name: [],
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
      Object.keys(this.DefanceAttorney.controls).map(key => {
        this.DefanceAttorney.controls[key].enable()
      })
    }
    if (changes.isSave) {
      if (changes.isSave.currentValue)
        this.updateDAttorney()
    }
  }
  ngOnInit() {
    this.DefanceAttorney.patchValue(this.dattorneyDetail)
  }
  appAttorney(sdsd) {

  }
  updateDAttorney() {
    this.claimService.updateAgent(this.DefanceAttorney.value.id, { DefenseAttorney: this.DefanceAttorney.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Defence Attorney updated successfully", 'success');
      Object.keys(this.DefanceAttorney.controls).map(key => {
        this.DefanceAttorney.controls[key].disable()
      })
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancle() {
    Object.keys(this.DefanceAttorney.controls).map(key => {
      this.DefanceAttorney.controls[key].disable()
    })
  }
}
