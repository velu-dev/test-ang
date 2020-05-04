import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-application-attorney',
  templateUrl: './application-attorney.component.html',
  styleUrls: ['./application-attorney.component.scss']
})
export class ApplicationAttorneyComponent implements OnInit {
  @Input('edit') isEdit;
  ApplicantAttorney: FormGroup;
  attroneylist = [];
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.ApplicantAttorney = this.formBuilder.group({
      company_name: [],
      name: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: [''],
      phone: [''],
      email: [''],
      fax: [''],
    });
  }
  appAttorney(sdsd) {

  }
}
