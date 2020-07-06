import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as globals from '../../../globals'
import * as  errors from '../../../shared/messages/errors'
import { ClaimService } from '../../service/claim.service';
import { Store } from '@ngrx/store';
import * as headerActions from "./../../../shared/store/header.actions";
import { ExaminerService } from '../../service/examiner.service';
import { Location } from '@angular/common';
import { IntercomService } from 'src/app/services/intercom.service';
import { SignPopupComponent } from '../../subscriber-settings/subscriber-settings.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-examiner-setting',
  templateUrl: './examiner-setting.component.html',
  styleUrls: ['./examiner-setting.component.scss']
})
export class ExaminerSettingComponent implements OnInit {
  profile_bg = globals.profile_bg;
  user: any;
  currentUser = {};
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  addressForm: FormGroup;
  errorMessages = errors;
  states: any;
  billing_address: boolean = false;
  billingForm: FormGroup;
  first_name: string;
  specialtyList: any;
  taxonomyList: any;
  isSubmitted= false;
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private claimService: ClaimService,
    private examinerService: ExaminerService,
    private store: Store<{ header: any }>,
    public _location: Location,
    private intercom: IntercomService,
    public dialog: MatDialog
  ) {
    this.userService.getProfile().subscribe(res => {
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      this.first_name = res.data.first_name;
      let userDetails = {
        id: res.data.id,
        //role_id: res.data.role_id,
        suffix: res.data.suffix,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        middle_name: res.data.middle_name,
        //company_name: res.data.company_name,
        sign_in_email_id: res.data.sign_in_email_id,
      }
      this.userForm.patchValue(userDetails)
      this.signData = res.data.signature ? 'data:image/png;base64,' + res.data.signature : null
      // this.userService.getEditUser(res.data.id).subscribe(res => {
      //   if ( this.user.organization_type == 'INDV') {
      //     res.data.company_name = '';
      //   }
      //   let user = {
      //     id: res.data.id,
      //     first_name: res.data.first_name,
      //     last_name: res.data.last_name,
      //     middle_name: res.data.middle_name,
      //     suffix: res.data.suffix,
      //     //company_name: res.data.company_name,
      //     sign_in_email_id: res.data.sign_in_email_id,
      //     // role_id:  this.user.role_id,
      //     // w9_number: res.data.w9_number,
      //     // w9_number_type: res.data.w9_number_type,
      //     // national_provider_identifier: res.data.national_provider_identifier,
      //     // specialty: res.data.specialty,
      //     // state_license_number: res.data.state_license_number,
      //     // state_of_license_id: res.data.state_of_license_id,
      //     // taxonomy_id: res.data.taxonomy_id
      //   }
       
      //  this.userForm.patchValue(user)
      //})

    })
  }
  ngOnInit() {
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])]
    })
    // this.userForm = this.formBuilder.group({
    //   id: [''],
    //   role_id: [''],
    //   first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    //   last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    //   middle_name: ['', Validators.compose([Validators.maxLength(50)])],
    //   suffix:['',Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
    //   company_name: [{ value: "", disabled: true }, Validators.compose([Validators.maxLength(100)])],
    //   sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
    //   w9_number_type: [''],
    //   w9_number: [''],
    //   national_provider_identifier: ['', Validators.compose([Validators.required,Validators.pattern('^[0-9]*$'),Validators.maxLength(15)])],
    //   specialty: [''],
    //   state_license_number: ['', Validators.compose([Validators.maxLength(15)])],
    //   taxonomy_id: [''],
    //   state_of_license_id: [null],
    //   signature: ['']
    // });

    this.userForm = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      signature: ['']
    });

    this.addressForm = this.formBuilder.group({
      phone1: [''],
      phone2: [''],
      fax1: [''],
      fax2: [''],
      mobile1: [''],
      mobile2: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: ['', Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      notes: ['',Validators.maxLength(2400)],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('taxonomy').subscribe(response => {
      this.taxonomyList = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('specialty').subscribe(response => {
      this.specialtyList = response['data'];
    }, error => {
      console.log("error", error)
    })

    // this.claimService.seedData('address_type').subscribe(response => {
    //   this.addressType = response['data'];
    // }, error => {
    //   console.log("error", error)
    // })

    //this.getAddressDetails();

    //if (this.user.role_id == 2 || this.user.role_id == 11) {
    this.userService.getPrimarAddress().subscribe(res => {
      console.log(res);
      if (res['data'].length > 0) {
        var formData: any = [];
        for (let i in res['data']) {
          formData[res['data'][i].address_type] = {}
          formData[res['data'][i].address_type].street1 = res['data'][i].street1;
          formData[res['data'][i].address_type].street2 = res['data'][i].street2;
          formData[res['data'][i].address_type].city = res['data'][i].city;
          formData[res['data'][i].address_type].state = res['data'][i].state;
          formData[res['data'][i].address_type].zip_code = res['data'][i].zip_code;
          formData[res['data'][i].address_type].notes = res['data'][i].notes;
          formData[res['data'][i].address_type].contact_person = res['data'][i].contact_person;
          res['data'][i].contacts.map(contact => {
            if (contact.contact_type == 'L1') {
              formData[res['data'][i].address_type].phone1 = contact.contact_info
            }
            if (contact.contact_type == 'L2') {
              formData[res['data'][i].address_type].phone2 = contact.contact_info
            }
            if (contact.contact_type == 'M1') {
              formData[res['data'][i].address_type].mobile1 = contact.contact_info
            }
            if (contact.contact_type == 'M1') {
              formData[res['data'][i].address_type].mobile2 = contact.contact_info
            }
            if (contact.contact_type == 'F1') {
              formData[res['data'][i].address_type].fax1 = contact.contact_info
            }
            if (contact.contact_type == 'F2') {
              formData[res['data'][i].address_type].fax2 = contact.contact_info
            }
            if (contact.contact_type == 'E1') {
              formData[res['data'][i].address_type].email1 = contact.contact_info
            }
            if (contact.contact_type == 'E2') {
              formData[res['data'][i].address_type].email2 = contact.contact_info
            }


          })
        }
        console.log(formData['P'])
        // console.log(Object.keys(formData.B).length === 0)
        //  console.log(Object.keys(formData.P).length === 0)
        if (formData.P && !(Object.keys(formData.P).length === 0)) {
          this.addressForm.setValue(formData.P);
        }
        if (formData.B && !(Object.keys(formData.B).length === 0)) {
          this.billingForm.setValue(formData.B);
        }
      }
    })
    // }

    this.billingInit()
  }

  // getAddressDetails() {
  //   this.examinerService.getExaminerAddress().subscribe(response => {
  //     this.addressList = response['data'];
  //     console.log(response)
  //   }, error => {
  //     console.log(error)
  //   })
  // }
  userformSubmit() {
    this.isSubmit = true;
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.userForm.invalid) {
      return;
    }
    let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    this.userForm.value.signature = sign;
    this.userService.updateSubsciberSetting(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.signData = res.data.signature ?  'data:image/png;base64,' + res.data.signature : null;
      this.isSubmit = false;
      if (this.first_name != this.userForm.value.first_name) {
        this.first_name = this.userForm.value.first_name;
        this.intercom.setUser(true);
      }
    }, error => {
      this.isSubmit = false;
      console.log(error.message)
      this.alertService.openSnackBar(error.message, 'error');
    })
    return;
    this.userService.updateEditUser(this.userForm.value.id,this.userForm.value).subscribe(res => {
      if (this.first_name != this.userForm.value.first_name) {
        this.first_name = this.userForm.value.first_name;
        this.intercom.setUser(true);
      }
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      //this.store.dispatch(new headerActions.HeaderAdd(this.userForm.value));
      //window.location.reload();
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

  billingInit() {
    this.billingForm = this.formBuilder.group({
      phone1: [''],
      phone2: [''],
      fax1: [''],
      fax2: [''],
      mobile1: [''],
      mobile2: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip_code: ['', Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      notes: ['',Validators.maxLength(2400)],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });
  }

  isBillingStatus: boolean = false;

  primaryAsBill() {
    console.log(this.isBillingStatus)
    if (this.isBillingStatus) {
      this.billingForm.setValue(this.addressForm.value);
      this.billing_address = true
    } else {
      this.billingInit();
      this.billing_address = false;
    }
  }

  addressFormSubmit() {
    //console.log(this.addressForm.value);
    //console.log(this.billingForm.value);
    Object.keys(this.addressForm.controls).forEach((key) => {
      if (this.addressForm.get(key).value && typeof (this.addressForm.get(key).value) == 'string')
        this.addressForm.get(key).setValue(this.addressForm.get(key).value.trim())
    });

    Object.keys(this.billingForm.controls).forEach((key) => {
      if (this.billingForm.get(key).value && typeof (this.billingForm.get(key).value) == 'string')
        this.billingForm.get(key).setValue(this.billingForm.get(key).value.trim())
    });
    if (this.addressForm.invalid) {
      console.log(this.addressForm)
      window.scrollTo(0, 250);
      this.addressForm.markAllAsTouched();
      return;
    }

    if (this.billingForm.invalid) {
      window.scrollTo(0, 1150);
      this.billingForm.markAllAsTouched();
      return;
    }
    let updateData = [this.addressForm.value, this.billingForm.value]
    updateData[0].address_type_id = 3;
    updateData[1].address_type_id = 2;

    this.userService.updatePrimaryAddress(updateData, this.user.id).subscribe(res => {
      console.log(res);
      this.alertService.openSnackBar("Location updated successfully", "success");
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.message, "error");
    })

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  fileChangeEvent(event: any): void {
    console.log("event", event.target.files[0].size);
    let fileTypes = ['png', 'jpg', 'jpeg']
    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = Math.round(event.target.files[0].size / 1000); // in KB
      if (FileSize > 500) {
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.selectedFile = event.target.files[0].name;
      this.openSign(event);
    } else {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }
  }
  selectedFile:any = null;
  signData:any = null;

  openSign(e): void {
    const dialogRef = this.dialog.open(SignPopupComponent, {
      // height: '800px',
      width: '800px',
      data: e,

    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed',result);
      if (result == null) {
        this.selectedFile = null
        this.signData = this.user['signature'] ? 'data:image/png;base64,' + this.user['signature'] : result;
      }else{
        this.signData = result;
      }
      this.fileUpload.nativeElement.value = "";
    });
  }

  removeSign(){
    this.signData = null;
    this.selectedFile = null;
  }
}
