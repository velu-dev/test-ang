import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/shared/model/user.model';
import * as globals from '../../../globals'
import * as  errors from '../../../shared/messages/errors'
import { ClaimService } from '../../service/claim.service';
export interface Section {
  type: string;
  name: string;
  address: string;

}
@Component({
  selector: 'app-examiner-setting',
  templateUrl: './examiner-setting.component.html',
  styleUrls: ['./examiner-setting.component.scss']
})
export class ExaminerSettingComponent implements OnInit {

  addresss: any[] = [
    {
      type: 'Primary',
      name: 'Venkatesan',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    }
  ];
  myControl = new FormControl();
  options: any[] = [
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' },
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' },
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' },
    { name: 'Mary' },
  ];

  folders: any[] = [
    {
      name: 'Venkatesan Mariyappan',
      address: '30A, Auriss Technologies,  Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    },
    {
      name: 'Rajan',
      address: '30A,hirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    },
    {
      name: 'Sarat',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Tamil Nadu - 641002',
    },
    {
      name: 'Velusamy',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    }
  ];
  addressList: any;
  addAddress: boolean = false;
  profile_bg = globals.profile_bg;
  user: User;
  currentUser = {};
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  addressForm: FormGroup;
  errorMessages = errors;
  states: any;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private claimService: ClaimService,
  ) {
    this.userService.getProfile().subscribe(res => {
      console.log("res obj", res)
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      delete res.data.organization_type;
      delete res.data.business_nature;
      delete res.data.logo;
      this.userForm.setValue(res.data)
    })
  }
  ngOnInit() {
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-=_~/`#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-=_~/`#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-=_~/`#?!@$%._^&*()"-,:;><|}{]).{8,}$'), Validators.minLength(8)])]
    })
    this.userForm = this.formBuilder.group({
      id: [''],
      role_id: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      company_name: [{ value: "", disabled: true }, Validators.compose([Validators.maxLength(100)])],
      sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])]
    });

    this.addressForm = this.formBuilder.group({
      id: [""],
      location_type: ['', Validators.compose([Validators.required])],
      phone_number: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      address1: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })
  }
  userformSubmit() {
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.isSubmit = false;
    }, error => {
      this.isSubmit = false;
      console.log(error.message)
      this.alertService.openSnackBar(error.message, 'error');
    })
  }
  isTypePassword = true;
  changeInputType() {
    this.isTypePassword = !this.isTypePassword
  }
  isSubmit = false;
  changePassword() {
    this.isSubmit = true;
    if (this.userPasswrdForm.invalid) {
      return;
    }
    if (!(this.userPasswrdForm.value.new_password == this.userPasswrdForm.value.confirmPassword)) {
      this.alertService.openSnackBar(this.errorMessages.passworddidnotMatch, "error");
      return
    }
    this.spinnerService.show();
    this.cognitoService.getCurrentUser().subscribe(user => {
      console.log(user)
      this.cognitoService.changePassword(user, this.userPasswrdForm.value.current_password, this.userPasswrdForm.value.new_password).subscribe(res => {
        this.alertService.openSnackBar("Password successfully changed", "success");
        this.cognitoService.logOut().subscribe(res => {
          this.spinnerService.hide();
          this.isSubmit = false;
          this.router.navigate(['/'])
        })
      }, error => {
        this.spinnerService.hide();
        if (error.code == 'NotAuthorizedException') {
          error.message = this.errorMessages.oldpasswordworng;
        }
        this.alertService.openSnackBar(error.message, "error");
      })
    })
  }

  addressIsSubmitted: boolean = false;
  addressformSubmit() {
    this.addressIsSubmitted = true;
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
      return;
    }
  }
}
