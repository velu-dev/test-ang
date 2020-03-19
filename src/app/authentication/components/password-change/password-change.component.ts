import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import * as  errors from '../../../shared/messages/errors'
import * as  success from '../../../shared/messages/success'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../services/authentication.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  logo = globals.logo
  changePaswordForm: FormGroup;
  isSubmitted = false;
  errorMessages = errors;
  passwordFieldType: boolean;
  email: string;
  error: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService, private alertService: AlertService, private spinnerService: NgxSpinnerService, private cookieService: CookieService) { }

  ngOnInit() {
    this.changePaswordForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])],
    });
    this.email = this.cookieService.get('email');
  }

  get formControls() { return this.changePaswordForm.controls; }

  togglePasswordFieldType() {
    this.passwordFieldType = !this.passwordFieldType;
  }

  changePasswordSubmit() {
    this.error = '';
    this.isSubmitted = true;
    if (this.changePaswordForm.invalid) {
      return;
    }

    if (this.changePaswordForm.value.password != this.changePaswordForm.value.confirmPassword) {
      this.error = { message: this.errorMessages.passworddidnotMatch, action: "danger" }
      return;
    }

    if (!this.email) {
      this.error = { message: 'Please Re-login', action: "danger" }
      this.router.navigate(['/login'])
      return;
    }

    let userData = {
      email_id: this.email,
      password: this.changePaswordForm.value.password
    }
    this.spinnerService.show()
    this.authenticationService.setPassword(userData).subscribe(response => {
      this.spinnerService.hide()
      this.alertService.openSnackBar(success.passwordchange, 'success')
      this.router.navigate(['/login'])
    }, error => {
      console.log(error)
      this.spinnerService.hide()
      this.error = { message: error.error.error, action: "danger" }
    })
  }
}
