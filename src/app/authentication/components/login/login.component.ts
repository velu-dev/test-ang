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
  constructor(private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get formControls() { return this.loginForm.controls; }

  login() {
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value)
    // this.authService.login(this.loginForm.value);
    // this.router.navigateByUrl('/admin');
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
