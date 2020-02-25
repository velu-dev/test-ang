import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
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
  constructor(private router: Router, private authenticationService: AuthenticationService, private cognitoService: CognitoService, private formBuilder: FormBuilder, private spinnerService: NgxSpinnerService, private alertService: AlertService) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
    });
  }

  forgotPasswordSubmit() {
    this.isSubmitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.cognitoService.forgotPassword(this.forgotPasswordForm.value.email.toLowerCase()).subscribe(forgotRes => {
      console.log("forgotRes", forgotRes)
      this.router.navigate(['/forgotpassword-verify']);
    }, error => {
      console.log("error", error);
    })
  }

}
