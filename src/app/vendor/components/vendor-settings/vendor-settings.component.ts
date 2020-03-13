import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import * as  errors from '../../../shared/messages/errors'
import { User } from 'src/app/shared/model/user.model';
import { VendorStaffService } from '../../service/vendor-staff.service';

@Component({
  selector: 'app-vendor-settings',
  templateUrl: './vendor-settings.component.html',
  styleUrls: ['./vendor-settings.component.scss']
})
export class VendorSettingsComponent implements OnInit {
  profile_bg = globals.profile_bg;
  user: User;
  currentUser = {};
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors;
  isSubmitted = false;
  constructor(
    private spinnerService: NgxSpinnerService,
    private vendorStaffService: VendorStaffService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService
  ) {
    this.vendorStaffService.getProfile().subscribe(res => {
      this.user = res.data;
      this.userForm.setValue(res.data)
    })
  }
  ngOnInit() {
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])]
    })
    this.userForm = this.formBuilder.group({
      id: [''],
      role_id: [''],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      middle_name: ['', Validators.compose([Validators.required])],
      company_name: [{ value: "", disabled: true }, Validators.compose([Validators.required])],
      sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
    });
  }
  userformSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    this.vendorStaffService.updateProfile(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.router.navigate(['/subscriber/manager/settings'])
    }, error => {
      this.alertService.openSnackBar(error.message, 'error');
    })
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
  changePassword() {
    this.isSubmitted = true;
    if (!(this.userPasswrdForm.value.new_password == this.userPasswrdForm.value.confirmPassword)) {
      console.log("password miss match  ")
      return
    }
    if (this.userPasswrdForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.cognitoService.getCurrentUser().subscribe(user => {
      console.log(user)
      this.cognitoService.changePassword(user, this.userPasswrdForm.value.current_password, this.userPasswrdForm.value.new_password).subscribe(res => {
        this.alertService.openSnackBar("Password successfully changed", "success");
        this.cognitoService.logOut().subscribe(res => {
          this.spinnerService.hide();
          this.router.navigate(['/'])
        })
      }, error => {
        this.spinnerService.hide();
        this.alertService.openSnackBar(error.message, "success");
      })
    })
  }

}
