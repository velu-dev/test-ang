import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from './../../../shared/services/cognito.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from './../../../shared/services/cookie.service';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('firstname', { static: true }) firstname: any;
  loginForm: FormGroup;
  isSubmitted = false;
  passwordFieldType: boolean;
  logo = globals.logo;
  errorMessages = errors;
  redirectUrls = [
    { role_id: 1, redirect_url: "/admin/dashboard" },
    { role_id: 2, redirect_url: "/subscriber/dashboard" },
    { role_id: 3, redirect_url: "/subscriber/manager/dashboard" },
    { role_id: 4, redirect_url: "/subscriber/staff/dashboard" },
    { role_id: 5, redirect_url: "/vendor/historian/dashboard" },
    { role_id: 6, redirect_url: "/vendor/historian/staff/dashboard" },
    { role_id: 7, redirect_url: "/vendor/summarizer/dashboard" },
    { role_id: 8, redirect_url: "/vendor/summarizer/staff/dashboard" },
    { role_id: 9, redirect_url: "/vendor/transcriber/dashboard" },
    { role_id: 10, redirect_url: "/vendor/transcriber/staff/dashboard" },
    { role_id: 11, redirect_url: "/subscriber/examiner/dashboard" },
  ]
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
    // this.cookieService.deleteAll();

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
        document.cookie = "role_id" + "=" + res['data'].role_id;
        this.redirectUrls.map(redirect => {
          if (redirect.role_id == res['data'].role_id) {
            alert(res['data'].role_id)
            this.alertService.openSnackBar(success.loginSuccess, 'success');
            console.log(redirect.redirect_url)
            this.router.navigate([redirect.redirect_url])
            this.spinnerService.hide();
          }
        })
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