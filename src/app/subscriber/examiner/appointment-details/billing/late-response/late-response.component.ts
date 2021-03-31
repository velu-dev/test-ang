import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BillingService } from 'src/app/subscriber/service/billing.service';

@Component({
  selector: 'app-late-response',
  templateUrl: './late-response.component.html',
  styleUrls: ['./late-response.component.scss']
})
export class LateResponseComponent implements OnInit {
  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() billType: number;

  billStatusList = [];
  lateResData: any;
  lateForm: FormGroup;
  constructor(public billingService: BillingService, private fb: FormBuilder) {
    this.lateForm = this.fb.group({
      lateRes: this.fb.array([]),
    })
  }

  ngOnInit() {
    this.getLateRes();
    this.getLateResStatus();
  }

  newLateRes(): FormGroup {
    return this.fb.group({
      id: [],
      bill_status_id: [],
      bill_other_status: [],
      late_payment_response_notes: [],
      is_void_response: [],
      created_by: [],
      updated_by: [],
      updatedAt: [],
      createdAt: [],
      showStatus: [true],
      previous_response_id: []
    })
  }

  lateRes(): FormArray {
    return this.lateForm.get("lateRes") as FormArray;
  }

  addlateRes() {
    this.lateRes().push(this.newLateRes());
  }

  copyedit(group, index) {
    this.addlateRes();
    this.lateRes().at(index + 1).patchValue(group.value)
    this.lateRes().at(index + 1).get('showStatus').patchValue(true)

    console.log(this.lateRes().at(index + 1))
  }

  getLateRes() {
    this.billingService.getLateResponse(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, +this.billType + 1).subscribe(late => {
      console.log(late)
      this.lateResData = late.data;
      if (this.lateResData && this.lateResData.late_response_details.length > 0) {
        this.lateResData.late_response_details.map((lateData, i) => {
          this.addlateRes();
          this.lateRes().at(i).patchValue(lateData)
          this.lateRes().at(i).get('showStatus').patchValue(false)
        })

      }
    }, error => {
      console.log(error)
    })
  }

  getLateResStatus() {


    this.billingService.getLateResBillStatus(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, +this.billType + 1).subscribe(lateStatus => {
      console.log(lateStatus)
      this.billStatusList = lateStatus.data;
    }, error => {
      console.log(error)
    })
  }

  submitLateRes(group, index) {
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    let details = {
      bill_status_id: group.get('bill_status_id').value,
      bill_other_status: group.get('bill_other_status').value,
      late_payment_response_notes: group.get('late_payment_response_notes').value,
      previous_response_id: group.get('previous_response_id').value
    }
    this.billingService.postLateResponse(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, details).subscribe(lateRes => {
      console.log(lateRes);
      group.get('showStatus').patchValue(false)
    }, error => {
      console.log(error)
    })
  }
}
