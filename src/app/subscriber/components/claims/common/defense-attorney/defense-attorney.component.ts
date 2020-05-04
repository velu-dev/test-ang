import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-defense-attorney',
  templateUrl: './defense-attorney.component.html',
  styleUrls: ['./defense-attorney.component.scss']
})
export class DefenseAttorneyComponent implements OnInit {
  @Input('edit') isEdit;
  DefanceAttorney: FormGroup;
  attroneylist = [];
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.DefanceAttorney = this.formBuilder.group({
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
