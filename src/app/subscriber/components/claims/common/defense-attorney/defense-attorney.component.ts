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
  selector: 'app-defense-attorney',
  templateUrl: './defense-attorney.component.html',
  styleUrls: ['./defense-attorney.component.scss']
})
export class DefenseAttorneyComponent implements OnInit {
  // @Input('edit') isEdit;
  daEdit = false;
  @Input('dattroney') dattorneyDetail;
  // @Input('save') isSave = false;
  DefanceAttorney: FormGroup;
  attroneylist = [];
  @Input('state') states;
  eamsRepresentatives = [];
  dattroneyGroupOptions: Observable<any[]>;
  DattroneySelect = true;
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.claimService.seedData('eams_claims_administrator').subscribe(res => {
      this.eamsRepresentatives = res.data;
      this.attroneylist = [{ name: "Simplexam Addresses", data: this.eamsRepresentatives }];
      this.dattroneyGroupOptions = this.DefanceAttorney.get('company_name')!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterAttroney(value, this.attroneylist))
        );
    })
    this.DefanceAttorney = this.formBuilder.group({
      company_name: [{ value: null, disabled: true }],
      id: [],
      name: [{ value: null, disabled: true }],
      street1: [{ value: null, disabled: true }],
      street2: [{ value: null, disabled: true }],
      city: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      zip_code: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
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
    this.DefanceAttorney.patchValue(this.dattorneyDetail)
  }
  defAttornety(da) {
    delete da.id;
    this.DefanceAttorney.patchValue(da)
  }
  editDA() {
    this.daEdit = true;
    this.DefanceAttorney.enable();
  }
  updateDAttorney() {
    Object.keys(this.DefanceAttorney.controls).forEach((key) => {
      if (this.DefanceAttorney.get(key).value && typeof (this.DefanceAttorney.get(key).value) == 'string')
        this.DefanceAttorney.get(key).setValue(this.DefanceAttorney.get(key).value.trim())
    });
    if (this.DefanceAttorney.invalid) {
      return;
    }
    this.claimService.updateAgent(this.DefanceAttorney.value.id, { DefenseAttorney: this.DefanceAttorney.value }).subscribe(res => {
      this.daEdit = false;
      this.DefanceAttorney.patchValue(res.data);
      this.alertService.openSnackBar("Defense Attorney updated successfully!", 'success');
      this.DefanceAttorney.disable();
      // this.isEditComplete.emit(true);
    }, error => {
      this.alertService.openSnackBar(error.error.message, "error")
    })
  }
  cancel() {
    this.DefanceAttorney.disable();
    // this.isEditComplete.emit(true);
    this.DefanceAttorney.patchValue(this.dattorneyDetail)
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
