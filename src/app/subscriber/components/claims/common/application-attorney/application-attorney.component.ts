import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable, Subject } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { IntercomService } from 'src/app/services/intercom.service';
import { EMAIL_REGEXP } from 'src/app/globals';
export const _filter = (opt: any[], value: string): string[] => {
  // console.log("opt", opt);
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.company_name.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-application-attorney',
  templateUrl: './application-attorney.component.html',
  styleUrls: ['./application-attorney.component.scss']
})
export class ApplicationAttorneyComponent implements OnInit {
  // @Input('edit') isEdit;
  private subject = new Subject<any>();
  aaEdit = false;
  @Input('aattorney') aattorneyDetail;
  @Input('state') states;
  @Input('fromPop') fromPop = false;
  // @Input('save') isSave;
  ApplicantAttorney: FormGroup;
  attroneylist = [];
  eamsRepresentatives = [];
  dattroneyGroupOptions: any = [];
  DattroneySelect = true;
  id: any;
  streetAAAddressList = [];
  isAAAddressError = false;
  isAAAddressSearched = false;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    public dialogRef: MatDialogRef<ApplicationAttorneyComponent>,
    private intercom: IntercomService,
    private alertService: AlertService) {
    this.claimService.searchEAMSAttorney({ search: "" }).subscribe(res => {
      this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
    })
    this.ApplicantAttorney = this.formBuilder.group({
      id: [],
      company_name: [{ value: null, disabled: true }, Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")])],
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
    this.ApplicantAttorney.get('phone')!.valueChanges.subscribe(input => {
      if (this.aaEdit)
        if (this.ApplicantAttorney.get("phone").value && this.ApplicantAttorney.get("phone").valid) {
          this.ApplicantAttorney.get("phone_ext").enable();
        } else {
          console.log("sdfsfsd")
          this.ApplicantAttorney.get("phone_ext").reset();
          this.ApplicantAttorney.get("phone_ext").disable();
        }
    })
    this.ApplicantAttorney.get('company_name')!.valueChanges.subscribe(input => {
      if (this.ApplicantAttorney.get('company_name').errors) {
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
    this.ApplicantAttorney.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isAAAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetAAAddressList = address.suggestions;
            this.isAAAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isAAAddressError = true;
            this.streetAAAddressList = [];
          })
        else
          this.streetAAAddressList = [];
      })
  }
  ngOnInit() {
    if (this.fromPop) {
      this.dialogRef.disableClose = true;
      this.ApplicantAttorney.controls["company_name"].setValidators([Validators.required]);
      this.ApplicantAttorney.controls["street1"].setValidators([Validators.required]);
      this.ApplicantAttorney.controls["city"].setValidators([Validators.required]);
      this.ApplicantAttorney.controls["state"].setValidators([Validators.required]);
      this.ApplicantAttorney.controls["zip_code"].setValidators([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
      this.editAA();
    }
    // console.log(this.aattorneyDetail)
    if (this.fromPop) {
      this.aattorneyDetail.state = this.aattorneyDetail.state_name;
    }
    this.changeState(this.aattorneyDetail.state, this.aattorneyDetail.state_code);
    this.ApplicantAttorney.patchValue(this.aattorneyDetail)
    this.id = this.aattorneyDetail.id;
  }
  aaState: any;
  changeState(state, state_code?) {
    if (state_code) {
      this.aaState = state_code;
      return
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.aaState = res.state_code;
      }
    })
  }
  private _filterAttroney(value: string, data) {
    if (value) {
      return data
        .map(group => ({ name: group.name, data: _filter(group.data, value) }))
        .filter(group => group.data.length > 0);
    }

    return data;
  }
  getAA(value) {
    this.dattroneyGroupOptions.map(group => {
      group.data.map(res => {
        if (res.company_name == value) {
          this.appAttorney(res)
        }
      })
    })
  }
  appAttorney(aa) {
    delete aa.id;
    aa.phone = this.claimService.removeFormat(aa.phone)
    this.ApplicantAttorney.reset();
    this.ApplicantAttorney.patchValue(aa);
    this.changeState(aa.state);
  }
  editAA() {
    this.aaEdit = true;
    this.ApplicantAttorney.enable();
    if (this.ApplicantAttorney.get("phone").value && this.ApplicantAttorney.get("phone").valid) {
      this.ApplicantAttorney.get("phone_ext").enable();
    } else {
      this.ApplicantAttorney.get("phone_ext").reset();
      this.ApplicantAttorney.get("phone_ext").disable();
    }
  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.state;
      }
    })

    this.ApplicantAttorney.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  updateAAttorney() {
    Object.keys(this.ApplicantAttorney.controls).forEach((key) => {
      if (this.ApplicantAttorney.get(key).value && typeof (this.ApplicantAttorney.get(key).value) == 'string')
        this.ApplicantAttorney.get(key).setValue(this.ApplicantAttorney.get(key).value.trim())
    });
    if (this.ApplicantAttorney.invalid) {
      return;
    }
    this.ApplicantAttorney.value['id'] = this.id;
    this.claimService.updateAgent(this.ApplicantAttorney.value.id, { ApplicantAttorney: this.ApplicantAttorney.value }).subscribe(res => {
      // this.isEdit = false;
      this.aaEdit = false;
      this.aattorneyDetail = this.ApplicantAttorney.value;
      this.ApplicantAttorney.patchValue(this.ApplicantAttorney.value);
      this.alertService.openSnackBar("Applicant Attorney updated successfully", 'success')
      this.ApplicantAttorney.disable();
      if (this.fromPop) {
        this.dialogRef.close(true);
        return
      } else {
        this.intercom.aaChange();
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
    // this.isEditComplete.emit(true);
    this.ApplicantAttorney.disable();
    this.ApplicantAttorney.patchValue(this.aattorneyDetail);
    this.changeState(this.aattorneyDetail.state, this.aattorneyDetail.state_code);
  }
  clearAutoComplete() {
    this.ApplicantAttorney.reset();
    this.aaState = null;
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
