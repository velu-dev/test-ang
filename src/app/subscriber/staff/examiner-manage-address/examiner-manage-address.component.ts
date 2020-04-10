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


export interface PeriodicElement {
  type: string;
  address: string;
  phone: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { type: 'Pharmacy', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { type: 'Telehealth', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { type: 'Homeless Shelter', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { type: 'Tribal 638 Free-standing Facility', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { type: 'Temporary Lodging', address: '2723  Mandan Road, California, MO, Missouri, 6501 82723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { type: 'Urgent Care Facility', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
  { type: 'Birthing Center', address: '2723  Mandan Road, California, MO, Missouri, 65018', phone: '816-269-6918' },
];
@Component({
  selector: 'app-examiner-manage-address',
  templateUrl: './examiner-manage-address.component.html',
  styleUrls: ['./examiner-manage-address.component.scss']
})


export class ExaminerManageAddressComponent implements OnInit {

  xls = globals.xls

  displayedColumns =
    ['type', 'address', 'phone', 'action'];
  dataSource = ELEMENT_DATA;


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
  options: any[];
  constructor(private claimService: ClaimService, private formBuilder: FormBuilder,
    private examinerService: ExaminerService, private alertService: AlertService,
    private route: ActivatedRoute,private router: Router
  ) {
    // this.route.params.subscribe(params => this.examinerId = params.id);

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
      address_type_id: ['', Validators.compose([Validators.required])],
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
      zipcode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
    });

    this.examinerService.getExaminerList().subscribe(response => {
      this.options = response['data'];
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
      this.addressType.splice(this.addressType.findIndex(o => o.address_type_name === 'Primary'), 1)
    }, error => {
      console.log("error", error)
    })

    this.getAddressDetails();
  }


  getAddressDetails() {

    // this.examinerService.getsingleExAddress(this.examinerId).subscribe(response => {
    //   this.addressList = response['data'];
    //   this.examinerName = response['data'].examiner_name;
    //   console.log(response)
    // }, error => {
    //   console.log(error)
    //   this.examinerName = error.error.examiner_name;
    // })

    this.advanceSearch = this.formBuilder.group({
      city: [],
      state: [],
      zip_code: []
    })

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.first_name.toLowerCase().includes(filterValue));
  }


  addressformSubmit() {
    this.addressIsSubmitted = true;
    console.log(this.addressForm.value)
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
      return;
    }


    if (this.addressForm.value.id == '' || this.addressForm.value.id == null) {
      this.addressForm.value.id = this.addressId++
      this.addAddressDetails.push(this.addressForm.value)


      this.addressForm.reset();
      this.addressIsSubmitted = false;
    } else {
      let index = this.addAddressDetails.findIndex(o => o.id === this.addressForm.value.id);
      this.addAddressDetails.splice(index, 1);
      this.addAddressDetails.push(this.addressForm.value)
      // this.examinerService.updateExaminerAddress(this.addressForm.value).subscribe(response => {
      //   console.log(response)
      //   this.getAddressDetails();
      //   this.addAddress = false;
      //   this.alertService.openSnackBar("Location updated successfully", 'success');

      // }, error => {
      //   console.log(error);
      //   this.alertService.openSnackBar(error.error.message, 'error');
      // })
    }
    console.log(this.addAddressDetails)
  }

  newAddressBlukSubmit() {
    if(this.addAddressDetails.length > 0){
      this.addAddressDetails.map(data=>{
        data.address_type_id = 1
        delete data.id
      })
      console.log(this.addAddressDetails)
    this.examinerService.postExaminerAddressOther(this.addAddressDetails,this.examinerId).subscribe(response => {
      console.log(response)
      this.alertService.openSnackBar("Location created successfully", 'success');
      this.router.navigate(['/subscriber/staff/manage-location'])
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }else{
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
  }

  advanceSearchSubmit() {
    console.log("advanceSearch", this.advanceSearch.value)
  }

  addressOnChange(data) {
    console.log(data)
    this.searchAddressDetails.push(data)
  }

  examinerOnChange(data) {
    console.log(data)
    this.examinerName = data.first_name + ' ' + data.last_name
    this.examinerId = data.id;

  }

}
