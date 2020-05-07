import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-claim-admin',
  templateUrl: './claim-admin.component.html',
  styleUrls: ['./claim-admin.component.scss']
})
export class ClaimAdminComponent implements OnInit {
  @Input('edit') isEdit;
  @Input('claim_admin') claimAdmin;
  @Input('save') isSave = false;
  claimAdminForm: FormGroup;
  claimAdminList = []
  @Input('state') states;
  @Output() isEditComplete = new EventEmitter();
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claimAdminForm = this.formBuilder.group({
      id: [],
      company_name: [{ value: null, disabled: true }],
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

  ngOnInit() {
    this.claimAdminForm.patchValue(this.claimAdmin)
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.isEdit)
      this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      this.claimAdminForm.enable();
    }
    if (changes.isSave) {
      if (changes.isSave.currentValue)
        this.updateClaimAdmin()
    }
  }
  appClaimAdmin(aa) {

  }
  claimUpdated = false;
  updateClaimAdmin() {
    this.claimService.updateAgent(this.claimAdminForm.value.id, { InsuranceAdjuster: this.claimAdminForm.value }).subscribe(res => {
      this.isEdit = false;
      this.claimAdminForm.patchValue(res.data)
      this.alertService.openSnackBar("Claim Administrator updated successfully", 'success');
      this.claimAdminForm.disable();
      this.claimUpdated = true;
      this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancle() {
    this.claimAdminForm.disable();
    this.isEditComplete.emit(true);
    this.claimAdminForm.patchValue(this.claimAdmin)
  }
}