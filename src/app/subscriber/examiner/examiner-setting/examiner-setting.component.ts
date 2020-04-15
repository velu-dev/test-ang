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
import { Store } from '@ngrx/store';
import * as headerActions from "./../../../shared/store/header.actions";
import { ExaminerService } from '../../service/examiner.service';

export interface Section {
  type: string;
  city: string;
  address: string;
  phone: string;

}
@Component({
  selector: 'app-examiner-setting',
  templateUrl: './examiner-setting.component.html',
  styleUrls: ['./examiner-setting.component.scss']
})
export class ExaminerSettingComponent implements OnInit {
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
  advanceSearch;
  addressType;
  serviceSearch;
  searchStatus;
  billingSearch;
  advancedSearch;
  filteredStates;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private claimService: ClaimService,
    private examinerService: ExaminerService,
    private store: Store<{ header: any }>
  ) {
    this.userService.getProfile().subscribe(res => {
      console.log("res obj", res)
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      let userDetails = {
        id: res.data.id,
        role_id: res.data.role_id,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        middle_name: res.data.middle_name,
        company_name: res.data.company_name,
        sign_in_email_id: res.data.sign_in_email_id,
      }
      this.userForm.setValue(userDetails)
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
      address_type_id: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      street1: ['', Validators.compose([Validators.required])],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
    });

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('address_type').subscribe(response => {
      this.addressType = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.getAddressDetails()
  }

  getAddressDetails() {
    this.examinerService.getExaminerAddress().subscribe(response => {
      this.addressList = response['data'];
      console.log(response)
    }, error => {
      console.log(error)
    })
  }
  userformSubmit() {
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.store.dispatch(new headerActions.HeaderAdd(this.userForm.value));

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
    console.log(this.addressForm.value)
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
      return;
    }

    if (this.addressForm.value.id == '' || this.addressForm.value.id == null) {
      this.examinerService.postExaminerAddress(this.addressForm.value).subscribe(response => {
        console.log(response)
        this.getAddressDetails();
        this.addAddress = false;
        this.alertService.openSnackBar("Location created successfully", 'success');

      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.examinerService.updateExaminerAddress(this.addressForm.value).subscribe(response => {
        console.log(response)
        this.getAddressDetails();
        this.addAddress = false;
        this.alertService.openSnackBar("Location updated successfully", 'success');

      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

  editAddress(details) {
    console.log(details);
    this.addAddress = true;
    this.addressForm.setValue(details)
  }

  deleteAddress(id) {
    this.examinerService.deleteExaminerAddress(id).subscribe(response => {
      console.log(response)
      this.getAddressDetails();
      this.addAddress = false;
      this.alertService.openSnackBar("Location deleted successfully", 'success');

    }, error => {
      console.log(error)
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  advanceSearchSubmit() {
    console.log("advanceSearch", this.advanceSearch.value)
  }
}
