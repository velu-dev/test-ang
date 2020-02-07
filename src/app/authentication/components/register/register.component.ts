import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder, private cognitoService: CognitoService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      middleInitial: ['',Validators.compose([Validators.required])],
      companyName: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*"), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*"), Validators.minLength(8)])],
    });
  }

  get formControls() { return this.registerForm.controls; }

  registerSubmit() {
    // this.signup();
    // return;
    console.log(this.registerForm.value);
    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      console.log("Password Mismatch");
      return;
    }

    let signUpDetails = { firstName: this.registerForm.value.firstName, middleInitial: this.registerForm.value.middleInitial, lastName: this.registerForm.value.lastName, email: this.registerForm.value.email, companyName: this.registerForm.value.companyName, W9Number: this.registerForm.value.W9Number }
    this.authenticationService.signUp(signUpDetails).subscribe(signupRes => {
      console.log("signupRes", signupRes);
      // let userDetails = {
      //   'username': this.registerForm.value.email,
      //   'password': this.registerForm.value.password,
      //   'attributes': {
      //     'custom:isAdmin': "0",
      //     'custom:Organization_ID': "3",
      //     'custom:Postgres_UserID': "3"
      //   }
      // }
      // this.cognitoService.signUp(userDetails).subscribe(signUpRes => {
      //   console.log(signUpRes);
      // })

    }, error => {
      console.log("signup", error);
    })

  }

  signup() {
    let userDetails = {
      'username': 'rajan.m@auriss.com',
      'password': 'Test@123',
      'attributes': {
        // 'email': 'sarath.s+3@auriss.com',
        //'name': 'velu',
        //'middle_name': 'v',
        'custom:isAdmin': "0",
        'custom:Organization_ID': "1",
        'custom:Postgres_UserID': "1"
      }
    }
    this.cognitoService.signUp(userDetails).subscribe(signUpRes => {
      console.log(signUpRes);

    })
  }

  signUpVerify(){
    this.cognitoService.signUpVerification("rajan.m@auriss.com","392476").subscribe(signUpVerify => {
      console.log("signUpVerify",signUpVerify);

    })
  }

}
