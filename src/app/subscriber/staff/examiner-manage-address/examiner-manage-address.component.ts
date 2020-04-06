import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
import { ExaminerService } from '../../service/examiner.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as  errors from '../../../shared/messages/errors'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-examiner-manage-address',
  templateUrl: './examiner-manage-address.component.html',
  styleUrls: ['./examiner-manage-address.component.scss']
})
export class ExaminerManageAddressComponent implements OnInit {

  addresssearch = new FormControl();
  
  filteredOptions:  Observable<any>;
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
  constructor(private claimService: ClaimService, private formBuilder: FormBuilder,
    private examinerService: ExaminerService, private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.examinerId = params.id);

    this.filteredOptions = this.addresssearch.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.examinerService.searchAddress({ basic_search: value, isadvanced: false })));
  }

  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      id: [""],
      address_type_id: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      street1: ['', Validators.compose([Validators.required])],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
    });

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('address_type').subscribe(response => {
      this.addressType = response['data'];
      this.addressType.splice(this.addressType.findIndex(o => o.address_type_name === 'Primary'), 1)
    }, error => {
      console.log("error", error)
    })

    this.getAddressDetails();

  }

  getAddressDetails() {

    this.examinerService.getsingleExAddress(this.examinerId).subscribe(response => {
      this.addressList = response['data'];
      this.examinerName =  response['data'].examiner_name;
      console.log(response)
    }, error => {
      console.log(error)
      this.examinerName =  error.error.examiner_name;
    })

    this.advanceSearch = this.formBuilder.group({
      city: [],
      state: [],
      zip_code: []
    })

  }

  addressIsSubmitted: boolean = false;
  addressformSubmit() {
    this.addressIsSubmitted = true;
    console.log(this.addressForm.value)
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
      return;
    }

    if (this.addressForm.value.id == '' || this.addressForm.value.id == null) {
      this.examinerService.postExaminerAddressOther(this.addressForm.value, this.examinerId).subscribe(response => {
        console.log(response)
        this.getAddressDetails();
        this.addAddress = false;
        this.alertService.openSnackBar("Location created successfully", 'success');

      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.examinerService.updateExaminerAddress(this.addressForm.value).subscribe(response => {
        console.log(response)
        this.getAddressDetails();
        this.addAddress = false;
        this.alertService.openSnackBar("Location updated successfully", 'success');

      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

  editAddress(details) {
    console.log(details);
    this.addAddress = true;
    this.addressForm.setValue(details)
  }

  deleteAddress(id) {
    this.examinerService.deleteExaminerAddress(id).subscribe(response => {
      console.log(response)
      this.getAddressDetails();
      this.addAddress = false;
      this.alertService.openSnackBar("Location deleted successfully", 'success');

    }, error => {
      console.log(error)
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  advanceSearchSubmit() {
    console.log("advanceSearch", this.advanceSearch.value)
  }

  searchAddress(){
    let data = {}
    this.examinerService.searchAddress(data).subscribe(res=>{

    },error =>{

    })
  }
}
