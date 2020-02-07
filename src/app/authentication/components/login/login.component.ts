import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  passwordFieldType:boolean;
  constructor(private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cognitoService.currentUserInfo().subscribe(currentSession =>{
      console.log("currentSession",currentSession)
    })
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*"), Validators.minLength(8)])]
    });
  }

  togglePasswordFieldType(){
    this.passwordFieldType = !this.passwordFieldType;
  }
  get formControls() { return this.loginForm.controls; }

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
  // login() {
  //   let auth = { username: "velu", password: "Velu@123" }
  //   this.cognitoService.logIn(auth).subscribe(response => {
  //     console.log(response.signInUserSession.idToken.jwtToken)
  //   })
  // }

  // signup() {
  //   let userDetails = {
  //     'username': 'velu',
  //     'password': 'Velu@123',
  //     'attributes': {
  //       'email': 'velusamy.v@auriss.com',
  //       'name': 'velu',
  //       'middle_name': 'v',
  //       'custom:isAdmin': "0",
  //       'custom:Organization_ID': "1",
  //       'custom:Postgres_UserID': "2"
  //     }
  //   }
  //   this.cognitoService.signUp(userDetails).subscribe(signUpRes => {
  //     console.log(signUpRes);

  //   })
  // }

  // signupVerify() {
  //   this.cognitoService.signUpVerification('velu', '970936').subscribe(verifydata => {
  //     console.log(verifydata)
  //   })
  // }

}
