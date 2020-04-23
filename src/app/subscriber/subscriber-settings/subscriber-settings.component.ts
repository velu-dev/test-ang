import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SubscriberUserService } from '../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/shared/model/user.model';
import * as globals from '../../globals'
import * as  errors from '../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';
import { Store } from '@ngrx/store';
import * as headerActions from "./../../shared/store/header.actions";
import { ClaimService } from '../service/claim.service';

@Component({
  selector: 'app-subscribersettings',
  templateUrl: './subscriber-settings.component.html',
  styleUrls: ['./subscriber-settings.component.scss']
})
export class SubscriberSettingsComponent implements OnInit {
  profile_bg = globals.profile_bg;
  user: User;
  currentUser: any;
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors
  disableCompany: boolean = true;
  taxonomyList: any;
  billing_address: boolean = false;
  addressForm: FormGroup;
  billingForm: FormGroup;
  states: any;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private cookieService: CookieService,
    //private store: Store<{ count: number }>,
    private claimService: ClaimService
  ) {
    this.userService.getProfile().subscribe(res => {
      // this.spinnerService.hide();
      console.log("res obj", res)
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      delete res.data.organization_type;
      delete res.data.business_nature;
      delete res.data.logo;
      let userDetails;
      if (res.data.role_id == 2) {
        this.disableCompany = false;
        userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
          individual_w9_number: res.data.individual_w9_number,
          individual_w9_number_type: res.data.individual_w9_number_type,
          individual_npi_number: res.data.individual_npi_number,
          company_taxonomy_id: res.data.company_taxonomy_id,
          company_w9_number: res.data.company_w9_number,
          company_npi_number: res.data.company_npi_number

        }

      } else {
        userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
        }
      }


      this.userForm.setValue(userDetails)
    })
  }
  ngOnInit() {
    let user = JSON.parse(this.cookieService.get('user'));
    this.currentUser = user;
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-=_~/`#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-=_~/`#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-=_~/`#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])]
    })

    if (user.role_id == 2) {
      this.userForm = this.formBuilder.group({
        id: [''],
        role_id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        company_name: [{ value: "", disabled: false }, Validators.compose([Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        individual_w9_number: [''],
        individual_w9_number_type: ['0'],
        individual_npi_number: ['', Validators.maxLength(15)],
        company_taxonomy_id: [''],
        company_w9_number: [''],
        company_npi_number: ['', Validators.maxLength(15)],
      });
    } else {
      this.userForm = this.formBuilder.group({
        id: [''],
        role_id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        company_name: [{ value: "", disabled: true }, Validators.compose([Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
      });
    }

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
      notes: [''],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });
    this.billingInit();
    this.claimService.seedData('taxonomy').subscribe(response => {
      this.taxonomyList = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    if (user.role_id == 2 || user.role_id == 11) {
      this.userService.getPrimarAddress().subscribe(res => {
        console.log(res);
        if (res['data'].length > 0) {
          var formData: any = [];
          for (let i in res['data']) {
            formData[res['data'][i].address_type] = {}
            formData[res['data'][i].address_type].street1 = res['data'][i].street1;
            formData[res['data'][i].address_type].street2 = res['data'][i].street2;
            formData[res['data'][i].address_type].city = res['data'][i].city;
            formData[res['data'][i].address_type].state = res['data'][i].state;
            formData[res['data'][i].address_type].zip_code = res['data'][i].zip_code;
            formData[res['data'][i].address_type].notes = res['data'][i].notes;
            formData[res['data'][i].address_type].contact_person = res['data'][i].contact_person;
            res['data'][i].contacts.map(contact => {
              if (contact.contact_type == 'L1') {
                formData[res['data'][i].address_type].phone1 = contact.contact_info
              }
              if (contact.contact_type == 'L2') {
                formData[res['data'][i].address_type].phone2 = contact.contact_info
              }
              if (contact.contact_type == 'M1') {
                formData[res['data'][i].address_type].mobile1 = contact.contact_info
              }
              if (contact.contact_type == 'M1') {
                formData[res['data'][i].address_type].mobile2 = contact.contact_info
              }
              if (contact.contact_type == 'F1') {
                formData[res['data'][i].address_type].fax1 = contact.contact_info
              }
              if (contact.contact_type == 'F2') {
                formData[res['data'][i].address_type].fax2 = contact.contact_info
              }
              if (contact.contact_type == 'E1') {
                formData[res['data'][i].address_type].email1 = contact.contact_info
              }
              if (contact.contact_type == 'E2') {
                formData[res['data'][i].address_type].email2 = contact.contact_info
              }


            })
          }
          console.log(formData['P'])
          // console.log(Object.keys(formData.B).length === 0)
          //  console.log(Object.keys(formData.P).length === 0)
          if (formData.P && !(Object.keys(formData.P).length === 0)) {
            this.addressForm.setValue(formData.P);
          }
          if (formData.B && !(Object.keys(formData.B).length === 0)) {
            this.billingForm.setValue(formData.B);
          }
        }
      })
    }
  }

  billingInit() {
    this.billingForm = this.formBuilder.group({
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
  userformSubmit() {
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      window.location.reload();
      this.isSubmit = false;
      // this.store.dispatch(new headerActions.HeaderAdd(this.userForm.value));
      //this.router.navigate(['/admin/settings'])
    }, error => {
      this.isSubmit = false;
      console.log(error.message)
      this.alertService.openSnackBar(error.message, 'error');
    })
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
  isSubmit = false;
  changePassword() {
    this.isSubmit = true;
    if (this.userPasswrdForm.invalid) {
      return;
    }
    if (!(this.userPasswrdForm.value.new_password == this.userPasswrdForm.value.confirmPassword)) {
      this.alertService.openSnackBar(this.errorMessages.passworddidnotMatch, "error");
      return
    }
    this.spinnerService.show();
    this.cognitoService.getCurrentUser().subscribe(user => {
      console.log(user)
      this.cognitoService.changePassword(user, this.userPasswrdForm.value.current_password, this.userPasswrdForm.value.new_password).subscribe(res => {
        this.alertService.openSnackBar("Password successfully changed", "success");
        this.cognitoService.logOut().subscribe(res => {
          this.spinnerService.hide();
          this.isSubmit = false;
          this.router.navigate(['/'])
        })
      }, error => {
        this.spinnerService.hide();
        if (error.code == 'NotAuthorizedException') {
          error.message = this.errorMessages.oldpasswordworng;
        }
        this.alertService.openSnackBar(error.message, "error");
      })
    })
  }

  isBillingStatus: boolean = false;

  primaryAsBill() {
    console.log(this.isBillingStatus)
    if (this.isBillingStatus) {
      this.billingForm.setValue(this.addressForm.value);
      this.billing_address = true
    } else {
      this.billingInit();
      this.billing_address = false;
    }
  }

  addressFormSubmit() {
    console.log(this.addressForm.value);
    console.log(this.billingForm.value);

    if (this.addressForm.invalid) {
      console.log(this.addressForm)
      return;
    }

    if (this.billingForm.invalid) {
      return;
    }
    let updateData = [this.addressForm.value, this.billingForm.value]
    updateData[0].address_type_id = 3;
    updateData[1].address_type_id = 2;

    this.userService.updatePrimaryAddress(updateData, this.user.id).subscribe(res => {
      console.log(res);
      this.alertService.openSnackBar("Location updated successfully", "success");
    },error =>{
      console.log(error);
      this.alertService.openSnackBar(error.message, "error");
    })

  }


}
