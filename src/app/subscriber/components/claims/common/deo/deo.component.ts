import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-deo',
  templateUrl: './deo.component.html',
  styleUrls: ['./deo.component.scss']
})
export class DeoComponent implements OnInit {
  @Input('edit') isEdit;
  @Input('deu') deuDetail;
  DEU: FormGroup;
  attroneylist = [];
  @Input('state') states;
  @Input('save') isSave = false;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DEU = this.formBuilder.group({
      id: [null],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.isEdit)
      this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      Object.keys(this.DEU.controls).map(key => {
        this.DEU.controls[key].enable()
      })
    }
    if (changes.isSave) {
      if (changes.isSave.currentValue)
        this.updateDEU()
    }
  }
  ngOnInit() {
    this.DEU.patchValue(this.deuDetail)
  }
  appAttorney(sdsd) {

  }
  updateDEU() {
    this.claimService.updateAgent(this.DEU.value.id, { DEU: this.DEU.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("DEU updated successfully", 'success');
      Object.keys(this.DEU.controls).map(key => {
        this.DEU.controls[key].disable()
      })
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancle() {
    Object.keys(this.DEU.controls).map(key => {
      this.DEU.controls[key].disable()
    })
  }
}
