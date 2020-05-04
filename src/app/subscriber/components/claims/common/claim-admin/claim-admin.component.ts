import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-claim-admin',
  templateUrl: './claim-admin.component.html',
  styleUrls: ['./claim-admin.component.scss']
})
export class ClaimAdminComponent implements OnInit {
  @Input('edit') isEdit;
  claimAdminForm: FormGroup;
  claimAdminList = []
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.claimAdminForm = this.formBuilder.group({
      company_name: [''],
      name: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: [''],
      phone: [''],
      email: [''],
      fax: [''],
    });
  }
  appClaimAdmin(aa) {

  }

}
