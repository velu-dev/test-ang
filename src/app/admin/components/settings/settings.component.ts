import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import { UserService } from '../../services/user.service';
import { Auth } from 'aws-amplify';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  profile_bg = globals.profile_bg;
  user: User;
  currentUserID = "";
  userForm: FormGroup;
  constructor(private spinnerService: NgxSpinnerService, private userService: UserService, private formBuilder: FormBuilder) {
    // this.userService.getUser
    this.spinnerService.show();
    Auth.currentSession().then(token => {
      this.currentUserID = token['idToken']['payload']['custom:Postgres_UserID'];
      this.userService.getUser(this.currentUserID).subscribe(res => {
        this.spinnerService.hide();
        this.user = res.data;
        this.userForm.setValue(res.data)
      })
    })
  }
  userformSubmit() {

  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      middle_name: ['', Validators.compose([Validators.required])],
      company_name: ['', Validators.compose([Validators.required])],
      sign_in_email_id: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
    });
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
}
