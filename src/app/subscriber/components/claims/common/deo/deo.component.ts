import { Component, OnInit, Input } from '@angular/core';
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
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DEU = this.formBuilder.group({
      id: [null],
      name: [null],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null],
      phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [null, Validators.compose([Validators.email])],
      fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
    });
  }

  ngOnInit() {
    this.DEU.patchValue(this.deuDetail)
  }
  appAttorney(sdsd) {

  }
  updateDEU() {
    this.claimService.updateAgent(this.DEU.value.id, { DEU: this.DEU.value }).subscribe(res => {
      this.isEdit = false;
      this.alertService.openSnackBar("DEU updated successfully", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }

}
