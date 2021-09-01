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
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { OnDemandService } from '../../service/on-demand.service';

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
  isSubmitted = false;
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
    public dialog: MatDialog,
    private onDemandService: OnDemandService
  ) {
    this.userService.getProfile().subscribe(res => {
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      this.first_name = res.data.first_name;
      let userDetails = {
        id: res.data.id,
        suffix: res.data.suffix,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        middle_name: res.data.middle_name,
        sign_in_email_id: res.data.sign_in_email_id,
        county: res.data.county,
      }
      this.userForm.patchValue(userDetails)
      this.signData = res.data.signature ? 'data:image/png;base64,' + res.data.signature : null

    })
  }
  ngOnInit() {
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])]
    })

    this.userForm = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      signature: [''],
      county: [null],
      is_new_signature: [false]
    });


    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    // this.claimService.seedData('taxonomy').subscribe(response => {
    //   this.taxonomyList = response['data'];
    // }, error => {
    //   console.log("error", error)
    // })

    // this.claimService.seedData('specialty').subscribe(response => {
    //   this.specialtyList = response['data'];
    // }, error => {
    //   console.log("error", error)
    // })

  }
  progress = 0;
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
    this.userService.updateSubsciberSetting(this.userForm.value).subscribe((event: HttpEvent<any>) => {
      let progress = this.onDemandService.getProgress(event);
      if (progress == 0) {
        if (event['body']) {
          this.alertService.openSnackBar("Profile updated successfully", 'success');
          this.signData = event['body'].data.signature ? 'data:image/png;base64,' + event['body'].data.signature : null;
          this.isSubmit = false;
          if (this.first_name != this.userForm.value.first_name) {
            this.first_name = this.userForm.value.first_name;
            this.intercom.setUser(true);
          }
        }
      }
    }, error => {
      this.isSubmit = false;
      console.log(error.message)
      this.alertService.openSnackBar(error.error.message, 'error');
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


  cancel() {
    this.router.navigate(["/"])
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  fileChangeEvent(event: any): void {
    let fileName = event.target.files[0].name;
    let fileTypes = ['png', 'jpg', 'jpeg']
    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize >= 3.5) {
        this.fileUpload.nativeElement.value = "";
        //this.alertService.openSnackBar("File size is too large", 'error');
        let title = 'Selected Signature File : "' + fileName + '" file size is ' + FileSize + 'MB is too large.'
        this.openDialog(title, 'File size should be upto 3MB !')
        return;
      }
      this.selectedFile = event.target.files[0].name;
      this.openSign(event);
    } else {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      //this.alertService.openSnackBar("This file type is not accepted", 'error');
      this.openDialog('This file type is not accepted', 'Supported File Formats are JPEG/JPG/PNG !')
    }
  }

  openDialog(title, subTitle) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '450px',
      data: { title: title, subTitle: subTitle }
    });
  }

  selectedFile: any = null;
  signData: any = null;
  openSignature() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '800px',
      data: { name: 'make this card the default card', address: true, isMultiple: false, fileType: ['.png', '.jpg', '.jpeg'], fileSize: 3, splMsg: "Supported File Formats are JPEG/JPG/PNG with 4:1 Aspect Ratio, 600*150 pixels<br/>Maximum File Size: 3 MB" },
      panelClass: 'custom-drag-and-drop',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.openSign(result.files[0])
      }
    })
  }
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
      } else {
        this.signData = result;
        this.userForm.patchValue({ is_new_signature: true })
      }
      this.fileUpload.nativeElement.value = "";
    });
  }

  removeSign() {
    this.signData = null;
    this.selectedFile = null;
  }
}
