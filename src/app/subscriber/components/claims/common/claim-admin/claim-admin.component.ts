import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EMAIL_REGEXP } from 'src/app/globals';
export const _filter = (opt: any[], value: string): string[] => {
  // console.log("opt", opt);
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
  streetCAAddressList = [];
  isCAAddressError = false;
  isCAAddressSearched = false;
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
    this.claimService.searchEAMSAdmin({ search: "" }).subscribe(res => {
      this.claimAdminGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
    })
    this.claimAdminForm = this.formBuilder.group({
      id: [],
      company_name: [{ value: null, disabled: true }, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
      payor_id: [null],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern(EMAIL_REGEXP)])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
    this.claimAdminForm.get('phone')!.valueChanges.subscribe(input => {
      if (this.claimAdminEdit)
        if (this.claimAdminForm.get("phone").value && this.claimAdminForm.get("phone").valid) {
          this.claimAdminForm.get("phone_ext").enable();
        } else {
          this.claimAdminForm.get("phone_ext").reset();
          this.claimAdminForm.get("phone_ext").disable();
        }
    })
    this.claimAdminForm.get('company_name')!.valueChanges.subscribe(input => {
      if (this.claimAdminForm.get('company_name').errors) {
        return
      } else {
        if (input) {
          if (input.length >= 3 || input.length == 0) {
            this.claimService.searchEAMSAdmin({ search: input }).subscribe(res => {
              if (res.data) {
                this.claimAdminGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
              } else {
                this.claimAdminForm.patchValue({
                  payor_id: null
                })
              }
            })
          }
        } else {
          this.claimService.searchEAMSAdmin({ search: "" }).subscribe(res => {
            this.claimAdminGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
          })
        }
      }
    });
    this.claimAdminForm.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isCAAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetCAAddressList = address.suggestions;
            this.isCAAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isCAAddressError = true;
            this.streetCAAddressList = [];
          })
        else
          this.streetCAAddressList = [];
      })
  }

  ngOnInit() {
    // console.log(this.claimAdmin)
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
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.state;
      }
    })

    this.claimAdminForm.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  caState: any;
  changeState(state, state_code?) {
    // console.log(state, state_code)
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
  getCA(value) {
    this.claimAdminGroupOptions.map(group => {
      group.data.map(res => {
        if (res.company_name == value) {
          this.appClaimAdmin(res)
        }
      })
    })
  }
  appClaimAdmin(aa) {
    delete aa.id;
    this.claimAdminForm.reset();
    this.claimAdminForm.patchValue(aa)
    this.changeState(aa.state);
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
      this.claimAdminForm.patchValue(this.claimAdminForm.value);
      this.claimAdmin = this.claimAdminForm.value;
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
    if (this.claimAdminForm.get("phone").value && this.claimAdminForm.get("phone").valid) {
      this.claimAdminForm.get("phone_ext").enable();
    } else {
      this.claimAdminForm.get("phone_ext").reset();
      this.claimAdminForm.get("phone_ext").disable();
    }
  }
  cancel() {
    if (this.fromPop) {
      this.dialogRef.close(false);
      return
    }
    this.claimAdminForm.disable();
    // this.isEditComplete.emit(true);
    this.changeState(this.claimAdmin.state, this.claimAdmin.state_code);
    this.claimAdminForm.patchValue(this.claimAdmin)
  }
  clearAutoComplete() {
    this.claimAdminForm.reset();
    this.caState = null;
    this.claimService.searchEAMSAdmin({ search: "" }).subscribe(res => {
      this.claimAdminGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
    })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
