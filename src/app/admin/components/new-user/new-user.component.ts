import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import * as  errors from '../../../shared/messages/errors'

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
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private userService: UserService) {
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;
        this.userService.getUser(params_res.id).subscribe(res => {
          // this.userData['first_name'] = res.data.first_name;
          // this.userData['last_name'] = res.data.last_name;
          // this.userData['sign_in_email_id'] = res.data.sign_in_email_id;
          // this.userData['companyName'] = "";
          // this.userData['password'] = "";
          // this.userData['phoneNumber'] = "";
          this.userForm.setValue(this.userData)
        })
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      companyName: [''],
      sign_in_email_id: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern(''), Validators.minLength(10)])],
    });
  }

  userSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
  }

}
