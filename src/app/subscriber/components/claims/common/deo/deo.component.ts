import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
  @Input('save') isSave = false;
  @Output() isEditComplete = new EventEmitter();
  filteredDeu: Observable<any[]>;
  deuCtrl = new FormControl();
  deuDetails = [];
  deuId = "";
  constructor(private formBuilder: FormBuilder, private claimService: ClaimService, private alertService: AlertService) {
    this.DEU = this.formBuilder.group({
      id: [null],
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
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.isSave) {
      if (changes.isSave.currentValue)
        this.updateDEU()
    }
    if (changes.isEdit)
      this.isEdit = changes.isEdit.currentValue;
    if (this.isEdit) {
      this.DEU.enable();
      this.deuCtrl.setValue(this.deuDetail.name);
    } else {
      this.DEU.disable();
    }

  }
  ngOnInit() {
    this.deuId = this.deuDetail.id;
    this.DEU.patchValue(this.deuDetail);
    console.log(this.deuDetail)
    this.deuCtrl.setValue(this.deuDetail.name);
  }
  appAttorney(sdsd) {

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
      this.isEdit = false;
      this.DEU.patchValue(res.data)
      this.alertService.openSnackBar("DEU updated successfully", 'success');
      this.DEU.disable();
      this.isEditComplete.emit(true);
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
    this.DEU.disable();
    this.isEditComplete.emit(true);
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
