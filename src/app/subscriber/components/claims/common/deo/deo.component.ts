import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-deo',
  templateUrl: './deo.component.html',
  styleUrls: ['./deo.component.scss']
})
export class DeoComponent implements OnInit {
  deoEdit = false;
  @Input('deu') deuDetail;
  DEU: FormGroup;
  @Input('fromPop') fromPop = false;
  attroneylist = [];
  @Input('state') states;
  filteredDeu: any = [];
  deuCtrl = new FormControl('', Validators.compose([Validators.pattern("^[a-zA-Z0-9-&/' ]{0,100}$")]));
  deuDetails = [];
  deuId = "";
  id: any;
  streetDEUAddressList = [];
  isDEUAddressError = false;
  isDEUAddressSearched = false;
  constructor(public dialogRef: MatDialogRef<DeoComponent>, public dialog: MatDialog, private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DEU = this.formBuilder.group({
      id: [null],
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
    this.DEU.get('phone')!.valueChanges.subscribe(input => {
      if (this.deoEdit)
        if (this.DEU.get("phone").value && this.DEU.get("phone").valid) {
          this.DEU.get("phone_ext").enable();
        } else {
          this.DEU.get("phone_ext").reset();
          this.DEU.get("phone_ext").disable();
        }
    })
    this.DEU.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isDEUAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetDEUAddressList = address.suggestions;
            this.isDEUAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isDEUAddressError = true;
            this.streetDEUAddressList = [];
          })
        else
          this.streetDEUAddressList = [];
      })
    this.claimService.getDeuDetails().subscribe(res => {
      console.log(res.data);
      res.data.map(ii => {
        ii['name'] = ii.code + " - " + ii.deu_office
      })
      this.deuDetails = res.data;
      this.filteredDeu = this.deuDetails;
      this.deuCtrl.valueChanges
        .pipe(
          startWith(''),
          map(deu => deu ? this._filteDeu(deu) : this.deuDetails.slice())
        );
      this.deuCtrl.valueChanges
        .pipe(
          debounceTime(300),
        ).subscribe(val => {
          if (this.deuCtrl.errors) {
            return
          } else {
            if (val) {
              this.filteredDeu = this._filteDeu(val)
            } else {
              this.filteredDeu = this.deuDetails.slice()
            }
            // this.filteredDeu = this.deuCtrl.valueChanges
            //   .pipe(
            //     startWith(''),
            //     map(deu => deu ? this._filteDeu(deu) : this.deuDetails.slice())
            //   );
          }
        })
    })

  }
  private _filteDeu(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.deuDetails.filter(deu => this.matchValue(deu, filterValue));
  }
  matchValue(data, value) {
    return Object.keys(data).map((key) => {
      if (key == 'deu_office' || key == 'code') {
        return new RegExp(value, 'gi').test(data[key]);
      }
    }).some(result => result);
  }

  ngOnInit() {
    if (this.fromPop) {
      this.dialogRef.disableClose = true;
      this.DEU.controls["name"].setValidators([Validators.required]);
      this.DEU.controls["street1"].setValidators([Validators.required]);
      this.DEU.controls["city"].setValidators([Validators.required]);
      this.DEU.controls["state"].setValidators([Validators.required]);
      this.DEU.controls["zip_code"].setValidators([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
      this.editDEU();
    }
    this.deuId = this.deuDetail.id;
    if (this.fromPop) {
      this.deuDetail.state = this.deuDetail.state_name;
    }
    this.changeState(this.deuDetail.state, this.deuDetail.state_code);
    this.DEU.patchValue(this.deuDetail);
    // console.log(this.deuDetail)
    this.id = this.deuDetail.id;
    this.deuCtrl.setValue(this.deuDetail.name);
  }
  deuState: any;
  changeState(state, state_code?) {
    if (state_code) {
      this.deuState = state_code;
      return
    }
    // console.log(state)
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.deuState = res.state_code;
      }
    })
  }
  appAttorney(sdsd) {

  }
  clearAutoComplete() {
    this.deuState = null;
    this.deuCtrl.reset();
    this.DEU.reset();
    this.DEU.get("street1").disable();
    this.DEU.get("street2").disable();
    this.DEU.get("city").disable();
    this.DEU.get("state").disable();
    this.DEU.get("zip_code").disable();
    this.DEU.get("phone").disable();
    this.DEU.get("phone_ext").disable();
    this.DEU.get("email").disable();
    this.DEU.get("fax").disable();
  }
  editDEU() {
    if (this.deuDetail.name) {
      this.DEU.enable();
      // this.DEU.get("street1").enable();
      // this.DEU.get("street2").enable();
      // this.DEU.get("city").enable();
      // this.DEU.get("state").enable();
      // this.DEU.get("zip_code").enable();
      // this.DEU.get("phone").enable();
      // this.DEU.get("phone_ext").enable();
      // this.DEU.get("email").enable();
      // this.DEU.get("fax").enable();
    } else {
      this.DEU.disable();
      // this.DEU.get("street1").disable();
      // this.DEU.get("street2").disable();
      // this.DEU.get("city").disable();
      // this.DEU.get("state").disable();
      // this.DEU.get("zip_code").disable();
      // this.DEU.get("phone").disable();
      // this.DEU.get("phone_ext").disable();
      // this.DEU.get("email").disable();
      // this.DEU.get("fax").disable();
    }
    this.deoEdit = true;
    if (this.DEU.get("phone").value && this.DEU.get("phone").valid && this.deuDetail.name) {
      this.DEU.get("phone_ext").enable();
    } else {
      this.DEU.get("phone_ext").reset();
      this.DEU.get("phone_ext").disable();
    }
    this.deuCtrl.setValue(this.deuDetail.name);
  }
  updateDEU() {
    Object.keys(this.DEU.controls).forEach((key) => {
      if (this.DEU.get(key).value && typeof (this.DEU.get(key).value) == 'string')
        this.DEU.get(key).setValue(this.DEU.get(key).value.trim())
    });
    if (this.DEU.invalid) {
      return;
    }
    this.DEU.value['id'] = this.id;
    let data = this.DEU.getRawValue();
    // data.name = this.deuCtrl.value;
    data.id = this.id;
    this.claimService.updateAgent(this.DEU.value.id, { DEU: data }).subscribe(res => {
      this.deoEdit = false;
      this.DEU.patchValue(this.DEU.value);
      this.deuDetail = this.DEU.value;
      this.alertService.openSnackBar("DEU updated successfully", 'success');
      this.DEU.disable();
      if (this.fromPop) {
        this.dialogRef.close(true);
        return
      }
      // this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  getDeuOffice(value) {
    this.filteredDeu.map(res => {
      if (res.deu_office == value) {
        this.deuSelect(res)
      }
    })
  }
  deuSelect(deu) {
    deu.id = this.deuId;
    this.DEU.reset();
    this.DEU.patchValue(deu)
    this.DEU.patchValue({
      name: this.deuCtrl.value
    })
    this.changeState(deu.state);
    this.DEU.get("street1").enable();
    this.DEU.get("street2").enable();
    this.DEU.get("city").enable();
    this.DEU.get("state").enable();
    this.DEU.get("zip_code").enable();
    this.DEU.get("phone").enable();
    this.DEU.get("phone_ext").enable();
    this.DEU.get("email").enable();
    this.DEU.get("fax").enable();
  }
  cancel() {
    if (this.fromPop) {
      this.dialogRef.close(false);
      return
    }
    this.deoEdit
    this.DEU.disable();
    this.DEU.patchValue(this.deuDetail);
    this.deuCtrl.setValue(this.deuDetail.name);
    this.changeState(this.deuDetail.state, this.deuDetail.state_code);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
