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
import { Title } from '@angular/platform-browser';


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
  icon_logo = globals.icon_logo;
  nav_logo = globals.nav_logo;
  errorMessages = errors;
  redirectUrls = [
    { role_id: 1, redirect_url: "/admin/dashboard" },
    { role_id: 2, redirect_url: "/subscriber/dashboard" },
    { role_id: 3, redirect_url: "/subscriber/manager/dashboard" },
    { role_id: 4, redirect_url: "/subscriber/staff/dashboard" },
    // { role_id: 5, redirect_url: "/vendor/historian/dashboard" },
    // { role_id: 6, redirect_url: "/vendor/historian/staff/dashboard" },
    // { role_id: 7, redirect_url: "/vendor/summarizer/dashboard" },
    // { role_id: 8, redirect_url: "/vendor/summarizer/staff/dashboard" },
    // { role_id: 9, redirect_url: "/vendor/transcriber/dashboard" },
    // { role_id: 10, redirect_url: "/vendor/transcriber/staff/dashboard" },
    { role_id: 11, redirect_url: "/subscriber/examiner/dashboard" },
  ]
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private title: Title
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
        this.cookieService.set('role_id', res['data'].role_id)
        if (res['data'].role_id == 2) {
          this.cookieService.set('is_subscriber', 'true');
        } else {
          this.cookieService.set('is_subscriber', 'false');
        }
        this.redirectUrls.map(redirect => {
          if (redirect.role_id == res['data'].role_id) {
            this.alertService.openSnackBar(success.loginSuccess, 'success');
            console.log(redirect.redirect_url)
            this.router.navigate([redirect.redirect_url])
            this.spinnerService.hide();
          }
        })
      })
    }, error => {
      console.log("error", error);
      this.authenticationService.emailVerify(this.loginForm.value.email.toLowerCase()).subscribe(emailVerifyRes => {
        if (error.message == "Temporary password has expired and must be reset by an administrator.") {
          this.authenticationService.passwordResend(this.loginForm.value.email.toLowerCase()).subscribe(res => {
            console.log(res)
            this.error = { message: success.resendpassword, action: "danger" }
          }, error => {
            console.log(error)
            this.error = { message: error.error.message, action: "danger" }
          })
          this.spinnerService.hide();
          return;
        }

        if (error.message == 'User is disabled.') {
          this.authenticationService.verifySubscriberStatus(this.loginForm.value.email.toLowerCase()).subscribe(verifyRes => {
            this.error = { message: verifyRes["message"], action: "danger" }
          }, error => {
            console.log(error)
          })
          this.spinnerService.hide();
          return;
        }

        let verifyDetails: any = emailVerifyRes;

        if (verifyDetails.message == 'Email ID is not verified!') {
          this.error = { message: verifyDetails.message, action: "danger" }
          this.spinnerService.hide();
          if(verifyDetails.role_id == 2){
            this.router.navigate(['/verification']);
          }
          return;
        }

        this.error = { message: error.message, action: "danger" }
        this.spinnerService.hide()
        if (error.code == 'UserNotConfirmedException') {
          this.router.navigate(['/verification']);
        }
      }, verifyError => {
        this.error = { message: error.message, action: "danger" }
        this.spinnerService.hide()
      })
    })
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      this.cookieService.deleteAll();
    })
  }
}