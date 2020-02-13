import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
  constructor(private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder, private cookieService: CookieService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*"), Validators.minLength(8)])]
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
        this.spinnerService.hide()
        this.openSnackBar(success.loginSuccess)
      })
    }, error => {
      console.log("loginError", error)
      this.openSnackBar(error.message)
      this.spinnerService.hide()
    })
  }

  openSnackBar(message) {
    let config = new MatSnackBarConfig();
    let horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    config.verticalPosition = verticalPosition;
    config.horizontalPosition = horizontalPosition;
    config.duration = 3000;
    config.panelClass = ['test'];
    this.snackBar.open(message, '', config);
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      console.log("logout", response)
      this.cookieService.deleteAll();
    })
  }
}
