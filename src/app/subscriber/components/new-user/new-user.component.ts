import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Role } from 'src/app/shared/model/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import * as  errors from '../../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';
import { Observable } from 'rxjs';
import { ClaimService } from '../../service/claim.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
export interface Section {
  type: string;
  name: string;
  address: string;

}
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  addressForm: FormGroup;
  userExaminerForm: FormGroup;
  isSubmitted = false;
  isEdit: boolean = false;
  userData: any;
  errorMessages = errors;
  passwordFieldType = "password";
  roles: Role[];
  isAdminCreate: boolean = false;
  activeTitle = "";
  user: any = {};
  states = [];
  filteredOptions: Observable<any[]>;
  advanceSearch: FormGroup;
  searchStatus;
  advancedSearch;
  filteredStates;
  myControl = new FormControl();
  taxonomyList: any;
  specialtyList: any;
  isExaminer: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location,
    private cookieService: CookieService,
    private claimService: ClaimService
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
    if (this.user.organization_type == 'INDV') {
      this.user.company_name = '';
    }
    delete this.user.organization_type;
    delete this.user.business_nature;
    delete this.user.logo;

    this.userService.getRoles().subscribe(response => {
      this.roles = response.data;
    })
    this.store.subscribe(res => {
      if (res.breadcrumb && res.breadcrumb.active_title.includes("Admin")) {
        this.isAdminCreate = true;
        this.activeTitle = res.breadcrumb.active_title;
      }
    })
    // this.route.params.subscribe(params_res => {
    //   if (params_res.id) {
    //     this.isEdit = true;

    //     this.userService.getUser(params_res.id).subscribe(res => {
    //       this.userData = res.data;
    //       console.log(res.data)
    //       this.userForm.setValue(this.userData)
    //     })
    //   } else {
    //   }
    // })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      company_name: [{ value: this.user.company_name, disabled: true }, Validators.compose([Validators.maxLength(100)])],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required],
    });

    this.formInit()

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('taxonomy').subscribe(response => {
      this.taxonomyList = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('specialty').subscribe(response => {
      this.specialtyList = response['data'];
    }, error => {
      console.log("error", error)
    })

    // this.claimService.seedData('address_type').subscribe(response => {
    //   this.addressType = response['data'];
    // }, error => {
    //   console.log("error", error)
    // })

  }

  formInit() {

    this.userExaminerForm = this.formBuilder.group({
      w9_number: [''],
      w9_type:['0'],
      national_provider_identifier: [''],
      specialty: [''],
      state_license_number: [''],
      state_of_license_id: [''],
      taxonomy_id: ['']

    });

    this.addressForm = this.formBuilder.group({
      phone1: [''],
      phone2: [''],
      fax1: [''],
      fax2: [''],
      mobile1: [''],
      mobile2: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: ['', Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
    });
  }

  clearChangeValue(event) {
    if (event.value == 11) {
      this.isExaminer = true
    } else {
      this.isExaminer = false
    }
    this.formInit()
  }

  userSubmit() {

    this.userForm.value.company_name = this.user.company_name
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    if (this.addressForm.invalid) {
      return;
    }
    if (this.isExaminer) {
      this.userForm.value.w9_number = this.userExaminerForm.value.w9_number;
      this.userForm.value.national_provider_identifier = this.userExaminerForm.value.national_provider_identifier;
      this.userForm.value.specialty = this.userExaminerForm.value.specialty;
      this.userForm.value.state_license_number = this.userExaminerForm.value.state_license_number;
      this.userForm.value.taxonomy_id = this.userExaminerForm.value.taxonomy_id;
      this.userForm.value.taxonomy_code = this.userExaminerForm.value.taxonomy_code;
      this.userForm.value.address_details = this.addressForm.value;
    }

    this.userService.createUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("User created successfully", 'success');
      this.router.navigate(['/subscriber/users'])
    }, error => {
      this.alertService.openSnackBar(error.error.error, 'error');
    })
    // if (!this.isEdit) {

    // } 
    // else {
    //   this.userService.updateUser(this.userForm.value).subscribe(res => {
    //     this.alertService.openSnackBar("User update successfully", 'success');
    //     this.router.navigate(['/subscriber/users'])
    //   }, error => {
    //     this.alertService.openSnackBar(error.message, 'error');
    //   })
    // }
  }
  cancel() {
    this._location.back();
  }


}
