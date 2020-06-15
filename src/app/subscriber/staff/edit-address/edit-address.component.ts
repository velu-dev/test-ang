import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimService } from '../../service/claim.service';
import { ExaminerService } from '../../service/examiner.service';
import * as  errors from '../../../shared/messages/errors';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/shared/services/alert.service';
@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  addressForm: FormGroup;
  states: any;
  addressType: any;
  examinerId: number;
  examinerName: string;
  addressIsSubmitted: boolean = false;
  address_id: number;
  isSubmitted: boolean = false;
  errorMessages = errors;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private examinerService: ExaminerService,
    private _location: Location,
    private alertService: AlertService,
  ) {
    this.route.params.subscribe(params => {
      console.log(params)
      this.examinerId = params.examiner_id;
      this.address_id = params.address_id;
    });
  }

  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      id: [""],
      service_code_id: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      phone1: [''],
      phone2: [''],
      mobile1: [''],
      mobile2: [''],
      fax1: [''],
      fax2: [''],
      street1: ['', Validators.compose([Validators.required])],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', Validators.compose([Validators.required,Validators.maxLength(10), Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      notes: [''],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: [''],
      examiner_name: [{ value: '', disabled: true }]
    });

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('service_code').subscribe(response => {
      this.addressType = response['data'];
      //this.addressType.splice(this.addressType.findIndex(o => o.address_type_name === 'Primary'), 1)
    }, error => {
      console.log("error", error)
    })
    this.getAddress();
  }

  getAddress() {
    this.examinerService.getsingleExAddress(this.examinerId, this.address_id).subscribe(res => {
      for (var i in this.addressForm.value) {
        let dataKey = Object.keys(res['data'])
        let keyExist = dataKey.some(o => o == i);
        if (!keyExist) {
          res['data'][i] = ''
        }
      }
      console.log(res['data']);
      this.addressForm.setValue(res['data'])
    }, error => {

    })
  }

  addressformSubmit() {
    this.isSubmitted = true;
    if (this.addressForm.invalid) {
      return;
    }
    console.log(this.addressForm.value)
    this.examinerService.updateExaminerAddress(this.addressForm.value,this.examinerId).subscribe(response => {
      console.log(response);
      this.alertService.openSnackBar("Location updated successfully", 'success');
      this._location.back();
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  cancel(){
    this._location.back();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
