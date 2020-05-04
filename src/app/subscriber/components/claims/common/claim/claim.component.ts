import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  @Input('claim') claimDetail;
  isEdit = false;
  claim: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.claim = this.formBuilder.group({
      id: [null],
      wcab_number: [{ value: null, disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(15)])],
      claim_number: [{ value: null, disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      panel_number: [{ value: null, disabled: this.isEdit }, Validators.compose([Validators.pattern('[0-9]+')])],
      exam_type_id: [null, Validators.required],
      claimant_id: [null]
    })
  }

  ngOnInit() {

  }
  editClick() {
    this.isEdit = !this.isEdit;
    this.claim.patchValue(this.claimDetail);
  }

}
