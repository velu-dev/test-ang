import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-deo',
  templateUrl: './deo.component.html',
  styleUrls: ['./deo.component.scss']
})
export class DeoComponent implements OnInit {
  @Input('edit') isEdit;
  DEU: FormGroup;
  attroneylist = [];
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.DEU = this.formBuilder.group({
      id: [null],
      name: [null],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null],
      phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      email: [null, Validators.compose([Validators.email])],
      fax: [null, Validators.compose([Validators.pattern('[0-9]+')])],
    });
  }
  appAttorney(sdsd) {

  }

}
