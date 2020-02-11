import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import * as globals from '../../../globals'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  passwordFieldType: boolean;
  logo = globals.logo
  constructor(private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder, private cookieService: CookieService) { }

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
    this.cognitoService.logIn(auth).subscribe(response => {
      console.log(response.signInUserSession.idToken.jwtToken)
    })
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      console.log("logout", response)
      this.cookieService.deleteAll();
    })
  }
}
