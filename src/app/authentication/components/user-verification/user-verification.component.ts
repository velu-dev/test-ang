import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'src/app/shared/services/alert.service';

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
  error: any;
  constructor(private formBuilder: FormBuilder, private cognitoService: CognitoService, private router: Router, private authenticationService: AuthenticationService, private alertService: AlertService, private spinnerService: NgxSpinnerService) { 
    this.spinnerService.hide();
  }

  ngOnInit() {
    this.verificationForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      code: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)])]
    });
  }
  get formControls() { return this.verificationForm.controls; }

  //signup verify submit
  verifySubmit() {
    this.error = '';
    this.isSubmitted = true;
    if (this.verificationForm.invalid) {
      return;
    }
    this.authenticationService.emailVerify(this.verificationForm.value.email.toLowerCase()).subscribe(emailVerifyRes => {
      let verifyDetails: any = emailVerifyRes;
      if (!verifyDetails.status) {
        this.error = { message: verifyDetails.message, action: "danger" }
        return;
      }

      this.spinnerService.show();
      this.cognitoService.signUpVerification(this.verificationForm.value.email.toLowerCase(), this.verificationForm.value.code).subscribe(signUpVerify => {
        console.log("signUpVerify", signUpVerify);
        if (signUpVerify == 'SUCCESS') {
          this.authenticationService.signUpVerify(this.verificationForm.value.email).subscribe(res => {
            this.spinnerService.hide();
            this.alertService.openSnackBar(success.signupsuccess, 'success')
            this.router.navigate(['/login']);
          },
            error => {
              this.spinnerService.hide()
              console.log("Error", error);
              this.error = { message: error.error.error, action: "danger" }
            })
        }
      }, error => {
        this.spinnerService.hide();
        console.log("Error", error);
        this.error = { message: error.message, action: "danger" }
      })
    }, error => {
      console.log("error", error)
    })
  }

  //verification code resend
  verifyResend() {
    this.error = '';
    if (this.verificationForm.value.email) {
      this.authenticationService.emailVerify(this.verificationForm.value.email.toLowerCase()).subscribe(emailVerifyRes => {
        let verifyDetails: any = emailVerifyRes;
        if (!verifyDetails.status) {
          this.error = { message: verifyDetails.message, action: "danger" }
          return;
        }
        this.cognitoService.resentSignupCode(this.verificationForm.value.email).subscribe(resendVerify => {
          this.error = { message: success.resendcode, action: "danger" }
        }, error => {
          console.log("Error", error);
          this.error = { message: error.message, action: "danger" }
        })
      })
    } else {
      this.error = { message: this.errorMessages.entervalidemail, action: "danger" }
    }

  }

}
