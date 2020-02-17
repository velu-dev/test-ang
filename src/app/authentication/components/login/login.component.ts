import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from './../../../shared/services/cognito.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from './../../../shared/components/alert/alert.component';
import { Router } from '@angular/router';
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
  constructor(private router: Router, private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder, private cookieService: CookieService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])]
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
      console.log(loginRes.signInUserSession.idToken.jwtToken)
      this.authenticationService.signIn(loginRes.signInUserSession.idToken.jwtToken).subscribe(data => {
        console.log(data)
        this.spinnerService.hide()
        if (data['user']['custom:isPlatformAdmin'] == '1') {
          this.openSnackBar(success.loginSuccess);
          this.router.navigate(['/admin'])
        }
        else {
          this.openSnackBar("Under processing");
        }
      })
    }, error => {
      console.log("loginError", error)
      this.openSnackBar(error.message)
      this.spinnerService.hide()
    })
  }

  //open alert
  openSnackBar(message) {
    this.snackBar.openFromComponent(AlertComponent, {
      duration: 5 * 100,
      data: message,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      console.log("logout", response)
      this.cookieService.deleteAll();
    })
  }
}