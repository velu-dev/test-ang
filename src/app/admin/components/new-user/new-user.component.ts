import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as  errors from '../../../shared/messages/errors'
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Role } from '../../models/role.model';
import { Store } from '@ngrx/store';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { EMAIL_REGEXP } from 'src/app/globals';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  isSubmitted = false;
  isEdit: boolean = false;
  userData: any;
  errorMessages = errors;
  passwordFieldType = "password";
  roles: Role[];
  isAdmin = { status: false, role_id: "", disabled: false }
  isSubscriber = { status: false, role_id: "", disabled: false }
  activeTitle = "";
  user: any;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location,
    private cookieService: CookieService
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
    this.roles = [];
    // this.store.subscribe(res => {
    //   this.activeTitle = res.breadcrumb.active_title;
    // })
    this.isAdmin.status = true;
    this.isAdmin.disabled = true;
    this.userService.getRoles().subscribe(res => {
      this.roles.push(res.data[0])
    })
    // if (this.activeTitle.split(" ").includes("User")) {
    // // if (this.activeTitle.split(" ").includes("Admin")) {
    //   this.isAdmin.status = true;
    //   this.isAdmin.disabled = true;
    //   this.userService.getRoles().subscribe(res => {
    //     this.roles.push(res.data[0])
    //   })
    // } else if (this.activeTitle.split(" ").includes("Subscribers")) {
    //   this.isSubscriber.status = true;
    //   this.isSubscriber.disabled = true;
    //   this.userService.getRoles().subscribe(res => {
    //     this.roles = res.data;
    //   })
    // } else if (this.activeTitle.split(" ").includes("Vendor")) {
    //   this.userService.getVendorRole().subscribe(res => {
    //     this.roles = res.data;
    //   })
    // }
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;

        this.userService.getUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          console.log(res.data)
          this.userForm.setValue(this.userData)
        })
      } else {
      }
    })
  }

  ngOnInit() {
    let role_id: any = "";
    let disabled = false;

    if (this.isAdmin.status) {
      role_id = 1;
      this.isAdmin.role_id = "1";
      disabled = true;
    } else if (this.isSubscriber.status) {
      role_id = 2;
      disabled = true;
      this.isSubscriber.role_id = "2";
    }

    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      company_name: [{ value: this.user.company_name, disabled: true }, Validators.compose([Validators.maxLength(100)])],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      role_id: [{ value: role_id, disabled: disabled }, Validators.required]
    });
  }

  userSubmit() {
    this.userForm.value.company_name = this.user.company_name;
    this.isSubmitted = true;
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.userForm.invalid) {
      return;
    }
    if (this.isAdmin.status) {
      this.userForm.value['role_id'] = 1;
    }
    if (this.isSubscriber.status) {
      this.userForm.value.role_id = 2
    }

    if (!this.isEdit) {
      this.userService.createUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully", 'success');
        this._location.back();
      }, error => {
        console.log(error)
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.userService.updateUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User update successfully", 'success');
        if (this.isAdmin.status) {
          this.alertService.openSnackBar("Admin User updated successfully", 'success');
          this.router.navigate(['/admin/admin-users'])
        } else {
          this.alertService.openSnackBar("User updated successfully", 'success');
          this.router.navigate(['/admin/users'])
        }
      }, error => {
        this.alertService.openSnackBar(error.error, 'error');
      })
    }
  }
  cancel() {
    this._location.back();
  }

}
