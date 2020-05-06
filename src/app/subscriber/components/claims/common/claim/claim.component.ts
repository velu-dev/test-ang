import { Component, OnInit, Input } from '@angular/core';
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
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claim = this.formBuilder.group({
      id: [null],
      wcab_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(15)])],
      claim_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      panel_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.pattern('[0-9]+')])],
      exam_type_id: [{value: null, disabled: !this.isEdit}, Validators.required],
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
    this.claim.controls['panel_number'].enable();
    this.claim.controls['exam_type_id'].enable();
    this.isEdit = !this.isEdit;
    this.claim.patchValue(this.claimDetail);
  }
  updateClaim() {
    this.claimService.updateClaim(this.claim.value, this.claim.value.id).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Claim updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
}
