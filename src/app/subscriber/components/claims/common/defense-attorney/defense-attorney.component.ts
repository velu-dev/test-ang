import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  @Output() isEditComplete = new EventEmitter();
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DefanceAttorney = this.formBuilder.group({
      company_name: [{ value: null, disabled: true }],
      id: [],
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
      this.DefanceAttorney.enable()
    } else {
      this.DefanceAttorney.disable();
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
    if (this.DefanceAttorney.invalid) {
      return;
    }
    this.claimService.updateAgent(this.DefanceAttorney.value.id, { DefenseAttorney: this.DefanceAttorney.value }).subscribe(res => {
      this.isEdit = false;
      this.DefanceAttorney.patchValue(res.data);
      this.alertService.openSnackBar("Defence Attorney updated successfully", 'success');
      this.DefanceAttorney.disable();
      this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    this.DefanceAttorney.disable();
    this.isEditComplete.emit(true);
    this.DefanceAttorney.patchValue(this.dattorneyDetail)
  }
}
