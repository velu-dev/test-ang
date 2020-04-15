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
  currentUser = {};
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors
  disableCompany: boolean = true;
  taxonomyList: any;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private cookieService: CookieService,
    private store: Store<{ count: number }>,
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
      this.userForm.setValue(res.data)
    })
  }
  ngOnInit() {
    let user = JSON.parse(this.cookieService.get('user'));
    this.currentUser = user;
    if (user.role_id == 2) {
      this.disableCompany = false;
    }
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
        company_name: [{ value: "", disabled: this.disableCompany }, Validators.compose([Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        w9_number: ['', Validators.maxLength(15)],
        w9_type: ['0'],
        ind_national_provider_identifier: ['', Validators.maxLength(10)],
        taxonomy_id: [''],
        company_w9_number: ['', Validators.maxLength(15)],
        company_national_provider_identifier: ['', Validators.maxLength(10)],
      });
    } else {
      this.userForm = this.formBuilder.group({
        id: [''],
        role_id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
        company_name: [{ value: "", disabled: this.disableCompany }, Validators.compose([Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
      });
    }

    this.claimService.seedData('taxonomy').subscribe(response => {
      this.taxonomyList = response['data'];
    }, error => {
      console.log("error", error)
    })
  }
  userformSubmit() {
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.isSubmit = false;
      this.store.dispatch(new headerActions.HeaderAdd(this.userForm.value));
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


}
