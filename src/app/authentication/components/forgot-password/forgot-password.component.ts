import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  passwordFieldType: boolean;
  logo = globals.logo;
  errorMessages = errors;
  error: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService, private title: Title) {
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
    });
  }

  forgotPasswordSubmit() {
    this.error = '';
    this.isSubmitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.authenticationService.emailVerify(this.forgotPasswordForm.value.email.toLowerCase()).subscribe(emailVerifyRes => {
      console.log("emailVerifyRes", emailVerifyRes)
      let verifyDetails: any = emailVerifyRes;
    
      if (!verifyDetails.forgotstatus) {
        this.error = { message: verifyDetails.message, action: "danger" }
        this.spinnerService.hide();
        return;
      }
      if (!verifyDetails.isactive) {
        this.error = { message: this.errorMessages.userdisable, action: "danger" }
        this.spinnerService.hide();
        return;
      }
      this.cognitoService.forgotPassword(this.forgotPasswordForm.value.email.toLowerCase()).subscribe(forgotRes => {
        console.log("forgotRes", forgotRes)
        this.spinnerService.hide();
        this.router.navigate(['/forgotpassword-verify']);
      }, error => {
        this.spinnerService.hide();
        console.log("error", error);
        this.error = { message: error.message, action: "danger" }
      })
    }, error => {
      this.spinnerService.hide();
      console.log("error", error);
      this.error = { message: error.error, action: "danger" }
    })
  }

}
