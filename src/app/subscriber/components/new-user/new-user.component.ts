import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/shared/model/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import * as  errors from '../../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';

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
  user: any = {};
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location,
    private cookieService: CookieService,
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
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
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+')])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+')])],
      company_name: [{ value: this.user.company_name, disabled: true }],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required]
    });


  }

  userSubmit() {
    this.userForm.value.company_name = this.user.company_name
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.userService.createUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.userService.updateUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User update successfully", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.message, 'error');
      })
    }
  }
  cancel() {
    this._location.back();
  }
}
