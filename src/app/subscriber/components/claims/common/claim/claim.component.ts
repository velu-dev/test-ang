import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { IntercomService } from 'src/app/services/intercom.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  @Input('claim') claimDetail;
  @Input('state') states;
  @Input('is_billable_item_available') is_billable_item_available;
  @Output() examType: EventEmitter<any> = new EventEmitter<any>();

  isEdit = false;
  claim: FormGroup;
  examTypes = [];
  internalReferanceNumber: any;
  isClaimSubmited: boolean = false;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService,
    private alertService: AlertService,
    private intercom: IntercomService,
    private cookieService: CookieService
  ) {
    this.claim = this.formBuilder.group({
      id: [null],
      wcab_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.maxLength(18), Validators.pattern('^[a-zA-Z]{3}[0-9]{1,15}$')])],
      claim_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.maxLength(50), Validators.pattern('^(?!.*[-_]})(?=.*[a-zA-Z0-9]$)[a-zA-Z0-9][a-zA-Z0-9-]*$')])],
      panel_number: [{ value: null, disabled: !this.isEdit }, Validators.compose([Validators.pattern('[0-9]{0,9}'), Validators.maxLength(9)])],
      exam_type_id: [{ value: null, disabled: !this.isEdit }, Validators.required],
      claimant_id: [null]
    })
    this.claimService.seedData('exam_type').subscribe(res => {
      this.examTypes = res.data;
    })
  }

  ngOnInit() {
    this.internalReferanceNumber = this.claimDetail.internal_reference;
    console.log(this.is_billable_item_available)
    this.claim.patchValue(this.claimDetail);
  }
  editClick() {
    this.claim.enable();
    if (this.is_billable_item_available) {
      this.claim.get('exam_type_id').disable();
    } else {
      this.claim.get('exam_type_id').enable();
    }
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
      this.examType.emit(res.data.exam_type_id);
      if (this.claim.value.claim_number) {
        this.intercom.setClaimNumber(this.claim.value.claim_number);
        this.cookieService.set('claimNumber', this.claim.value.claim_number)
      } else {
        this.intercom.setClaimNumber('Claim');
      }

      this.isEdit = false;
      this.claim.patchValue(res.data)
      this.claim.disable();
      this.claimDetail = res.data;
      this.claimDetail.internal_reference = this.internalReferanceNumber;
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
