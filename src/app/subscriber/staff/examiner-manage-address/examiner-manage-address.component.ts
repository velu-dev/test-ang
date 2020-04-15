import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-examiner-manage-address',
  templateUrl: './examiner-manage-address.component.html',
  styleUrls: ['./examiner-manage-address.component.scss']
})


export class ExaminerManageAddressComponent implements OnInit {

  xls = globals.xls
  addresssearch = new FormControl();
  examinerSearch = new FormControl();

  filteredOptions: Observable<any>;
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
    private route: ActivatedRoute, private router: Router, private cookieService: CookieService
  ) {
    // this.route.params.subscribe(params => this.examinerId = params.id);
    this.user = JSON.parse(this.cookieService.get('user'));
    if (this.user.role_id == 11) {
      this.examinerId = this.user.id
      this.examinerName = this.user.first_name + ' ' + this.user.last_name
      this.examinerSearch = new FormControl({ value: this.examinerName, disabled: true })
    }
    this.filteredOptions = this.addresssearch.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.examinerService.searchAddress({ basic_search: value, isadvanced: false })));

    // this.examinerFilteredOptions = this.examinerSearch.valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     switchMap(value => this.examinerService.getExaminerList()));


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


  getAddressDetails() {
    this.advanceSearch = this.formBuilder.group({
      city: [],
      state: [],
      zip_code: []
    })

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.examinerOptions.filter(option => option.first_name.toLowerCase().includes(filterValue));
  }

  sevice_name = [];
  addressformSubmit() {
    this.addressIsSubmitted = true;
    console.log(this.addressForm.value)
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
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
  }

  newAddressBlukSubmit() {
    if (this.addAddressDetails.length > 0) {
      let addressDetails = this.addAddressDetails;
      addressDetails.map(data => {
        data.address_type_id = 1
        delete data.id
      })
      console.log(addressDetails)
      this.examinerService.postExaminerAddressOther(addressDetails, this.examinerId).subscribe(response => {
        console.log(response)
        this.alertService.openSnackBar("Location created successfully", 'success');
        this.router.navigate(['/subscriber/staff/manage-location'])
      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.alertService.openSnackBar("No data to submit", 'error');
    }
  }

  existAddressBlukSubmit() {
    if (this.searchAddressDetails.length > 0) {
      console.log(this.searchAddressSubmitDetails)
      this.examinerService.postExistAddress(this.searchAddressSubmitDetails).subscribe(response => {
        console.log(response)
        this.alertService.openSnackBar("Location added successfully", 'success');
        this.router.navigate(['/subscriber/staff/manage-location'])
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
    let details = { user_id: this.examinerId, address_id: data.id }
    this.searchAddressDetails.push(data)
    this.searchAddressSubmitDetails.push(details)
  }

  examinerOnChange(data) {
    console.log(data)
    this.examinerName = data.first_name + ' ' + data.last_name
    this.examinerId = data.id;

  }

}
