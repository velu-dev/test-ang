import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../models/user.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import * as  errors from '../../../shared/messages/errors'
import { Store } from '@ngrx/store';
import * as headerActions from "./../../../shared/store/header.actions";
import { IntercomService } from 'src/app/services/intercom.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profile_bg = globals.profile_bg;
  user: User;
  currentUser = {};
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors;
  isSubmitted = false;
  first_name: string;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private store: Store<{ header: any }>,
    private intercom: IntercomService
  ) {
    // this.spinnerService.show();
    this.cognitoService.currentSession().subscribe(token => {
      this.currentUser = token['idToken']['payload'];
      this.userService.getUser(this.currentUser['custom:Postgres_UserID']).subscribe(res => {
        // this.spinnerService.hide();
        this.first_name = res.data.first_name;
        this.user = res.data;
        let userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
        }
        this.userForm.setValue(userDetails)
      })
    })
  }
  ngOnInit() {
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])]
    })
    this.userForm = this.formBuilder.group({
      id: [''],
      role_id: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      company_name: [{ value: "", disabled: true }, Validators.compose([Validators.maxLength(100)])],
      sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
    });
  }
  userformSubmit() {
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.userForm.invalid) {
      console.log(this.userForm)
      return;
    }
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      if (this.first_name != this.userForm.value.first_name) {
        this.first_name = this.userForm.value.first_name;
        this.intercom.setUser(true);
      }
      //this.store.dispatch(new headerActions.HeaderAdd(this.userForm.value));
      //this.router.navigate(['/admin/settings'])
    }, error => {
      this.alertService.openSnackBar(error.message, 'error');
    })
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
  changePassword() {
    this.isSubmitted = true;
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
