import { Component, OnInit, Input } from '@angular/core';
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
  claimAdminForm: FormGroup;
  claimAdminList = []
  @Input('state') states;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claimAdminForm = this.formBuilder.group({
      id: [],
      company_name: [''],
      name: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: [''],
      phone: [''],
      email: [''],
      fax: [null],
    });
  }

  ngOnInit() {
    console.log(this.claimAdmin)
    this.claimAdminForm.patchValue(this.claimAdmin)
  }
  appClaimAdmin(aa) {

  }
  updateClaimAdmin() {
    this.claimService.updateAgent(this.claimAdminForm.value.id, { InsuranceAdjuster: this.claimAdminForm.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("Claim Administrator updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }

}
