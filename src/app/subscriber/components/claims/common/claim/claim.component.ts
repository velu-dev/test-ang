import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  @Input('claim') claimDetail;
  @Input('state') states;
  isEdit = false;
  claim: FormGroup;
  examTypes = [];
  isClaimSubmited: boolean = false;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claim = this.formBuilder.group({
      id: [null],
      wcab_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.maxLength(18), Validators.pattern('^[a-zA-Z]{3}[0-9]{1,15}$')])],
      claim_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.pattern('[0-9]{0,25}')])],
      panel_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.pattern('[0-9]{9}')])],
      exam_type_id: [{ value: null, disabled: !this.isEdit }, Validators.required],
      claimant_id: [null]
    })
    this.claimService.seedData('exam_type').subscribe(res => {
      this.examTypes = res.data;
    })
  }

  ngOnInit() {
    this.claim.patchValue(this.claimDetail);
  }
  editClick() {
    this.claim.enable();
    this.isEdit = !this.isEdit;
    this.claim.patchValue(this.claimDetail);
  }
  updateClaim() {
    if (!this.claim.touched) {
      return
    }
    Object.keys(this.claim.controls).forEach((key) => {
      if (this.claim.get(key).value && typeof (this.claim.get(key).value) == 'string')
        this.claim.get(key).setValue(this.claim.get(key).value.trim())
    });
    this.isClaimSubmited = true;
    if (this.claim.invalid) {
      return;
    }
    this.claimService.updateClaim(this.claim.value, this.claim.value.id).subscribe(res => {
      this.isEdit = false;
      this.claim.patchValue(res.data)
      this.claim.disable();
      this.claimDetail = res.data;
      this.alertService.openSnackBar("Claim updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error");
    })
  }
  cancel() {
    this.claim.disable();
    this.claim.patchValue(this.claimDetail)
  }
}
