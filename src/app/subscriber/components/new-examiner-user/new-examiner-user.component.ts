import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { SignPopupComponent } from '../../subscriber-settings/subscriber-settings.component';
import * as  errors from '../../../shared/messages/errors'
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-examiner-user',
  templateUrl: './new-examiner-user.component.html',
  styleUrls: ['./new-examiner-user.component.scss']
})
export class NewExaminerUserComponent implements OnInit {
  userForm: FormGroup;
  mailingAddressForm: FormGroup;
  billingProviderForm: FormGroup;
  renderingForm: FormGroup;
  addressForm: FormGroup;
  userExaminerForm: FormGroup;
  isSubmitted = false;
  isEdit: boolean = false;
  userData: any;
  errorMessages = errors;
  passwordFieldType = "password";
  roles: any = [];
  isAdminCreate: boolean = false;
  activeTitle = "";
  user: any = {};
  states = [];
  filteredOptions: Observable<any[]>;
  advanceSearch: FormGroup;
  searchStatus;
  advancedSearch;
  filteredStates;
  myControl = new FormControl();
  taxonomyList: any;
  specialtyList: any;
  isExaminer: boolean = false;
  displayedColumns1: string[] = ['license_number', 'license_state', 'action',];
  licenceDataSource: any = new MatTableDataSource([]);
  examinerId: number = null;
  mailingSubmit: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  signData: any;
  dataSource: any = new MatTableDataSource([]);
  providerTypeList: any;
  sameAsExaminer: boolean;
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private alertService: AlertService,
    private router: Router,
    private _location: Location,
    private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private store: Store<{ breadcrumb: any }>,
    public dialog: MatDialog) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Address", "Status"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "status"]
      } else {
        this.columnName = ["Address", "Service Type", "Phone", "NPI Number", "Status"]
        this.columnsToDisplay = ['address', 'service_type', "phone", "npi_number", 'status']
      }
    })
    this.user = JSON.parse(this.cookieService.get('user'));
    if (this.user.organization_type == 'INDV') {
      this.user.company_name = '';
    }
    delete this.user.organization_type;
    delete this.user.business_nature;
    delete this.user.logo;

    this.userService.getRoles().subscribe(response => {
      response.data.map((role, i) => {
        if (role.id == 11) {
          this.roles.push(role);
        }
      })
    })
    this.store.subscribe(res => {
      if (res.breadcrumb && res.breadcrumb.active_title.includes("Admin")) {
        this.isAdminCreate = true;
        this.activeTitle = res.breadcrumb.active_title;
      }
    })
    this.route.params.subscribe(params_res => {
      if (params_res.id) {
        this.isEdit = true;
        this.updateFormData(params_res.id)
      }
    })
  }

  ngOnInit() {
    this.userService.verifyRole().subscribe(role => {
      console.log(role);
      this.sameAsExaminer = role.status;
    }, error => {
      console.log(error.error.status)
      this.sameAsExaminer = error.error.status;
    })
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      SameAsSubscriber: [{ value: false, disabled: this.isEdit }]
    });
    this.userForm.patchValue({ role_id: 11 })

    this.formInit();



    this.userService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })

    this.userService.seedData('taxonomy').subscribe(response => {
      this.taxonomyList = response['data'];
      this.texonomyChange(this.renderingForm.value.taxonomy_id)
    }, error => {
      console.log("error", error)
    })

    this.userService.seedData('provider_type').subscribe(response => {
      this.providerTypeList = response['data'];
    }, error => {
      console.log("error", error)
    })


  }

  updateFormData(id) {

    this.userService.getExaminerUser(id).subscribe(res => {
      this.userData = res;
      console.log(res, id)
      if (res.examiner_details.id == id) {
        this.userForm.disable();
      }
      let user = {
        id: res.examiner_details.id,
        first_name: res.examiner_details.first_name,
        last_name: res.examiner_details.last_name,
        middle_name: res.examiner_details.middle_name,
        company_name: res.examiner_details.company_name,
        sign_in_email_id: res.examiner_details.sign_in_email_id,
        role_id: res.examiner_details.role_id,
        suffix: res.examiner_details.suffix,
        SameAsSubscriber: res.examiner_details.SameAsSubscriber
      }
      this.userForm.patchValue(user);

      this.examinerId = res.examiner_id
      let mailing = {
        id: res.mailing_address.id,
        street1: res.mailing_address.street1,
        street2: res.mailing_address.street2,
        city: res.mailing_address.city,
        state: res.mailing_address.state,
        zip_code: res.mailing_address.zip_code,
        phone_no1: res.mailing_address.phone_no1,
        phone_no2: res.mailing_address.phone_no2,
        fax_no: res.mailing_address.fax_no,
        email: res.mailing_address.email,
        contact_person: res.mailing_address.contact_person,
        notes: res.mailing_address.notes,
      }
      this.mailingAddressForm.patchValue(mailing)

      let billing = {
        id: res.billing_provider.id,
        default_injury_state: res.billing_provider.default_injury_state,
        is_person: res.billing_provider.is_person != null ? res.billing_provider.is_person.toString() : 'true',
        national_provider_identifier: res.billing_provider.national_provider_identifier,
        dol_provider_number: res.billing_provider.dol_provider_number,
        tax_id: res.billing_provider.tax_id,
        street1: res.billing_provider.street1,
        street2: res.billing_provider.street2,
        city: res.billing_provider.city,
        state: res.billing_provider.state,
        zip_code: res.billing_provider.zip_code,
        phone_no: res.billing_provider.phone_no,
      }
      this.billingProviderForm.patchValue(billing)

      let rendering = {
        id: res.rendering_provider.id,
        default_injury_state: res.rendering_provider.default_injury_state,
        is_person: res.rendering_provider.is_person != null ? res.rendering_provider.is_person.toString() : 'true',
        national_provider_identifier: res.rendering_provider.national_provider_identifier,
        provider_type: res.rendering_provider.provider_type,
        taxonomy_id: res.rendering_provider.taxonomy_id,
        provider_status: res.rendering_provider.provider_status != null ? res.rendering_provider.provider_status.toString() : 'true',
        license_details: res.rendering_provider.license_details,
        //signature: res.rendering_provider.signature
      }

      this.signData = res.rendering_provider.signature ? 'data:image/png;base64,' + res.rendering_provider.signature : null
      this.renderingForm.patchValue(rendering);

      this.licenceDataSource = new MatTableDataSource(res.rendering_provider.license_details != null ? res.rendering_provider.license_details : [])
    })
  }

  formInit() {

    this.mailingAddressForm = this.formBuilder.group({
      id: [""],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_no2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      fax_no: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      email: ["", Validators.compose([Validators.email])],
      contact_person: [""],
      notes: [""],
    })

    this.billingProviderForm = this.formBuilder.group({
      id: [""],
      default_injury_state: [null],
      is_person: ['true'],
      national_provider_identifier: ["", Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])],
      dol_provider_number: [""],
      tax_id: [null],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no: [null, Validators.compose([Validators.pattern('[0-9]+')])],

    })

    this.renderingForm = this.formBuilder.group({
      id: [""],
      default_injury_state: [null],
      is_person: ['true'],
      national_provider_identifier: ["", Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])],
      provider_type: [null],
      taxonomy_id: [null],
      provider_status: ['true'],
      license_details: [null],
      signature: [null],
      is_new_signature: [false]
    })
  }

  sameAsSub(e) {
    this.isSubmitted = false;
    if (e.checked) {
      this.formInit();
      this.userForm.disable();
      this.userService.getProfile().subscribe(res => {
        this.userData = res;
        let user = {
          id: res.data.id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          middle_name: res.data.middle_name,
          company_name: res.data.company_name,
          sign_in_email_id: res.data.sign_in_email_id,
          role_id: 11,
          suffix: res.data.suffix
        }
        this.userForm.patchValue(user)
        this.userForm.controls.SameAsSubscriber.enable();
      })
    } else {
      this.userForm.reset();
      this.userForm.enable();
    }
  }

  userSubmit() {

    this.userForm.value.company_name = this.user.company_name
    this.isSubmitted = true;
    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.userForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }
    if (!this.isEdit) {
      this.userService.createExaminerUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully!", 'success');
        this.examinerId = res.data.id
        // this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    }
    else {
      console.log(this.userForm.value)
      this.userService.updateEditUser(this.userForm.value.id, this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User updated successfully!", 'success');
        this.examinerId = res.data.id
        // this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

  cancel() {
    this._location.back();
    //this.router.navigate(['/subscriber/users'])
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
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
        this.renderingForm.patchValue({ is_new_signature: true })
        this.signData = result;
      }
      this.fileUpload.nativeElement.value = "";
    });
  }

  selectedFile: any = null;
  removeSign() {
    this.signData = null;
    this.selectedFile = null;
  }

  tabchange(i) {

  }

  mailingAddressSubmit() {
    this.mailingSubmit = true;
    Object.keys(this.mailingAddressForm.controls).forEach((key) => {
      if (this.mailingAddressForm.get(key).value && typeof (this.mailingAddressForm.get(key).value) == 'string')
        this.mailingAddressForm.get(key).setValue(this.mailingAddressForm.get(key).value.trim())
    });
    if (this.mailingAddressForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }
    console.log(this.mailingAddressForm.value.id);

    this.userService.updatemailingAddress(this.examinerId, this.mailingAddressForm.value).subscribe(mail => {
      console.log(mail);
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  billingSubmit: boolean = false;
  billingPrviderSubmit() {
    this.billingSubmit = true;
    Object.keys(this.billingProviderForm.controls).forEach((key) => {
      if (this.billingProviderForm.get(key).value && typeof (this.billingProviderForm.get(key).value) == 'string')
        this.billingProviderForm.get(key).setValue(this.billingProviderForm.get(key).value.trim())
    });
    if (this.billingProviderForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }
    console.log(this.billingProviderForm.value.id);

    this.userService.updateBillingProvider(this.examinerId, this.billingProviderForm.value).subscribe(mail => {
      console.log(mail);
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  renderingSubmit: boolean = false;
  renderingFormSubmit() {
    this.renderingSubmit = true;
    Object.keys(this.renderingForm.controls).forEach((key) => {
      if (this.renderingForm.get(key).value && typeof (this.renderingForm.get(key).value) == 'string')
        this.renderingForm.get(key).setValue(this.renderingForm.get(key).value.trim())
    });
    if (this.renderingForm.invalid) {
      window.scrollTo(0, 0)
      return;
    }
    let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    this.renderingForm.value.signature = sign;
    console.log(this.renderingForm.value);
    this.userService.updateRenderingProvider(this.examinerId, this.renderingForm.value).subscribe(render => {

    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  openLicense(data?: any, index?: number) {
    const dialogRef = this.dialog.open(LicenseDialog, {
      width: '800px',
      data: { states: this.states, details: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.userService.createLicense(this.examinerId, result).subscribe(license => {
          console.log(license);
          let data = this.licenceDataSource.data;
          if (result.id) {
            data.splice(index, 1);
          }
          data.push(license.data);
          this.licenceDataSource = new MatTableDataSource(data)
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    });
  }

  editLicense(element, i) {
    this.openLicense(element, i)
  }

  removeLicense(e, index) {
    this.userService.deleteLicense(e.id).subscribe(license => {
      let data = this.licenceDataSource.data;
      data.splice(index, 1);
      this.licenceDataSource = new MatTableDataSource(data)
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  texonomyValue: String;
  texonomyChange(e) {
    this.taxonomyList.map(tex => {
      if (e == tex.id) {
        this.texonomyValue = tex.taxonomy_code;
      }
    })
  }

}

@Component({
  selector: 'license-dialog',
  templateUrl: 'license-dialog.html',
})
export class LicenseDialog {
  states: any;
  licenseForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<LicenseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) {
    dialogRef.disableClose = true;
    this.states = data.states;

    this.licenseForm = this.formBuilder.group({
      id: [""],
      state_license_number: [null, Validators.compose([Validators.required, Validators.maxLength(15)])],
      state_of_license_id: [null, Validators.compose([Validators.required])],
    });
    if (data.details) {
      this.licenseForm.patchValue(data.details)
    }
  }

  addLicense() {
    console.log()
    Object.keys(this.licenseForm.controls).forEach((key) => {
      if (this.licenseForm.get(key).value && typeof (this.licenseForm.get(key).value) == 'string')
        this.licenseForm.get(key).setValue(this.licenseForm.get(key).value.trim())
    });
    if (this.licenseForm.invalid) {
      return;
    }
    this.dialogRef.close(this.licenseForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


