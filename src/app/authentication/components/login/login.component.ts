import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from './../../../shared/services/cognito.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('firstname', {static: true}) firstname:any;
  loginForm: FormGroup;
  isSubmitted = false;
  passwordFieldType: boolean;
  logo = globals.logo;
  errorMessages = errors;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.firstname.nativeElement.focus();
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  //change password <-> text
  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }

  get formControls() { return this.loginForm.controls; }
  error: any;
  //login submit
  login() {
    this.error = '';
    this.cookieService.deleteAll();

    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let auth = { name: this.loginForm.value.email.toLowerCase(), password: this.loginForm.value.password }
    this.spinnerService.show()
    this.cognitoService.logIn(auth).subscribe(loginRes => {

      if (loginRes && loginRes.challengeName == 'NEW_PASSWORD_REQUIRED') {
        this.spinnerService.hide()
        this.cookieService.set('email', this.loginForm.value.email.toLowerCase())
        this.router.navigate(['/changepassword'])
        return;
      }
      this.authenticationService.signIn(loginRes.signInUserSession.idToken.jwtToken).subscribe(res => {
        this.cookieService.set("role_id", res['data'].role_id)
        if (res['data'].role_id == 1) {
          this.alertService.openSnackBar(success.loginSuccess, 'success');
          this.router.navigate(['/admin/dashboard'])
        }
        else if (res['data'].role_id == 2) {
          this.alertService.openSnackBar(success.loginSuccess, 'success');
          this.router.navigate(['/subscriber/dashboard'])
        } else {
          this.alertService.openSnackBar(success.loginSuccess, 'success');
          this.router.navigate(['/vendor/dashboard'])
        }
      })
    }, error => {
      this.error = { message: error.message, action: "danger" }
      this.spinnerService.hide()
      if (error.code == 'UserNotConfirmedException') {
        this.router.navigate(['/verification']);
      }
    })
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      this.cookieService.deleteAll();
    })
  }
}