import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import * as globals from '../../../globals';
import * as  errors  from '../../../shared/messages/errors'
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
  
  constructor(private formBuilder: FormBuilder,
    private cognitoService: CognitoService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      middleInitial: ['', Validators.compose([Validators.required])],
      companyName: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*"), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*"), Validators.minLength(8)])],
      captcha:['',Validators.required],
      policy:['',Validators.required]
    });
  }

  get formControls() { return this.registerForm.controls; }

  //register submit
  registerSubmit() {
    this.isSubmitted = true;

    console.log(this.registerForm.value.captcha);

    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      console.log("Password Mismatch");
      return;
    }

    let signUpDetails = { first_name: this.registerForm.value.firstName, middle_name: this.registerForm.value.middleInitial, last_name: this.registerForm.value.lastName, email_id: this.registerForm.value.email, company_name: this.registerForm.value.companyName }
    this.authenticationService.signUp(signUpDetails).subscribe(signupRes => {
      console.log("signupRes", signupRes);
      let userDetails = {
        'username': this.registerForm.value.email,
        'password': this.registerForm.value.password,
        'attributes': {
          'name': this.registerForm.value.firstName + ' ' + this.registerForm.value.lastName,
          'middle_name': this.registerForm.value.middleInitial,
          'custom:isAdmin': "0",
          'custom:Organization_ID': signupRes.data.Organization_ID.toString(),
          'custom:Postgres_UserID': signupRes.data.Postgres_User_ID.toString(),
          'custom:isPlatformAdmin': "0"
        }
      }
      this.cognitoService.signUp(userDetails).subscribe(signUpRes => {
        console.log(signUpRes);
        this.router.navigate(['/verification'])
      }, error => {
        console.log("cognitoSignUpError", error);
      })

    }, error => {
      console.log("signup", error);
    })

  }

}
