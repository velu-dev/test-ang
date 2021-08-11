import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
export const _filter = (opt: any[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.company_name.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-defense-attorney',
  templateUrl: './defense-attorney.component.html',
  styleUrls: ['./defense-attorney.component.scss']
})
export class DefenseAttorneyComponent implements OnInit {
  // @Input('edit') isEdit;
  daEdit = false;
  @Input('dattroney') dattorneyDetail;
  @Input('fromPop') fromPop = false;
  // @Input('save') isSave = false;
  DefanceAttorney: FormGroup;
  attroneylist = [];
  @Input('state') states;
  eamsRepresentatives = [];
  dattroneyGroupOptions: any = [];
  DattroneySelect = true;
  id: any;
  streetDAAddressList = [];
  isDAAddressError = false;
  isDAAddressSearched = false;
  constructor(public dialogRef: MatDialogRef<DefenseAttorneyComponent>, public dialog: MatDialog, private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claimService.seedData("state").subscribe(res => {
      this.states = res.data;
    })
    this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
      this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
    })
    // this.claimService.searchEAMSAttorney('eams_representatives').subscribe(res => {
    //   this.eamsRepresentatives = res.data;
    //   this.attroneylist = [{ name: "Simplexam Addresses", data: this.eamsRepresentatives }];
    //   this.dattroneyGroupOptions = this.DefanceAttorney.get('company_name')!.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filterAttroney(value, this.attroneylist))
    //     );
    // })
    this.DefanceAttorney = this.formBuilder.group({
      company_name: [{ value: null, disabled: true }, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
      id: [],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
    this.DefanceAttorney.get('phone')!.valueChanges.subscribe(input => {
      if (this.daEdit)
        if (this.DefanceAttorney.get("phone").value && this.DefanceAttorney.get("phone").valid) {
          this.DefanceAttorney.get("phone_ext").enable();
        } else {
          this.DefanceAttorney.get("phone_ext").reset();
          this.DefanceAttorney.get("phone_ext").disable();
        }
    })
    this.DefanceAttorney.get('company_name')!.valueChanges.subscribe(input => {
      if (this.DefanceAttorney.get('company_name').errors) {
        return
      } else {
        if (input) {
          if (input.length >= 3 || input.length == 0) {
            this.claimService.searchEAMSAttorney({ search: input }).subscribe(res => {
              this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
            })
          }
        } else {
          this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
            this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
          })
        }
      }
    });
    this.DefanceAttorney.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isDAAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetDAAddressList = address.suggestions;
            this.isDAAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isDAAddressError = true;
            this.streetDAAddressList = [];
          })
        else
          this.streetDAAddressList = [];
      })
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.state;
      }
    })

    this.DefanceAttorney.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  private _filterAttroney(value: string, data) {
    if (value) {
      return data
        .map(group => ({ name: group.name, data: _filter(group.data, value) }))
        .filter(group => group.data.length > 0);
    }

    return data;
  }
  ngOnInit() {
    if (this.fromPop) {
      this.dialogRef.disableClose = true;
      this.DefanceAttorney.controls["company_name"].setValidators([Validators.required]);
      this.DefanceAttorney.controls["street1"].setValidators([Validators.required]);
      this.DefanceAttorney.controls["city"].setValidators([Validators.required]);
      this.DefanceAttorney.controls["state"].setValidators([Validators.required]);
      this.DefanceAttorney.controls["zip_code"].setValidators([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
      this.editDA();
    }
    if (this.fromPop) {
      this.dattorneyDetail.state = this.dattorneyDetail.state_name;
    }
    // console.log(this.dattorneyDetail)
    this.changeState(this.dattorneyDetail.state, this.dattorneyDetail.state_code);
    this.DefanceAttorney.patchValue(this.dattorneyDetail);
    this.id = this.dattorneyDetail.id;
  }
  daState: any;
  changeState(state, state_code?) {
    // console.log(state_code);
    if (state_code) {
      this.daState = state_code;
      return
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.daState = res.state_code;
      }
    })
  }
  getDA(value) {
    this.dattroneyGroupOptions.map(group => {
      group.data.map(res => {
        if (res.company_name == value) {
          this.defAttornety(res)
        }
      })
    })
  }
  defAttornety(da) {
    delete da.id;
    da.phone = this.claimService.removeFormat(da.phone)
    this.DefanceAttorney.reset();
    this.DefanceAttorney.patchValue(da)
    this.changeState(da.state);
  }
  editDA() {
    this.daEdit = true;
    this.DefanceAttorney.enable();
    if (this.DefanceAttorney.get("phone").value && this.DefanceAttorney.get("phone").valid) {
      this.DefanceAttorney.get("phone_ext").enable();
    } else {
      this.DefanceAttorney.get("phone_ext").reset();
      this.DefanceAttorney.get("phone_ext").disable();
    }
  }
  updateDAttorney() {
    Object.keys(this.DefanceAttorney.controls).forEach((key) => {
      if (this.DefanceAttorney.get(key).value && typeof (this.DefanceAttorney.get(key).value) == 'string')
        this.DefanceAttorney.get(key).setValue(this.DefanceAttorney.get(key).value.trim())
    });
    if (this.DefanceAttorney.invalid) {
      return;
    }
    this.DefanceAttorney.value['id'] = this.id;
    this.claimService.updateAgent(this.DefanceAttorney.value.id, { DefenseAttorney: this.DefanceAttorney.value }).subscribe(res => {
      this.daEdit = false;
      this.DefanceAttorney.patchValue(this.DefanceAttorney.value);
      this.dattorneyDetail = this.DefanceAttorney.value;
      this.alertService.openSnackBar("Defense Attorney updated successfully", 'success');
      this.DefanceAttorney.disable();
      if (this.fromPop) {
        this.dialogRef.close(true);
        return
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    if (this.fromPop) {
      this.dialogRef.close(false);
      return
    }
    this.DefanceAttorney.disable();
    // this.isEditComplete.emit(true);
    this.DefanceAttorney.patchValue(this.dattorneyDetail);
    this.changeState(this.dattorneyDetail.state, this.dattorneyDetail.state_code);
  }
  clearAutoComplete() {
    this.DefanceAttorney.reset();
    this.daState = null;
    this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
      this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
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
