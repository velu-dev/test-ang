import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
export const _filter = (opt: any[], value: string): string[] => {
  console.log("opt", opt);
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.company_name.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-claim-admin',
  templateUrl: './claim-admin.component.html',
  styleUrls: ['./claim-admin.component.scss']
})
export class ClaimAdminComponent implements OnInit {
  // @Input('edit') isEdit;
  claimAdminEdit = false;
  @Input('claim_admin') claimAdmin;
  @Input('fromPop') fromPop = false;
  // @Input('save') isSave = false;
  claimAdminForm: FormGroup;
  claimAdminList = []
  eamsClaimsAdministrator = [];
  claimAdminGroupOptions: any = [];
  CASelect = true;
  @Input('state') states;
  id: any;
  // @Output() isEditComplete = new EventEmitter();
  constructor(public dialogRef: MatDialogRef<ClaimAdminComponent>, public dialog: MatDialog, private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    // this.claimService.seedData('eams_claims_administrator').subscribe(res => {
    //   this.eamsClaimsAdministrator = res.data;
    //   this.claimAdminList = [{ name: "Simplexam Addresses", data: this.eamsClaimsAdministrator }];
    //   this.claimAdminGroupOptions = this.claimAdminForm.get('company_name')!.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filterAttroney(value, this.claimAdminList))
    //     );
    // })
    this.claimAdminForm = this.formBuilder.group({
      id: [],
      company_name: [{ value: null, disabled: true }],
      payor_id: [null],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
    this.claimAdminForm.get('company_name')!.valueChanges.subscribe(input => {
      if (input) {
        if (input.length >= 3 || input.length == 0) {
          this.claimService.searchEAMSAdmin({ search: input }).subscribe(res => {
            this.claimAdminGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
          })
        }
      }
    });
  }

  ngOnInit() {
    console.log(this.claimAdmin)
    if (this.fromPop) {
      this.dialogRef.disableClose = true;
      this.claimAdminForm.controls["company_name"].setValidators([Validators.required]);
      this.claimAdminForm.controls["street1"].setValidators([Validators.required]);
      this.claimAdminForm.controls["city"].setValidators([Validators.required]);
      this.claimAdminForm.controls["state"].setValidators([Validators.required]);
      this.claimAdminForm.controls["zip_code"].setValidators([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
      this.editCA();
    }
    if (this.fromPop) {
      this.claimAdmin.state = this.claimAdmin.state_name;
    }
    this.changeState(this.claimAdmin.state, this.claimAdmin.state_code);
    this.claimAdminForm.patchValue(this.claimAdmin)
    this.id = this.claimAdmin.id;
  }
  caState: any;
  changeState(state, state_code?) {
    console.log(state, state_code)
    if (state_code) {
      this.caState = state_code;
      return
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.caState = res.state_code;
      }
    })
  }
  appClaimAdmin(aa) {
    delete aa.id;
    this.changeState(aa.state)
    this.claimAdminForm.patchValue(aa)
  }
  private _filterAttroney(value: string, data) {
    if (value) {
      return data
        .map(group => ({ name: group.name, data: _filter(group.data, value) }))
        .filter(group => group.data.length > 0);
    }

    return data;
  }
  claimUpdated = false;
  updateClaimAdmin() {
    Object.keys(this.claimAdminForm.controls).forEach((key) => {
      if (this.claimAdminForm.get(key).value && typeof (this.claimAdminForm.get(key).value) == 'string')
        this.claimAdminForm.get(key).setValue(this.claimAdminForm.get(key).value.trim())
    });
    if (this.claimAdminForm.invalid) {
      return;
    }
    this.claimAdminForm.value['id'] = this.id;
    this.claimService.updateAgent(this.claimAdminForm.value.id, { InsuranceAdjuster: this.claimAdminForm.value }).subscribe(res => {
      this.claimAdminEdit = false;
      this.claimAdminForm.patchValue(res.data);
      this.claimAdmin = res.data;
      this.alertService.openSnackBar("Claim Administrator updated successfully", 'success');
      this.claimAdminForm.disable();
      this.claimUpdated = true;
      if (this.fromPop) {
        this.dialogRef.close(true);
        return
      }
      // this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  editCA() {
    this.claimAdminForm.enable();
    this.claimAdminEdit = true;
  }
  cancel() {
    if (this.fromPop) {
      this.dialogRef.close(false);
      return
    }
    this.claimAdminForm.disable();
    // this.isEditComplete.emit(true);
    this.claimAdminForm.patchValue(this.claimAdmin)
  }
  clearAutoComplete() {
    this.claimAdminForm.reset();
    this.caState = null;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
