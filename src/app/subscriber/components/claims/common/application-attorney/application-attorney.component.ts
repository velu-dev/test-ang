import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-application-attorney',
  templateUrl: './application-attorney.component.html',
  styleUrls: ['./application-attorney.component.scss']
})
export class ApplicationAttorneyComponent implements OnInit {
  // @Input('edit') isEdit;
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
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    public dialogRef: MatDialogRef<ApplicationAttorneyComponent>,
    private alertService: AlertService) {
    // this.claimService.seedData("state").subscribe(res => {
    //   this.states = res.data;
    // })
    console.log(this.aattorneyDetail)
    // this.changeState(this.aattorneyDetail['state'], this.aattorneyDetail['state_code']);
    // this.claimService.seedData('eams_representatives').subscribe(res => {
    //   this.eamsRepresentatives = res.data;
    //   this.attroneylist = [{ name: "Simplexam Addresses", data: this.eamsRepresentatives }];
    //   this.dattroneyGroupOptions = this.ApplicantAttorney.get('company_name')!.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filterAttroney(value, this.attroneylist))
    //     );
    // })
    this.ApplicantAttorney = this.formBuilder.group({
      id: [],
      company_name: [{ value: null, disabled: true }],
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
    this.ApplicantAttorney.get('company_name')!.valueChanges.subscribe(input => {
      if (input) {
        if (input.length >= 3 || input.length == 0) {
          this.claimService.searchEAMSAttorney({ search: input }).subscribe(res => {
            this.dattroneyGroupOptions = [{ name: "Simplexam Addresses", data: res.data }];
          })
        }
      }
    });
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
    console.log(this.aattorneyDetail)
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
  appAttorney(aa) {
    delete aa.id;
    this.changeState(aa.state);
    this.ApplicantAttorney.patchValue(aa)
  }
  editAA() {
    this.aaEdit = true;
    this.ApplicantAttorney.enable();
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
      this.aattorneyDetail = res.data;
      this.ApplicantAttorney.patchValue(res.data);
      this.alertService.openSnackBar("Applicant Attorney updated successfully", 'success')
      this.ApplicantAttorney.disable();
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
    // this.isEditComplete.emit(true);
    this.ApplicantAttorney.disable();
    this.ApplicantAttorney.patchValue(this.aattorneyDetail)
  }
  clearAutoComplete() {
    this.ApplicantAttorney.reset();
    this.aaState = null;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
