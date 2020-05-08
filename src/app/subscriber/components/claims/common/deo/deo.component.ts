import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
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
  @Output() isEditComplete = new EventEmitter();
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
      this.DEU.enable()
    } else {
      this.DEU.disable();
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
    if (this.DEU.invalid) {
      return;
    }
    this.claimService.updateAgent(this.DEU.value.id, { DEU: this.DEU.value }).subscribe(res => {
      this.isEdit = false;
      this.DEU.patchValue(res.data)
      this.alertService.openSnackBar("DEU updated successfully", 'success');
      this.DEU.disable();
      this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    this.DEU.disable();
    this.isEditComplete.emit(true);
    this.DEU.patchValue(this.deuDetail)
  }
}
