import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as  errors from './../../../../shared/messages/errors'
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Role } from './../../../../shared/model/role.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-summarizer-new-user',
  templateUrl: './summarizer-new-user.component.html',
  styleUrls: ['./summarizer-new-user.component.scss']
})
export class SummarizerNewUserComponent implements OnInit {
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
        this.alertService.openSnackBar("User created successfully", 'success');
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.userService.updateUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User update successfully", 'success');
          this.alertService.openSnackBar("User updated successfully", 'success');
          this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.message, 'error');
      })
    }
  }
  cancel() {
    this._location.back();
  }

}
