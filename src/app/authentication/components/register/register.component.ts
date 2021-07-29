import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import { NgxSpinnerService } from "ngx-spinner";
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  nav_logo = globals.nav_logo
  icon_logo = globals.icon_logo  
  registerForm: FormGroup;
  isSubmitted = false;
  errorMessages = errors;
  passwordFieldType: boolean;
  passwordMatchStatus: boolean = false;
  error: any;

  constructor(private formBuilder: FormBuilder,
    private cognitoService: CognitoService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private title: Title) {
    //this.title.setTitle("App | Forgot password")
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middleInitial: ['', Validators.compose([Validators.maxLength(50)])],
      companyName: ['', Validators.compose([Validators.maxLength(100)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      captcha: ['', Validators.required],
      // policy: ['', Validators.required],
      orgStatus: ['true',Validators.required]
    });
  }
  get formControls() { return this.registerForm.controls; }

  //change password <-> text
  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }

  //register submit
  registerSubmit() {
    this.isSubmitted = true;
    this.error = '';
    if (this.registerForm.value.orgStatus == 'true') {
      this.registerForm.get('companyName').setValidators([Validators.required]);
    } else {
      this.registerForm.get('companyName').setValidators([]);
    }
    this.registerForm.get('companyName').updateValueAndValidity();

    Object.keys(this.registerForm.controls).forEach((key) => {
      if (this.registerForm.get(key).value && typeof (this.registerForm.get(key).value) == 'string')
        this.registerForm.get(key).setValue(this.registerForm.get(key).value.trim())
    });
    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.error = { message: this.errorMessages.passworddidnotMatch, action: "danger" }
      return;
    }

    // if (!this.registerForm.value.policy) {
    //   return;
    // }

    this.spinnerService.show();
    //role id set role_id = 1-admin, 2-subscriber
    let signUpDetails = { first_name: this.registerForm.value.firstName, middle_name: this.registerForm.value.middleInitial, last_name: this.registerForm.value.lastName, sign_in_email_id: this.registerForm.value.email.toLowerCase(), company_name: this.registerForm.value.companyName }
    this.authenticationService.signUp(signUpDetails).subscribe(signupRes => {
      console.log("signupRes", signupRes);
      let userDetails = {
        'username': this.registerForm.value.email.toLowerCase(),
        'password': this.registerForm.value.password,
        'attributes': {
          'name': this.registerForm.value.firstName + ' ' + this.registerForm.value.lastName,
          'middle_name': this.registerForm.value.middleInitial,
          'custom:Organization_ID': signupRes.data.Organization_ID.toString(),
          'custom:Postgres_UserID': signupRes.data.Postgres_User_ID.toString(),
          "custom:Account_Number": signupRes.data.Account_Number.toString(),
          'custom:isPlatformAdmin': "0",
        }
      }
      this.cognitoService.signUp(userDetails).subscribe(signUpRes => {
        console.log(signUpRes);
        let verificationDetails = {
          Organization_ID: signupRes.data.Organization_ID.toString(),
          Postgres_User_ID: signupRes.data.Postgres_User_ID.toString(),
          sign_in_email_id: this.registerForm.value.email.toLowerCase()
        }
        this.authenticationService.updateSignup(verificationDetails).subscribe(updateRes => {
          this.router.navigate(['/verification']);
          this.spinnerService.hide();
        }, error => {
          console.log(error);
          this.spinnerService.hide();
        })

      }, error => {
        console.log("cognitoSignUpError", error);
        this.spinnerService.hide();
        if (error.code == 'UsernameExistsException') {
          error.message = this.errorMessages.emailalready;
        }
        this.error = { message: error.message, action: "danger" }
      })

    }, error => {
      console.log("signup", error);
      this.spinnerService.hide();
      this.error = { message: error.error.message, action: "danger" }
    })
  }

}
