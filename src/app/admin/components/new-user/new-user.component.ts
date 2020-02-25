import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as  errors from '../../../shared/messages/errors'
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Role } from '../../models/role.model';
import { Store } from '@ngrx/store';

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
  isAdminCreate: boolean = false;
  activeTitle = "";
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location
  ) {
    this.userService.getRoles().subscribe(response => {
      this.roles = response.data;
    })
    this.store.subscribe(res => {
      if (res.breadcrumb.active_title.includes("Admin")) {
        this.isAdminCreate = true;
        this.activeTitle = res.breadcrumb.active_title;
      }
    })
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;

        this.userService.getUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          console.log(res.data)
          this.userForm.setValue(this.userData)
        })
      } else {
        // if (this.isAdminCreate) {
 
        // }
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      middle_name: [''],
      company_name: [{ value: '', disabled: this.isEdit }],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required]
    });
  }

  userSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.userService.createUser(this.userForm.value).subscribe(res => {
        if (this.isAdminCreate) {
          this.alertService.openSnackBar("Admin User created successful", 'success');
          this.router.navigate(['/admin/admin-users'])
        } else {
          this.alertService.openSnackBar("User created successful", 'success');
          this.router.navigate(['/admin/users'])
        }
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.userService.updateUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User update successful", 'success');
        if (this.isAdminCreate) {
          this.alertService.openSnackBar("Admin User updated successful", 'success');
          this.router.navigate(['/admin/admin-users'])
        } else {
          this.alertService.openSnackBar("User updated successful", 'success');
          this.router.navigate(['/admin/users'])
        }
      }, error => {
        this.alertService.openSnackBar(error.message, 'error');
      })
    }
  }
  cancel() {
    this._location.back();
  }

}
