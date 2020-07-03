import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SubscriberUserService } from '../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/shared/model/user.model';
import * as globals from '../../globals'
import * as  errors from '../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';
import { Store } from '@ngrx/store';
import * as headerActions from "./../../shared/store/header.actions";
import { ClaimService } from '../service/claim.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
import { ImageCroppedEvent, base64ToFile, Dimensions } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  dataSource = ELEMENT_DATA;
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
      // this.spinnerService.hide();
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
          individual_w9_number: res.data.individual_w9_number,
          individual_w9_number_type: res.data.individual_w9_number_type,
          individual_npi_number: res.data.individual_npi_number,
          company_taxonomy_id: res.data.company_taxonomy_id,
          company_w9_number: res.data.company_w9_number,
          company_npi_number: res.data.company_npi_number,
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
      // this.userForm = this.formBuilder.group({
      //   id: [''],
      //   role_id: [''],
      //   first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      //   last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      //   middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      //   suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      //   company_name: [{ value: "", disabled: false }, Validators.compose([Validators.maxLength(100)])],
      //   sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      //   individual_w9_number: [''],
      //   individual_w9_number_type: ['0'],
      //   individual_npi_number: ['', Validators.maxLength(15)],
      //   company_taxonomy_id: [''],
      //   company_w9_number: [''],
      //   company_npi_number: ['', Validators.maxLength(15)],
      //   signature: ['']
      // });
      this.userForm = this.formBuilder.group({
        id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.maxLength(50)])],
        suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
        company_name: [{ value: "", disabled: false }, Validators.compose([Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        // signature: ['']
      });
    } else {
      this.userForm = this.formBuilder.group({
        id: [''],
        role_id: [''],
        first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        middle_name: ['', Validators.compose([Validators.maxLength(50)])],
        suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
        company_name: [{ value: "", disabled: true }, Validators.compose([Validators.maxLength(100)])],
        sign_in_email_id: [{ value: "", disabled: true }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
        signature: ['']
      });
    }

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
      notes: ['', Validators.maxLength(2400)],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });
    this.billingInit();
    this.claimService.seedData('taxonomy').subscribe(response => {
      this.taxonomyList = response.data;
      this.taxonomyList.map(data => {
        data.code_name = data.taxonomy_code + ' - ' + data.taxonomy_name
        if (user.role_id == 2) {
          if (user.company_taxonomy_id == data.id)
            this.texoCtrl.patchValue(data.taxonomy_code + ' - ' + data.taxonomy_name)
        }
      })
      this.filteredTexonamy = this.texoCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filteTex(value))
        );
    }, error => {
      console.log("error", error)
    })

    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    if (user.role_id == 2 || user.role_id == 11) {
      this.userService.getPrimarAddress().subscribe(res => {
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
    }
  }
  selectedTabChange(event) {
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
  private _filteTex(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.taxonomyList.filter(deu => deu.code_name.toLowerCase().includes(filterValue));
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
      notes: ['', Validators.maxLength(2400)],
      email1: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      email2: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      contact_person: ['']
    });
  }
  userformSubmit() {

    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    // let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    // this.userForm.value.signature = sign;

    this.userService.updateSubsciberSetting(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
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
    return
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      this.alertService.openSnackBar("Profile updated successfully", 'success');
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
    // console.log(this.addressForm.value);
    // console.log(this.billingForm.value);
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
      window.scrollTo(0, 250);
      this.addressForm.markAllAsTouched();
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
  texChange(tex) {
    this.userForm.patchValue({
      company_taxonomy_id: tex.id
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
      }

      this.fileUpload.nativeElement.value = "";
    });
  }

  removeSign() {
    this.signData = null;
    this.selectedFile = null;
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
    //  console.log(event, base64ToFile(event.base64));
  }

  save() {
    this.finalImage = this.croppedImage;
    //console.log(this.finalImage);
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
const ELEMENT_DATA = [
  { "id": 132, "invoice_number": "100003455", "amount": "$635.00", "status": "Unpaid", "date": "04-01-2020", "action": "Download" },
  { "id": 133, "invoice_number": "100003455", "amount": "$635.00", "status": "Unpaid", "date": "04-01-2020", "action": "Download" },
  { "id": 134, "invoice_number": "100003455", "amount": "$635.00", "status": "Unpaid", "date": "04-01-2020", "action": "Download" },
];