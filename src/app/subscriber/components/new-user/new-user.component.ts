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
  isExaminer: boolean = false;
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
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;

        this.userService.getEditUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          console.log(res.data);
          if (res.data.role_id == 11) {
            this.isExaminer = true
          }
          let user = {
            id: res.data.id,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            middle_name: res.data.middle_name,
            company_name: res.data.company_name,
            sign_in_email_id: res.data.sign_in_email_id,
            role_id: res.data.role_id
          }
          if (this.isExaminer) {
            let examiner = {
              w9_number: res.data.w9_number,
              w9_number_type: res.data.w9_number_type,
              national_provider_identifier: res.data.national_provider_identifier,
              specialty: res.data.specialty,
              state_license_number: res.data.state_license_number,
              state_of_license_id: res.data.state_of_license_id,
              taxonomy_id: res.data.taxonomy_id
            }
            if (res.data.address_details) {
              let address = {
                id: res.data.address_id,
                phone1: res.data.address_details.phone1,
                phone2: res.data.address_details.phone2,
                fax1: res.data.address_details.fax1,
                fax2: res.data.address_details.fax2,
                mobile1: res.data.address_details.mobile1,
                mobile2: res.data.address_details.mobile2,
                street1: res.data.address_details.street1,
                street2: res.data.address_details.street2,
                city: res.data.address_details.city,
                state: res.data.address_details.state,
                zip_code: res.data.address_details.zip_code,
                notes: res.data.address_details.notes,
                email1: res.data.address_details.email1,
                email2: res.data.address_details.email2,
                contact_person: res.data.address_details.contact_person
              }
              this.addressForm.patchValue(address)
            }
            this.userExaminerForm.patchValue(examiner)

          }

          this.userForm.patchValue(user)
        })
      } else {
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
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
      w9_number_type: ['EIN'],
      national_provider_identifier: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
      specialty: [''],
      state_license_number: ['', Validators.compose([Validators.maxLength(15)])],
      state_of_license_id: [null],
      taxonomy_id: ['']

    });

    this.addressForm = this.formBuilder.group({
      id: [''],
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
      notes: [''],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
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
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.userForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isExaminer) {
      if (this.userExaminerForm.invalid) {
        window.scrollTo(0, 400)
        this.userExaminerForm.markAllAsTouched();
        return;
      }
      if (this.addressForm.invalid) {
        window.scrollTo(0, 900)
        this.addressForm.markAllAsTouched();
        return;
      }

      this.userForm.value.w9_number = this.userExaminerForm.value.w9_number;
      this.userForm.value.w9_number_type = this.userExaminerForm.value.w9_number_type;
      this.userForm.value.national_provider_identifier = this.userExaminerForm.value.national_provider_identifier;
      this.userForm.value.specialty = this.userExaminerForm.value.specialty;
      this.userForm.value.state_license_number = this.userExaminerForm.value.state_license_number;
      this.userForm.value.taxonomy_id = this.userExaminerForm.value.taxonomy_id;
      this.userForm.value.state_of_license_id = this.userExaminerForm.value.state_of_license_id;
      this.userForm.value.address_details = this.addressForm.value;

    }
    if (!this.isEdit) {

      this.userService.createUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully!", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    }
    else {
      this.userForm.value.role_id = this.userData.role_id
      console.log(this.userForm.value)
      this.userService.updateEditUser(this.userForm.value.id, this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User updated successfully!", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.message, 'error');
      })
    }
  }
  cancel() {
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
