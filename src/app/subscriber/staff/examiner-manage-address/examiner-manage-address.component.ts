import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
import { ExaminerService } from '../../service/examiner.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as  errors from '../../../shared/messages/errors'
import { Router, ActivatedRoute } from '@angular/router';
import * as globals from '../../../globals';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-examiner-manage-address',
  templateUrl: './examiner-manage-address.component.html',
  styleUrls: ['./examiner-manage-address.component.scss']
})


export class ExaminerManageAddressComponent implements OnInit {

  xls = globals.xls
  addresssearch = new FormControl();
  examinerSearch = new FormControl();

  filteredOptions: any;
  examinerFilteredOptions: Observable<any>;
  examinerOptions: any;
  addressForm: FormGroup;
  states: any;
  addressList: any;
  addressType: any;
  addAddress: boolean = false;
  billingSearch;
  serviceSearch;
  advanceSearch: FormGroup;
  searchStatus;
  advancedSearch;
  filteredStates;
  errorMessages = errors;
  examinerId: number;
  examinerName: string;
  addAddressDetails = [];
  addressId: number = 1;
  addressIsSubmitted: boolean = false;
  searchAddressDetails = [];
  searchAddressSubmitDetails = [];
  user: any;

  constructor(private claimService: ClaimService, private formBuilder: FormBuilder,
    private examinerService: ExaminerService, private alertService: AlertService,
    private route: ActivatedRoute, private router: Router, private cookieService: CookieService,
    public _location: Location
  ) {
    // this.route.params.subscribe(params => this.examinerId = params.id);
    this.user = JSON.parse(this.cookieService.get('user'));
    if (this.user.role_id == 11) {
      this.examinerId = this.user.id
      this.examinerName = this.user.first_name + ' ' + this.user.last_name
      this.examinerSearch = new FormControl({ value: this.examinerName, disabled: true })
    }

    this.addresssearch.valueChanges.subscribe(res => {
      this.examinerService.searchAddress({ basic_search: res, isadvanced: false },1).subscribe(value => {
        this.filteredOptions = value;
      })
    })
    // .pipe(
    //   debounceTime(300),
    // ).subscribe(value => this.filteredOptions = ));

  }


  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      id: [""],
      service_code_id: ['', Validators.compose([Validators.required])],
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
      zip_code: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      notes: [''],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });

    this.examinerService.getExaminerList().subscribe(response => {
      this.examinerOptions = response['data'];
      this.examinerOptions.map(data => {
        data.full_name = data.first_name + ' ' + data.last_name;
      })
      this.examinerFilteredOptions = this.examinerSearch.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }, error => {

    })

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

    this.getAddressDetails();
  }

  getSearchAddress(event) {
    this.examinerService.searchAddress({
      basic_search: '', isadvanced: this.advancedSearch, state: this.advanceSearch.value.state, city: this.advanceSearch.value.city, zip_code: this.advanceSearch.value.zip_code
    },1).subscribe(res => {
      this.filteredOptions = res;
      event.openPanel();
      this.advancedSearch = false;
    })

  }

  getAddressDetails() {
    this.advanceSearch = this.formBuilder.group({
      city: [''],
      state: [''],
      zip_code: ['']
    })

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.examinerOptions.filter(option => option.full_name.toLowerCase().includes(filterValue));
  }

  sevice_name = [];
  addressformSubmit() {
    Object.keys(this.addressForm.controls).forEach((key) => {
      if (this.addressForm.get(key).value && typeof (this.addressForm.get(key).value) == 'string')
        this.addressForm.get(key).setValue(this.addressForm.get(key).value.trim())
    });
    this.addressIsSubmitted = true;
    console.log(this.addressForm.value)
    if (this.addressForm.invalid) {
      window.scrollTo(10, 10)
      this.addressForm.get('service_code_id').markAsTouched();
      this.addressForm.get('street1').markAsTouched();
      this.addressForm.get('city').markAsTouched();
      this.addressForm.get('state').markAsTouched();
      this.addressForm.get('zip_code').markAsTouched();
      return;
    }

    let servcie_index = this.addressType.findIndex(o => o.id == this.addressForm.value.service_code_id)
    if (this.addressForm.value.id == '' || this.addressForm.value.id == null) {

      this.sevice_name.push(this.addressType[servcie_index].service_name)
      this.addressForm.value.id = this.addressId++
      this.addAddressDetails.push(this.addressForm.value)
      this.addressForm.reset();
      this.addressIsSubmitted = false;
    } else {
      let index = this.addAddressDetails.findIndex(o => o.id === this.addressForm.value.id);
      this.addAddressDetails.splice(index, 1);
      this.sevice_name.splice(index, 1)
      this.sevice_name.push(this.addressType[servcie_index].service_name)
      this.addAddressDetails.push(this.addressForm.value);
      this.addressForm.reset();
    }
    this.newAddressBlukSubmit();

  }

  newAddressBlukSubmit() {
    // if (this.addAddressDetails.length > 0) {
    let addressDetails = this.addAddressDetails;
    addressDetails.map(data => {
      data.address_type_id = 1
      delete data.id
    })
    console.log(addressDetails)
    this.examinerService.postExaminerAddressOther(addressDetails, this.examinerId).subscribe(response => {
      console.log(response)
      this.alertService.openSnackBar("Location created successfully", 'success');
      this.router.navigate(['/subscriber/location/new-location'])
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
    // } else {
    //   this.alertService.openSnackBar("No data to submit", 'error');
    // }
  }

  existAddressBlukSubmit() {
    if (this.searchAddressDetails.length > 0) {
      console.log(this.searchAddressSubmitDetails)
      this.examinerService.postExistAddress(this.searchAddressSubmitDetails).subscribe(response => {
        console.log(response)
        this.alertService.openSnackBar("Location added successfully", 'success');
        this.router.navigate(['/subscriber/location/new-location'])
      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.alertService.openSnackBar("No data to submit", 'error');
    }

  }

  editAddress(details) {
    console.log(details);
    this.addressForm.setValue(details)
  }

  deleteAddress(index) {
    this.addAddressDetails.splice(index, 1)
    // this.examinerService.deleteExaminerAddress(id).subscribe(response => {
    //   console.log(response)
    //   this.getAddressDetails();
    //   this.addAddress = false;
    //   this.alertService.openSnackBar("Location deleted successfully", 'success');

    // }, error => {
    //   console.log(error)
    //   this.alertService.openSnackBar(error.error.message, 'error');
    // })
  }

  searchDeleteAddress(index) {
    console.log(index)
    this.searchAddressDetails.splice(index, 1)
    this.searchAddressSubmitDetails.splice(index, 1)
  }

  advanceSearchSubmit() {
    console.log("advanceSearch", this.advanceSearch.value)
  }

  addressOnChange(data) {
    let existData = this.searchAddressSubmitDetails.some(deatils => deatils.address_id === data.id)
    if (!existData) {
      let details = { user_id: this.examinerId, address_id: data.id, address_type_id: data.address_type_id }
      this.searchAddressDetails.push(data)
      this.searchAddressSubmitDetails.push(details)
    } else {
      this.alertService.openSnackBar("Location already added", 'error');
    }

  }

  examinerOnChange(data) {
    console.log(data)
    this.examinerName = data.first_name + ' ' + data.last_name
    this.examinerId = data.id;

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
