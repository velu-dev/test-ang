import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  logo = globals.logo
  registerForm: FormGroup;
  isSubmitted = false;
  errorMessages = errors;
  passwordFieldType: boolean;
  passwordMatchStatus: boolean = false;
  error:any;

  constructor(private formBuilder: FormBuilder,
    private cognitoService: CognitoService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      middleInitial: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      companyName: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%._^&*-]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%._^&*-]).{8,}$'), Validators.minLength(8)])],
      captcha: ['', Validators.required],
      policy: ['', Validators.required]
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
    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.error = { message: this.errorMessages.passworddidnotMatch, action: "danger" }
      return;
    }

    if (!this.registerForm.value.policy) {
      return;
    }
    this.spinnerService.show();
    //role id set role_id = 1-admin, 2-subscriber
    let signUpDetails = { first_name: this.registerForm.value.firstName, middle_name: this.registerForm.value.middleInitial, last_name: this.registerForm.value.lastName, sign_in_email_id: this.registerForm.value.email, company_name: this.registerForm.value.companyName }
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
          'custom:isPlatformAdmin': "0"
        }
      }
      this.cognitoService.signUp(userDetails).subscribe(signUpRes => {
        console.log(signUpRes);
        this.spinnerService.hide();
        this.router.navigate(['/verification'])
      }, error => {
        console.log("cognitoSignUpError", error);
        this.spinnerService.hide();
        if(error.code == 'UsernameExistsException'){
          error.message = 'This email address is already in use'
        }
        this.error = { message: error.message, action: "danger" }
      })

    }, error => {
      console.log("signup", error);
      this.spinnerService.hide();
      this.error = { message: error.error.error, action: "danger" }
    })
  }

}
