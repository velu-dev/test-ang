import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as  errors from '../../../shared/messages/errors'
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Store } from '@ngrx/store';
import { Role } from 'src/app/shared/model/role.model';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
@Component({
  selector: 'app-manage-new-user',
  templateUrl: './manage-new-user.component.html',
  styleUrls: ['./manage-new-user.component.scss']
})
export class ManageNewUserComponent implements OnInit {
  userForm: FormGroup;
  isSubmitted = false;
  isEdit: boolean = false;
  userData: any;
  errorMessages = errors;
  passwordFieldType = "password";
  roles: Role[];
  isAdminCreate: boolean = false;
  activeTitle = "";
  user: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
    if (this.user.organization_type == 'INDV') {
      this.user.company_name = '';
    }
    delete this.user.organization_type;
    delete this.user.business_nature;
    delete this.user.logo;

    this.userService.getRoles().subscribe(response => {
      this.roles = response.data;
    })

    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;

        this.userService.getEditUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          let user = {
            id: res.data.id,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            middle_name: res.data.middle_name,
            sign_in_email_id: res.data.sign_in_email_id,
            role_id: res.data.role_id,
            suffix: res.data.suffix
          }
          this.userForm.patchValue(user)
        })
      } else {
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [null],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      //company_name: [{ value: this.user.company_name, disabled: true },Validators.compose([Validators.maxLength(100)])],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: 4, disabled: this.isEdit }, Validators.required]
    });
  }

  userSubmit() {
    this.userForm.value.company_name = this.user.company_name
    this.isSubmitted = true;
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.userForm.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.userService.createUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully", 'success');
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.userService.updateEditUser(this.userForm.value.id, this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User updated successfully", 'success');
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }
  cancel() {
    this._location.back();
  }
}
