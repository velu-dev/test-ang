import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { shareReplay, map, startWith } from 'rxjs/operators';
import { SignPopupComponent } from '../../subscriber-settings/subscriber-settings.component';
import * as  errors from '../../../shared/messages/errors'
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { SubscriberService } from '../../service/subscriber.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExaminerService } from '../../service/examiner.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { IntercomService } from 'src/app/services/intercom.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-new-examiner-user',
  templateUrl: './new-examiner-user.component.html',
  styleUrls: ['./new-examiner-user.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      state('void', style({ height: '0px', minHeight: '0' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
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
  tabIndex: number = 0;
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
  selectedUser: any = {}
  texonomySearch = new FormControl();
  texonomyFilteredOptions: Observable<any>;
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  //@ViewChild(MatSort, { static: false }) sort: MatSort;
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  private paginator: MatPaginator;
  private sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private alertService: AlertService,
    private router: Router,
    private _location: Location,
    private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver,
    private store: Store<{ breadcrumb: any }>,
    private subscriberService: SubscriberService,
    private examinerService: ExaminerService,
    private intercom: IntercomService,
    public dialog: MatDialog) {



    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Address", "Action"]
        this.columnsToDisplay = ['is_expand', 'address', "action"]
      } else {
        this.columnName = ["Address", "Service Type", "Phone", "NPI Number", "Action"]
        this.columnsToDisplay = ['address', 'service', 'phone_no', 'npi_number', "action"]
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

    this.route.params.subscribe(params_res => {
      if (params_res.status == 1) {
        //this.tabIndex = 0
        // setTimeout(() => {
        this.tabIndex = 4
        this.tab = 4
        // }, 1000);

      }
    })

  }

  private _filter(value: string): string[] {
    if (typeof (value) == 'number') {
      return;
    }
    const filterValue = value == undefined ? '' : value && value.toLowerCase();
    return this.taxonomyList.filter(option => option.codeName.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.userService.verifyRole().subscribe(role => {
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
      this.taxonomyList.map(tax => {
        tax.codeName = tax.taxonomy_code + '-' + tax.taxonomy_name;
      })
      setTimeout(() => {
        this.texonomyChange(this.renderingForm.value.taxonomy_id)
      }, 1000);

      this.texonomyFilteredOptions = this.texonomySearch.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }, error => {
      console.log("error", error)
    })

    this.userService.seedData('provider_type').subscribe(response => {
      this.providerTypeList = response['data'];
    }, error => {
      console.log("error", error)
    })

    // this.addresssearch.valueChanges.subscribe(res => {
    // if (res != null) {
    //     //if (res.length > 2)
    //       this.examinerService.searchAddress({ basic_search: res, isadvanced: false }, this.examinerId).subscribe(value => {
    //         this.filteredOptions = value;
    //       })
    //   } else {
    //     //this.filteredOptions = null;
    //  }
    // })
    this.filteredOptions = this.addresssearch.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterLocation(value))
      );

  }

  updateFormData(id) {

    this.userService.getExaminerUser(id).subscribe(res => {
      this.userData = res;
      // if (res.examiner_id == this.user.id) {
      //   this.userForm.disable();
      // }
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
      this.selectedUser = user;

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
        is_person: res.billing_provider.is_person != null ? res.billing_provider.is_person : true,
        national_provider_identifier: res.billing_provider.national_provider_identifier,
        dol_provider_number: res.billing_provider.dol_provider_number,
        tax_id: res.billing_provider.tax_id,
        street1: res.billing_provider.street1,
        street2: res.billing_provider.street2,
        city: res.billing_provider.city,
        state: res.billing_provider.state,
        zip_code: res.billing_provider.zip_code,
        phone_no1: res.billing_provider.phone_no1,
        first_name: res.billing_provider.first_name,
        last_name: res.billing_provider.last_name,
        middle_name: res.billing_provider.middle_name,
        billing_provider_name: res.billing_provider.billing_provider_name,
        suffix: res.billing_provider.suffix,
      }
      this.billingOrgChange(billing.is_person)
      this.billingProviderForm.patchValue(billing)

      let rendering = {
        id: res.rendering_provider.id,
        default_injury_state: res.rendering_provider.default_injury_state,
        is_person: res.rendering_provider.is_person != null ? res.rendering_provider.is_person : true,
        national_provider_identifier: res.rendering_provider.national_provider_identifier,
        provider_type: res.rendering_provider.provider_type,
        taxonomy_id: res.rendering_provider.taxonomy_id,
        provider_status: res.rendering_provider.provider_status != null ? res.rendering_provider.provider_status : true,
        license_details: res.rendering_provider.license_details,
        first_name: res.rendering_provider.first_name,
        last_name: res.rendering_provider.last_name,
        middle_name: res.rendering_provider.middle_name,
        rendering_provider_name: res.rendering_provider.rendering_provider_name,
        suffix: res.rendering_provider.suffix,
        //signature: res.rendering_provider.signature
      }

      this.signData = res.rendering_provider.signature ? 'data:image/png;base64,' + res.rendering_provider.signature : null
      this.renderingOrgChange(rendering.is_person)
      this.renderingForm.patchValue(rendering);

      this.licenceDataSource = new MatTableDataSource(res.rendering_provider.license_details != null ? res.rendering_provider.license_details : [])
      this.licenseData = res.rendering_provider.license_details != null ? res.rendering_provider.license_details : []
      //this.getLocationDetails();
      this.dataSource = new MatTableDataSource(res.service_location != null ? res.service_location : []);
      if (res.service_location != null) {
        res.service_location.map(data => {
          data.address = data.street1;
          data.service = data.service_name ? data.service_code + ' - ' + data.service_name : '';
          data.npi_number = data.national_provider_identifier;
        })
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (data.service && data.service.toLowerCase().includes(filter)) || (data.phone_no && data.phone_no.includes(filter)) || (data.street1 && data.street1.toLowerCase().includes(filter)) || (data.street2 && data.street2.toLowerCase().includes(filter)) || (data.city && data.city.toLowerCase().includes(filter)) || (data.state_name && data.state_name.toLowerCase().includes(filter)) || (data.zip_code && data.zip_code.includes(filter)) || (data.npi_number && data.npi_number.toLowerCase().includes(filter)) || (data.service_code && data.service_code.toString().toLowerCase().includes(filter));
      };
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();

      this.examinerService.searchAddress({ basic_search: '', isadvanced: false }, this.examinerId).subscribe(value => {
        this.locationDataSearch = value.data;
        console.log(this.locationDataSearch)

      })
    })
  }

  locationDataSearch: any;
  private _filterLocation(value: string): string[] {
    // if (typeof (value) == 'number') {
    //   return;
    // }
    const filterValue = value == undefined ? '' : value && value.toLowerCase();
    return this.locationDataSearch.filter(option => option.street1 && option.street1.toLowerCase().includes(filterValue) || option.street2 && option.street2.toLowerCase().includes(filterValue)
      ||  option.city && option.city.toLowerCase().includes(filterValue) || option.state_name && option.state_name.toLowerCase().includes(filterValue) || option.zip_code && option.zip_code.includes(filterValue));
  }


  getLocationDetails() {

    // this.userService.getLocationDetails(this.examinerId).subscribe(response => {
    //   this.dataSource = new MatTableDataSource(response['data']);
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    //   // this.dataSource.filterPredicate = function (data, filter: string): boolean {
    //   //   return (data.service_name && data.service_name.toLowerCase().includes(filter)) || (data.phone_no && data.phone_no.includes(filter)) || (data.street1 && data.street1.toLowerCase().includes(filter)) || (data.street2 && data.street2.toLowerCase().includes(filter)) || (data.city && data.city.toLowerCase().includes(filter)) || (data.state_name && data.state_name.toLowerCase().includes(filter)) || (data.zip_code && data.zip_code.includes(filter));
    //   // };
    // }, error => {
    //   console.log(error)
    //   this.dataSource = new MatTableDataSource([]);
    // })
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
      first_name: ['', Validators.compose([Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      default_injury_state: [null],
      is_person: [true],
      national_provider_identifier: ["", Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])],
      dol_provider_number: ["", Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(10)])],
      tax_id: [null],
      street1: [null],
      street2: [null],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      billing_provider_name: [null, Validators.compose([Validators.maxLength(100)])],

    })

    this.renderingForm = this.formBuilder.group({
      id: [""],
      default_injury_state: [null],
      is_person: [true],
      national_provider_identifier: ["", Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])],
      provider_type: [null],
      taxonomy_id: [null],
      provider_status: [true],
      license_details: [null],
      signature: [null],
      is_new_signature: [false],
      first_name: ['', Validators.compose([Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      rendering_provider_name: [null, Validators.compose([Validators.maxLength(100)])],
    })
  }

  sameAsSub(e) {
    this.isEdit = false;
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
        this.selectedUser = user;
        console.log(this.selectedUser)
        this.userForm.controls.SameAsSubscriber.enable();
      })
    } else {
      this.userForm.reset();
      this.userForm.enable();
    }
  }
  createStatus: boolean = false;
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
    this.selectedUser = this.userForm.value;
    if (!this.isEdit) {
      this.userService.createExaminerUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully!", 'success');
        this.examinerId = res.data.id;
        // this.router.navigate(['/subscriber/users'])
        if (this.examinerId == this.user.id) {
          this.intercom.setUserChanges(true);
          this.selectedUser = this.user;
        }
        this.isEdit = true;
        this.createStatus = true;
        this.userForm.patchValue({ id: res.data.id })
        this.userForm.controls.sign_in_email_id.disable();
        this.userForm.controls.role_id.disable();
        this.userForm.controls.SameAsSubscriber.disable();
        this.userForm.get('sign_in_email_id').updateValueAndValidity();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    }
    else {
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fileChangeEvent(event: any): void {
    let fileName = event.target.files[0].name;
    let fileTypes = ['png', 'jpg', 'jpeg']
    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = Math.round(event.target.files[0].size / 1000); // in KB
      if (FileSize > 501) {
        this.fileUpload.nativeElement.value = "";
        //this.alertService.openSnackBar("This file too long", 'error');
        let title = 'Selected Signature File : "' + fileName + '" file size is ' + FileSize + 'KB is too large.'
        this.openAlertDialog(title, 'File size should be upto 500KB !')
        return;
      }
      this.selectedFile = event.target.files[0].name;
      this.openSign(event);
    } else {
      this.selectedFile = null;
      this.fileUpload.nativeElement.value = "";
      //this.alertService.openSnackBar("This file type is not accepted", 'error');
      this.openAlertDialog('This file type is not accepted', 'Supported File Formats are JPEG/JPG/PNG !')
    }
  }


  openAlertDialog(title, subTitle) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '450px',
      data: { title: title, subTitle: subTitle }
    });
  }

  openSign(e): void {
    const dialogRef = this.dialog.open(SignPopupComponent, {
      // height: '800px',
      width: '800px',
      data: e,

    });

    dialogRef.afterClosed().subscribe(result => {
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

  tab: number = this.tabIndex;
  tabchange(i) {
    if (this.tab == 0) {
      if (this.userForm.touched)
        this.userSubmit();
    } else if (this.tab == 1) {
      if (this.mailingAddressForm.touched)
        this.mailingAddressSubmit();
    } else if (this.tab == 2) {
      if (this.billingProviderForm.touched)
        this.billingPrviderSubmit();
    } else if (this.tab == 3) {
      if (this.renderingForm.touched)
        this.renderingFormSubmit();
    } else if (this.tab == 4) {
      // if (this.loca.touched)
      // this.locationSubmit();
    }
    this.tab = i
    if (i == 0)
      if (i == 4) {
        this.locationAddStatus = false;
      }
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

    this.userService.updatemailingAddress(this.examinerId, this.mailingAddressForm.value).subscribe(mail => {
      if (!this.mailingAddressForm.value.id) {
        this.alertService.openSnackBar("Mailing address added successfully!", 'success');
      } else {
        this.alertService.openSnackBar("Mailing address updated successfully!", 'success');
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  billingSubmit: boolean = false;
  billingPrviderSubmit() {
    this.billingSubmit = true;
    if (this.billingProviderForm.value.is_person) {
      this.billingProviderForm.get('first_name').setValidators([Validators.required, Validators.maxLength(50)]);
      this.billingProviderForm.get('last_name').setValidators([Validators.required, Validators.maxLength(50)]);
      this.billingProviderForm.get('billing_provider_name').setValidators([]);
    } else {
      this.billingProviderForm.get('first_name').setValidators([]);
      this.billingProviderForm.get('last_name').setValidators([]);
      this.billingProviderForm.get('billing_provider_name').setValidators([Validators.required, Validators.maxLength(100)]);
    }

    Object.keys(this.billingProviderForm.controls).forEach((key) => {
      this.billingProviderForm.get(key).updateValueAndValidity();
      if (this.billingProviderForm.get(key).value && typeof (this.billingProviderForm.get(key).value) == 'string')
        this.billingProviderForm.get(key).setValue(this.billingProviderForm.get(key).value.trim())
    });
    if (this.billingProviderForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService.updateBillingProvider(this.examinerId, this.billingProviderForm.value).subscribe(mail => {

      if (!this.billingProviderForm.value.id) {
        this.alertService.openSnackBar("Billing provider added successfully!", 'success');
      } else {
        this.alertService.openSnackBar("Billing provider updated successfully!", 'success');
      }
      this.updateFormData(this.examinerId)
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  renderingSubmit: boolean = false;
  renderingFormSubmit() {
    this.renderingSubmit = true;
    if (this.renderingForm.value.is_person) {
      this.renderingForm.get('first_name').setValidators([Validators.required, Validators.maxLength(50)]);
      this.renderingForm.get('last_name').setValidators([Validators.required, Validators.maxLength(50)]);
      this.renderingForm.get('rendering_provider_name').setValidators([]);
    } else {
      this.renderingForm.get('first_name').setValidators([]);
      this.renderingForm.get('last_name').setValidators([]);
      this.renderingForm.get('rendering_provider_name').setValidators([Validators.required, Validators.maxLength(100)]);
    }
    Object.keys(this.renderingForm.controls).forEach((key) => {
      this.renderingForm.get(key).updateValueAndValidity();
      if (this.renderingForm.get(key).value && typeof (this.renderingForm.get(key).value) == 'string')
        this.renderingForm.get(key).setValue(this.renderingForm.get(key).value.trim())
    });
    this.renderingForm.patchValue({ license_details: this.licenseData })
    if (this.renderingForm.invalid) {
      window.scrollTo(0, 0)
      return;
    }
    let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    this.renderingForm.value.signature = sign;
    this.userService.updateRenderingProvider(this.examinerId, this.renderingForm.value).subscribe(render => {

      if (!this.renderingForm.value.id) {
        this.alertService.openSnackBar("Rendering provider added successfully!", 'success');
      } else {
        this.alertService.openSnackBar("Rendering provider updated successfully!", 'success');
      }
      this.updateFormData(this.examinerId)
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  licenseData: any = [];
  editStatus: boolean = false;
  openLicense(data?: any, index?: number) {

    const dialogRef = this.dialog.open(LicenseDialog, {
      width: '800px',
      data: { states: this.states, details: data, editStatus: this.editStatus }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        // this.userService.createLicense(this.examinerId, result).subscribe(license => {
        //   let data = this.licenceDataSource.data;
        //   if (result.id) {
        //     data.splice(index, 1);
        //   }
        //   data.push(license.data);
        //   this.licenceDataSource = new MatTableDataSource(data)
        // }, error => {
        //   this.alertService.openSnackBar(error.error.message, 'error');
        // })

        // this.licenseData.map(lic=>{
        //   if(lic.license_number == result.license_number && lic.state_id == result.state_id){
        //     this.alertService.openSnackBar('Already added', 'error');
        //     return;
        //   }
        // })
        console.log(result);
        console.log(this.editStatus)
        for (var i in this.licenseData) {
          if (this.licenseData[i].license_number == result.license_number && this.licenseData[i].state_id == result.state_id) {
            this.alertService.openSnackBar('Already added', 'error');
            this.editStatus = false;
            return;
          }
        }
        if (!result.id) {
          if (this.editStatus) {
            // for (var i in this.licenseData) {
            //   if (this.licenseData[i].license_number == result.license_number && this.licenseData[i].state_id == result.state_id) {
            //     this.alertService.openSnackBar('Already added', 'error');
            //     this.editStatus = false;
            //     return;
            //   }
            // }
            this.licenseData.splice(index, 1);
            //this.editStatus = false
          } else {
            // for (var i in this.licenseData) {
            //   if (this.licenseData[i].license_number == result.license_number && this.licenseData[i].state_id == result.state_id) {
            //     this.alertService.openSnackBar('Already added', 'error');
            //     this.editStatus = false;
            //     return;
            //   }
            // }
          }
        } else {
          // if (this.editStatus) {
          //   for (var i in this.licenseData) {
          //     if (this.licenseData[i].license_number == result.license_number && this.licenseData[i].state_id == result.state_id) {
          //       this.alertService.openSnackBar('Already added', 'error');
          //       this.editStatus = false;
          //       return;
          //     }
          //   }
          //   this.licenseData.splice(index, 1);
          // }else{ 
          // this.licenseData.splice(index, 1);
          // }

          this.licenseData.splice(index, 1);
        }
        this.editStatus = false;
        this.licenseData.push(result);
        this.licenceDataSource = new MatTableDataSource(this.licenseData)
        console.log(this.licenseData)
      }

    });
  }

  editLicense(element, i) {
    this.editStatus = true;
    this.openLicense(element, i)
  }

  removeLicense(e, index) {
    this.openDialogLicense('remove', e, index)
  }

  openDialogLicense(dialogue, e, i) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result['data']) {
        if (!e.id) {
          this.licenseData.splice(i, 1);
          this.licenceDataSource = new MatTableDataSource(this.licenseData)
          return
        }
        this.userService.deleteLicense(e.id).subscribe(license => {
          this.licenseData.splice(i, 1);
          this.licenceDataSource = new MatTableDataSource(this.licenseData)
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    });
  }

  texonomyValue: String;
  texonomyChange(e) {
    this.taxonomyList.map(tex => {
      if (e == tex.id) {
        this.texonomyValue = tex.taxonomy_code;
      }
    })
    this.texonomySearch.patchValue(this.texonomyValue)
    this.renderingForm.patchValue({ taxonomy_id: e })
  }

  assignLocation() {
    //this.router.navigate(['/subscriber/location/existing-location', this.examinerId])
    this.addresssearch.patchValue(null);
    this.locationAddStatus = true;
    this.locationData = null;
    this.national_provider_identifier = null;
  }

  removeLocation(e, index) {
    this.openDialog('remove', e);
  }

  //existing location
  addresssearch = new FormControl();
  filteredOptions: any;
  locationData: any = null;
  national_provider_identifier: any = null;
  locationAddStatus: boolean = false;

  addressOnChange(data) {
    this.locationData = null;
    this.locationData = data;
  }

  locationSubmit() {
    if (this.locationData == null) {
      this.alertService.openSnackBar('Please select existing location', 'error');
      return
    }

    let regexp = new RegExp('^[0-9]*$'),
      test = regexp.test(this.national_provider_identifier);
    if (this.national_provider_identifier != null && !test) {
      this.alertService.openSnackBar('Please enter vaild national provider identifier', 'error');
      return;
    }

    let existing = {
      user_id: this.examinerId,
      service_location_id: this.locationData.id,
      national_provider_identifier: this.national_provider_identifier
    }

    this.examinerService.updateExistingLocation(existing).subscribe(location => {
      this.updateFormData(this.examinerId)
      this.locationAddStatus = false;
      this.locationData = null;
      this.national_provider_identifier = null;
      //this.router.navigate(['/subscriber/users/examiner',this.examinerId])
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })

  }

  locationCancel() {
    this.locationAddStatus = false;
    this.locationData = null;
    this.national_provider_identifier = null;
  }

  locationRoute() {
    this.router.navigate([this.router.url + '/add-location/2', this.examinerId])
  }

  openDialog(dialogue, user) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, address: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.subscriberService.removeAssignLocation(this.examinerId, user.id).subscribe(remove => {
          this.alertService.openSnackBar('Location removed successfully', 'success');
          this.updateFormData(this.examinerId)
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })
      }
    });
  }

  editAddress(data) {
    this.router.navigate([this.router.url + '/edit-location', data.id, 2, this.examinerId])
  }

  billingOrgChange(e) {
    this.billingSubmit = false
    if (e) {
      this.billingProviderForm.get('billing_provider_name').disable();
      this.billingProviderForm.get('first_name').enable();
      this.billingProviderForm.get('last_name').enable();
      this.billingProviderForm.get('middle_name').enable();
      this.billingProviderForm.get('suffix').enable();

    } else {

      this.billingProviderForm.get('billing_provider_name').enable();
      this.billingProviderForm.get('first_name').disable();
      this.billingProviderForm.get('last_name').disable();
      this.billingProviderForm.get('middle_name').disable();
      this.billingProviderForm.get('suffix').disable();
    }

    this.billingProviderForm.get('billing_provider_name').updateValueAndValidity();

  }

  renderingOrgChange(e) {
    this.renderingSubmit = false
    if (e) {
      this.renderingForm.get('rendering_provider_name').disable();
      this.renderingForm.get('first_name').enable();
      this.renderingForm.get('last_name').enable();
      this.renderingForm.get('middle_name').enable();
      this.renderingForm.get('suffix').enable();

    } else {

      this.renderingForm.get('rendering_provider_name').enable();
      this.renderingForm.get('first_name').disable();
      this.renderingForm.get('last_name').disable();
      this.renderingForm.get('middle_name').disable();
      this.renderingForm.get('suffix').disable();
    }

    this.renderingForm.get('rendering_provider_name').updateValueAndValidity();

  }

  getState(id) {
    for (var i in this.states)
      if (id == this.states[i].id) {
        return this.states[i].state
      }
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
      license_number: [null, Validators.compose([Validators.required, Validators.maxLength(15)])],
      state_id: [null, Validators.compose([Validators.required])],
    });
    if (data.details) {
      this.licenseForm.patchValue(data.details)
    }

  }

  addLicense() {
    Object.keys(this.licenseForm.controls).forEach((key) => {
      if (this.licenseForm.get(key).value && typeof (this.licenseForm.get(key).value) == 'string')
        this.licenseForm.get(key).setValue(this.licenseForm.get(key).value.trim())
    });
    if (this.licenseForm.invalid) {
      return;
    }

    console.log(this.licenseForm.value)
    this.dialogRef.close(this.licenseForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


