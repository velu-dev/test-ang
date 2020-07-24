import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SubscriberUserService } from '../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as globals from '../../globals'
import * as  errors from '../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';
import { ClaimService } from '../service/claim.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { ImageCroppedEvent, base64ToFile, Dimensions } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-subscribersettings',
  templateUrl: './subscriber-settings.component.html',
  styleUrls: ['./subscriber-settings.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SubscriberSettingsComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource:any = new MatTableDataSource([]);
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];

  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  profile_bg = globals.profile_bg;
  user: any;
  currentUser: any;
  userForm: FormGroup;
  userPasswrdForm: FormGroup;
  errorMessages = errors
  disableCompany: boolean = true;
  taxonomyList: any;
  billing_address: boolean = false;
  addressForm: FormGroup;
  billingForm: FormGroup;
  states: any;
  filteredTexonamy: Observable<any[]>;
  texoCtrl = new FormControl();
  texoDetails = [];
  first_name: string;
  signData: any;
  selectedFile: any = null;
  isSubmitted = false;
  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: SubscriberUserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private cognitoService: CognitoService,
    private cookieService: CookieService,
    //private store: Store<{ count: number }>,
    private claimService: ClaimService,
    public _location: Location,
    private intercom: IntercomService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Invoice Number", "Action"]
        this.columnsToDisplay = ['is_expand', 'invoice_number', "disabled"]
      } else {
        this.columnName = ["Invoice Number", "Amount", "Status", "Date", "Action"]
        this.columnsToDisplay = ['invoice_number', 'amount', "status", "date", "action",]
      }
    })

    this.userService.getProfile().subscribe(res => {
      console.log("res obj", res)
      this.user = res.data;
      if (res.data.organization_type == 'INDV') {
        res.data.company_name = '';
      }
      delete res.data.organization_type;
      delete res.data.business_nature;
      delete res.data.logo;
      let userDetails;
      this.first_name = res.data.first_name;
      if (res.data.role_id == 2) {
        this.disableCompany = false;
        userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          suffix: res.data.suffix,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
        }
      } else {
        userDetails = {
          id: res.data.id,
          role_id: res.data.role_id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          suffix: res.data.suffix,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
        }
      }
      this.signData = res.data.signature ? 'data:image/png;base64,' + res.data.signature : null
      this.userForm.patchValue(userDetails)
    })
  }
  ngOnInit() {
    let user = JSON.parse(this.cookieService.get('user'));
    this.currentUser = user;
    this.userPasswrdForm = this.formBuilder.group({
      current_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      new_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*.{}?"!@#%&/,><\':;|_~`^\\]\\[\\)\\(]).{8,}'), Validators.minLength(8)])]
    })

    if (user.role_id == 2) {
      this.userForm = this.formBuilder.group({
        id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.maxLength(50)])],
        suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
        company_name: [{ value: "", disabled: false }, Validators.compose([Validators.required, Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        signature: [''],
        is_new_signature: [false]
      });
    } else {
      this.userForm = this.formBuilder.group({
        id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.maxLength(50)])],
        suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        signature: [''],
        is_new_signature: [false]
      });
    }


    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

  }

  selectedTabChange(event) {
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }


  userformSubmit() {

    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    this.isSubmit = true;
    if (this.userForm.invalid) {
      window.scrollTo(0, 0);
      return;
    }
    let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    this.userForm.value.signature = sign;
    this.userService.updateSubsciberSetting(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
      this.signData = res.data.signature ? 'data:image/png;base64,' + res.data.signature : null;
      this.isSubmit = false;
      if (this.first_name != this.userForm.value.first_name) {
        this.first_name = this.userForm.value.first_name;
        this.intercom.setUser(true);
      }
    }, error => {
      this.isSubmit = false;
      console.log(error.error.message)
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

  cancel() {
    this._location.back();
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
      var FileSize = Math.round(event.target.files[0].size / 1000); // in KB
      if (FileSize > 500) {
        this.fileUpload.nativeElement.value = "";
        //this.alertService.openSnackBar("This file too long", 'error');
        let title= 'Selected Signature File : '+ fileName +' file size is '+ FileSize +'KB is too large.'
        this.openDialog(title,'File size should be less than 500KB !')
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

  openSign(e): void {
    const dialogRef = this.dialog.open(SignPopupComponent, {
      width: '800px',
      data: e,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        this.selectedFile = null
        this.signData = this.user['signature'] ? 'data:image/png;base64,' + this.user['signature'] : result;
      } else {
        this.userForm.patchValue({ is_new_signature: true })
        this.signData = result;
      }

      this.fileUpload.nativeElement.value = "";
    });
  }

  removeSign() {
    this.signData = null;
    this.selectedFile = null;
  }

  openDialog(title, subTitle) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '450px',
      data: { title: title, subTitle: subTitle }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result['data']) {
    //   }
    // });
  }

}

@Component({
  selector: 'sign-dialog',
  templateUrl: '../sign-dialog.html',
})
export class SignPopupComponent {
  imageChangedEvent: any = '';
  showCropper = false;
  croppedImage: any = '';
  finalImage: any;
  constructor(
    public dialogRef: MatDialogRef<SignPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private alertService: AlertService,) {
    this.imageChangedEvent = data;
    dialogRef.disableClose = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  save() {
    this.finalImage = this.croppedImage;
    this.dialogRef.close(this.finalImage);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cancel() {
    this.finalImage = null;
    this.dialogRef.close(this.finalImage);
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
    this.alertService.openSnackBar("This file load failed, Please try again", 'error');
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

}
