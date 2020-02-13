import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {
  logo = globals.logo
  verificationForm: FormGroup;
  isSubmitted = false;
  errorMessages = errors;
  constructor(private formBuilder: FormBuilder, private cognitoService: CognitoService, private router: Router, private authenticationService: AuthenticationService, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.verificationForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      code: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)])]
    });
  }
  get formControls() { return this.verificationForm.controls; }

  //open alert
  openSnackBar(message) {
    this.snackBar.openFromComponent(AlertComponent, {
      duration: 5 * 1000,
      data: message,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });
  }

  //signup verify submit
  verifySubmit() {
    if (this.verificationForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.cognitoService.signUpVerification(this.verificationForm.value.email, this.verificationForm.value.code).subscribe(signUpVerify => {
      console.log("signUpVerify", signUpVerify);
      if (signUpVerify == 'SUCCESS') {
        this.authenticationService.signUpVerify(this.verificationForm.value.email).subscribe(res => {
          this.spinnerService.hide();
          this.openSnackBar(success.signupsuccess)
          this.router.navigate(['/login']);
        },
          error => {
            this.spinnerService.hide()
            console.log("Error", error);
            this.openSnackBar(error.error.error);
          })
      }
    }, error => {
      this.spinnerService.hide();
      console.log("Error", error);
      this.openSnackBar(error.message);
    })
  }

  //verification code resend
  verifyResend() {
    if(this.verificationForm.value.email){ 
    this.cognitoService.resentSignupCode(this.verificationForm.value.email).subscribe(resendVerify => {
      console.log(resendVerify);
      this.openSnackBar(success.resendcode)
    }, error => {
      console.log("Error", error);
      this.openSnackBar(error.message);
    })
  }else{
    this.openSnackBar(this.errorMessages.entervalidemail);
  }
  }

}
