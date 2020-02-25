import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { AlertService } from 'src/app/shared/services/alert.service';
@Component({
  selector: 'app-forgot-password-verify',
  templateUrl: './forgot-password-verify.component.html',
  styleUrls: ['./forgot-password-verify.component.scss']
})
export class ForgotPasswordVerifyComponent implements OnInit {
  logo = globals.logo
  forgotVerifyForm: FormGroup;
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
    private alertService: AlertService) { }

  ngOnInit() {
    this.forgotVerifyForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      code: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%._^&*-]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%._^&*-]).{8,}$'), Validators.minLength(8)])],
    });
  }

  //change password <-> text
  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }

  forgorVerifySubmit() {
    this.error = '';
    this.isSubmitted = true;
    if (this.forgotVerifyForm.invalid) {
      return;
    }
    if (this.forgotVerifyForm.value.password != this.forgotVerifyForm.value.confirmPassword) {
      this.error = { message: this.errorMessages.passworddidnotMatch, action: "danger" }
      return;
    }
    this.authenticationService.emailVerify(this.forgotVerifyForm.value.email.toLowerCase()).subscribe(emailVerifyRes => {
      let verifyDetails: any = emailVerifyRes;
      if (verifyDetails.message == "This email id does not exist!" || verifyDetails.message == "This email id is not verified!") {
        this.error = { message: verifyDetails.message, action: "danger" }
        this.spinnerService.hide();
        return;
      }
      this.spinnerService.show()
      this.cognitoService.forgotPasswordSubmit(this.forgotVerifyForm.value.email.toLowerCase(), this.forgotVerifyForm.value.code, this.forgotVerifyForm.value.password).subscribe(forgotRes => {
        this.spinnerService.hide()
        console.log("forgotRes", forgotRes)
        this.alertService.openSnackBar(success.passwordchange, 'success');
        this.router.navigate(['/login']);
      }, error => {
        this.spinnerService.hide()
        console.log("error", error);
      })
    })
  }

  //verification code resend
  verifyResend() {
    this.error = '';
    if (this.forgotVerifyForm.value.email) {
      this.authenticationService.emailVerify(this.forgotVerifyForm.value.email).subscribe(emailVerifyRes => {
        let verifyDetails: any = emailVerifyRes;
        if (verifyDetails.message == "This email id does not exist!" || verifyDetails.message == "This email id is not verified!") {
          this.error = { message: verifyDetails.message, action: "danger" }
          this.spinnerService.hide();
          return;
        }
      this.cognitoService.resentSignupCode(this.forgotVerifyForm.value.email).subscribe(resendVerify => {
        console.log(resendVerify);
        this.alertService.openSnackBar(success.resendcode, 'succes')
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
