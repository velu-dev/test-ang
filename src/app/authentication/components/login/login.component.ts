import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  passwordFieldType: boolean;
  logo = globals.logo;
  errorMessages = errors;
  constructor(private router: Router, private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder, private cookieService: CookieService, private spinnerService: NgxSpinnerService, private alertService: AlertService) { }

  ngOnInit() {

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

  //login submit
  login() {
    let auth = { name: this.loginForm.value.email, password: this.loginForm.value.password }
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerService.show()
    this.cognitoService.logIn(auth).subscribe(loginRes => {
      // console.log(loginRes.signInUserSession.idToken.jwtToken)
      this.authenticationService.signIn(loginRes.signInUserSession.idToken.jwtToken).subscribe(data => {
        // console.log(data)
        this.spinnerService.hide()
        if (data['user']['custom:isPlatformAdmin'] == '1') {
          this.alertService.openSnackBar(success.loginSuccess, 'success');
          this.router.navigate(['/admin/dashboard'])
        }
        else {
          this.alertService.openSnackBar("Under processing", 'error');
          this.logout();
        }
      })
    }, error => {
      // console.log("loginError", error)
      this.alertService.openSnackBar(error.message, 'error');
      this.spinnerService.hide()
    })
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      // console.log("logout", response)
      this.cookieService.deleteAll();
    })
  }
}