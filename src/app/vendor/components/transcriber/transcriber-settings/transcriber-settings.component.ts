import { Component, OnInit } from '@angular/core';
import * as globals from '../../../../globals';
import { UserService } from './../../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from './../../../../shared/model/user.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import * as  errors from '../../../../shared/messages/errors'

@Component({
  selector: 'app-transcriber-settings',
  templateUrl: './transcriber-settings.component.html',
  styleUrls: ['./transcriber-settings.component.scss']
})
export class TranscriberSettingsComponent implements OnInit {
  profile_bg = globals.profile_bg;
  user: User;
  currentUser = {};
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors;
  isSubmitted = false;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService
  ) {
    // this.spinnerService.show();
    this.cognitoService.currentSession().subscribe(token => {
      this.currentUser = token['idToken']['payload'];
      this.userService.getUser(this.currentUser['custom:Postgres_UserID']).subscribe(res => {
        // this.spinnerService.hide();
        this.user = res.data;
        this.userForm.setValue(res.data)
      })
    })
  }
  ngOnInit() {
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])]
    })
    this.userForm = this.formBuilder.group({
      id: [''],
      role_id: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      company_name: [{ value: "", disabled: true }, Validators.compose([Validators.required])],
      sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
    });
  }
  userformSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.updateProfile(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.isSubmitted = false;
      this.router.navigate(['/vendor/settings'])
    }, error => {
      this.isSubmitted = false;
      this.alertService.openSnackBar(error.message, 'error');
    })
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
  changePassword() {
    this.isSubmitted = true;
    if (!(this.userPasswrdForm.value.new_password == this.userPasswrdForm.value.confirmPassword)) {
      console.log("password miss match  ")
      return
    }
    if (this.userPasswrdForm.invalid) {
      console.log("Not valid form ")
      return;
    }
    this.spinnerService.show();
    this.cognitoService.getCurrentUser().subscribe(user => {
      console.log(user)
      this.cognitoService.changePassword(user, this.userPasswrdForm.value.current_password, this.userPasswrdForm.value.new_password).subscribe(res => {
        this.alertService.openSnackBar("Password successfully changed", "success");
        this.cognitoService.logOut().subscribe(res => {
          this.spinnerService.hide();
          this.isSubmitted = false;
          this.router.navigate(['/'])
        })
      }, error => {
        this.spinnerService.hide();
        this.isSubmitted = false;
        this.alertService.openSnackBar(error.message, "success");
      })
    })
  }
}
