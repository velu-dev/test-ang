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
  constructor(
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location
  ) {
    this.userService.getRoles().subscribe(response => {
      this.roles = response.data;
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
    this.userService.createUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("User created successful", 'success');
      this._location.back();
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  cancel() {
    this._location.back();
  }
}
