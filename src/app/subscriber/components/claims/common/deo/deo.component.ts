import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
  filteredDeu: Observable<any[]>;
  deuCtrl = new FormControl();
  deuDetails = [];
  deuId = "";
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
      email: [{ value: null, disabled: true }, Validators.compose([Validators.email, Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      fax: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('[0-9]+')])],
    });
    this.claimService.getDeuDetails().subscribe(res => {
      this.deuDetails = res.data;
      this.filteredDeu = this.deuCtrl.valueChanges
        .pipe(
          startWith(''),
          map(deu => deu ? this._filteDeu(deu) : this.deuDetails.slice())
        );
    })

  }
  private _filteDeu(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.deuDetails.filter(deu => deu.deu_office.toLowerCase().indexOf(filterValue) === 0);
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
    this.changeState(this.deuDetail.state);
    this.DEU.patchValue(this.deuDetail);
    console.log(this.deuDetail)
    this.deuCtrl.setValue(this.deuDetail.name);
  }
  deuState = {};
  changeState(state) {
    console.log(state)
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.deuState = res;
      }
    })
  }
  appAttorney(sdsd) {

  }
  editDEU() {
    this.DEU.enable();
    this.deoEdit = true;

  }
  updateDEU() {
    Object.keys(this.DEU.controls).forEach((key) => {
      if (this.DEU.get(key).value && typeof (this.DEU.get(key).value) == 'string')
        this.DEU.get(key).setValue(this.DEU.get(key).value.trim())
    });
    if (this.DEU.invalid) {
      return;
    }
    this.claimService.updateAgent(this.DEU.value.id, { DEU: this.DEU.value }).subscribe(res => {
      this.deoEdit = false;
      this.DEU.patchValue(res.data)
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
  deuSelect(deu) {
    deu.id = this.deuId;
    this.DEU.patchValue(deu)
    this.DEU.patchValue({
      name: this.deuCtrl.value
    })
  }
  cancel() {
    if (this.fromPop) {
      this.dialogRef.close(false);
      return
    }
    this.DEU.disable();
    this.DEU.patchValue(this.deuDetail)
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
