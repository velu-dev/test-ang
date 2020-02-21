import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import * as  errors from '../../../shared/messages/errors'
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';

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
  passwordFieldType = "password"
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService
  ) {
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;
        this.userService.getUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          console.log(res.data)
          this.userForm.setValue(this.userData)
        })
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      middle_name: [''],
      company_name: [''],
      sign_in_email_id: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
    });
  }

  userSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.spinnerService.show();
    let data: any;
    data = this.userForm.value;
    data['role_id'] = "2"
    this.userService.createUser(data).subscribe(res => {
      this.alertService.openSnackBar("User created successful", 'success');
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
      this.alertService.openSnackBar("Something went wrong try again", 'error');
    })
  }

}
