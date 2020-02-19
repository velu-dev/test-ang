import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  isSubmitted = false;
  isEdit: boolean = false;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private userService: UserService) {
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;
        this.userService.getUser(params_res.id).subscribe(res => {
          console.log(res)
        })
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      companyName: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.minLength(8)])],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern(''), Validators.minLength(10)])],
    });
  }

  userSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    console.log("userForm", this.userForm.value)
  }

}
