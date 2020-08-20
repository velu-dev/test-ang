import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export const _filter = (opt: any[], value: string): string[] => {
  console.log("opt", opt);
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.name.toLowerCase().indexOf(filterValue) === 0);
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
  // @Input('save') isSave;
  ApplicantAttorney: FormGroup;
  attroneylist = [];
  eamsRepresentatives = [];
  dattroneyGroupOptions: Observable<any[]>;
  DattroneySelect = true;
  id: any;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claimService.seedData('eams_claims_administrator').subscribe(res => {
      this.eamsRepresentatives = res.data;
      this.attroneylist = [{ name: "Simplexam Addresses", data: this.eamsRepresentatives }];
      this.dattroneyGroupOptions = this.ApplicantAttorney.get('company_name')!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterAttroney(value, this.attroneylist))
        );
    })
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
  }
  ngOnInit() {
    this.ApplicantAttorney.patchValue(this.aattorneyDetail)
    this.id = this.aattorneyDetail.id;
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
      this.ApplicantAttorney.patchValue(res.data);
      this.ApplicantAttorney.disable();
      // this.isEditComplete.emit(true);
      this.alertService.openSnackBar("Applicant Attorney updated successfully!", 'success')
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    // this.isEditComplete.emit(true);
    this.ApplicantAttorney.disable();
  }
  clearAutoComplete() {
    this.ApplicantAttorney.reset();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
