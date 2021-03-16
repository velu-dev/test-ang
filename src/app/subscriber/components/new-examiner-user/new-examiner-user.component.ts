import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatPaginator, MatAutocompleteTrigger } from '@angular/material';
import { Observable } from 'rxjs';
import { shareReplay, map, startWith, debounceTime } from 'rxjs/operators';
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
import * as globals from '../../../globals';
import { saveAs } from 'file-saver';
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
  selected: any;
  examinerNumber: any;
  isEmailId: boolean = false;
  pdf = globals.pdf;
  file: any;
  w9Url: any;
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  @ViewChild('uploaderBilling', { static: true }) fileUploadBilling: ElementRef;
  @ViewChild(MatAutocompleteTrigger, { static: false }) addressAutocomplete: MatAutocompleteTrigger;
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
  isAddresssearchError = false;
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
        this.columnName = ["Location Name", "Address", "Service Type", "Phone", "NPI Number", "Action"]
        this.columnsToDisplay = ['service_location_name', 'address', 'service', 'phone_no', 'npi_number', "action"]
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
    this.intercom.setExaminerPage(true)
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
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      SameAsSubscriber: [{ value: false, disabled: this.isEdit }],
      is_examiner_with_email: [false]
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
      this.texonomySearch.valueChanges.subscribe(res => {
        if (res == "") {
          this.clearAutoComplete();
        }
      })
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
    this.addresssearch.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(res => {
        if (this.addresssearch.errors) {
          this.isAddresssearchError = true;
          return
        } else {
          this.isAddresssearchError = false;
          this.filteredOptions = this.addresssearch.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filterLocation(value))
            );
        }
      })
  }

  enableEmail(status) {
    if (status) {
      this.userForm.get('sign_in_email_id').enable();
    } else {
      this.userForm.get('sign_in_email_id').disable();
      this.userForm.get('sign_in_email_id').setValue('')
    }

  }

  updateFormData(id) {

    this.userService.getExaminerUser(id).subscribe(res => {
      this.userData = res;
      this.examinerNumber = res.examiner_details.examiner_reference_id
      // if (res.examiner_id == this.user.id) {
      //   this.userForm.disable();
      // }
      let user = {
        id: res.examiner_details.id,
        first_name: res.examiner_details.first_name,
        last_name: res.examiner_details.last_name,
        middle_name: res.examiner_details.middle_name,
        company_name: res.examiner_details.company_name,
        sign_in_email_id: res.examiner_details.sign_in_email_id.includes('@') ? res.examiner_details.sign_in_email_id : '',
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
        state_code: res.mailing_address.state_code,
        zip_code: res.mailing_address.zip_code,
        phone_no1: res.mailing_address.phone_no1,
        phone_ext1: res.mailing_address.phone_ext1,
        phone_no2: res.mailing_address.phone_no2,
        phone_ext2: res.mailing_address.phone_ext2,
        fax_no: res.mailing_address.fax_no,
        email: res.mailing_address.email,
        contact_person: res.mailing_address.contact_person,
        notes: res.mailing_address.notes,
      }
      this.changeState(mailing.state, 'mailing', mailing.state_code);
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
        state_code: res.billing_provider.state_code,
        zip_code: res.billing_provider.zip_code,
        phone_no1: res.billing_provider.phone_no1,
        phone_ext1: res.billing_provider.phone_ext1,
        first_name: res.billing_provider.first_name,
        last_name: res.billing_provider.last_name,
        middle_name: res.billing_provider.middle_name,
        billing_provider_name: res.billing_provider.billing_provider_name,
        suffix: res.billing_provider.suffix,
        fax_no: res.billing_provider.fax_no
      }
      this.file = res.billing_provider.w9_form_file_name;
      this.w9Url = res.billing_provider.w9_form_file_url
      this.billingOrgChange(billing.is_person)
      this.changeState(billing.default_injury_state, 'billing', res.billing_provider.default_injury_state_code);
      this.changeState(billing.state, 'cms', billing.state_code);
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
        county: res.rendering_provider.county
        //signature: res.rendering_provider.signature
      }

      this.signData = res.rendering_provider.signature ? 'data:image/png;base64,' + res.rendering_provider.signature : null
      this.renderingOrgChange(rendering.is_person);
      console.log(res)
      this.changeState(rendering['default_injury_state'], 'render', res.rendering_provider.default_injury_state_code);
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
          data.service_location_name = data.service_location_name;
        })
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (data.service_location_name && data.service_location_name.toLowerCase().includes(filter)) || (data.service && data.service.toLowerCase().includes(filter)) || (data.phone_no && data.phone_no.includes(filter)) || (data.street1 && data.street1.toLowerCase().includes(filter)) || (data.street2 && data.street2.toLowerCase().includes(filter)) || (data.city && data.city.toLowerCase().includes(filter)) || (data.state_name && data.state_name.toLowerCase().includes(filter)) || (data.zip_code && data.zip_code.includes(filter)) || (data.npi_number && data.npi_number.toLowerCase().includes(filter)) || (data.service_code && data.service_code.toString().toLowerCase().includes(filter));
      };
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();

      this.examinerService.searchAddress({ basic_search: '', isadvanced: false }, this.examinerId).subscribe(value => {
        this.locationDataSearch = value.data;
      })
      if (this.user.role_id != 2 && user.SameAsSubscriber) {
        this.userForm.disable();
      }
    })
  }

  locationDataSearch: any = [];
  private _filterLocation(value: string): string[] {
    // if (typeof (value) == 'number') {
    //   return;
    // }
    const filterValue = value == undefined ? '' : value && value.toLowerCase();
    return this.locationDataSearch.filter(option => option.street1 && option.street1.toLowerCase().includes(filterValue) || option.street2 && option.street2.toLowerCase().includes(filterValue)
      || option.city && option.city.toLowerCase().includes(filterValue) || option.state_name && option.state_name.toLowerCase().includes(filterValue) || option.zip_code && option.zip_code.includes(filterValue));
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
      phone_ext1: [null, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      phone_no2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext2: [null, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
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
      national_provider_identifier: [null, Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])],
      dol_provider_number: [null, Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(10)])],
      tax_id: [null],
      street1: [''],
      street2: [''],
      city: [''],
      state: [null],
      zip_code: ['', Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no1: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
      phone_ext1: [null, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      billing_provider_name: ['', Validators.compose([Validators.maxLength(100)])],
      fax_no: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      file: [''],
      isFileChanged: [false]

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
      county: [null]
    })
  }

  sameAsSub(e) {
    this.isEdit = false;
    this.isSubmitted = false;
    if (e.checked) {
      this.formInit();
      this.isEmailId = false;
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
      this.userForm.patchValue({ role_id: 11 })
    }
  }
  createStatus: boolean = false;
  userSubmit(status?) {

    this.userForm.value.company_name = this.user.company_name
    this.isSubmitted = true;

    Object.keys(this.userForm.controls).forEach((key) => {
      if (this.userForm.get(key).value && typeof (this.userForm.get(key).value) == 'string')
        this.userForm.get(key).setValue(this.userForm.get(key).value.trim())
    });
    if (this.isEmailId) {
      this.userForm.controls.sign_in_email_id.setValidators(Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')]))
    } else {
      this.userForm.controls.sign_in_email_id.setValidators([])
    }
    this.userForm.controls.sign_in_email_id.updateValueAndValidity();
    if (this.userForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }
    this.selectedUser = this.userForm.value;
    if (!this.isEdit) {
      this.userService.createExaminerUser(this.userForm.getRawValue()).subscribe(res => {
        this.alertService.openSnackBar("User created successfully", 'success');
        this.examinerId = res.data.id;
        this.examinerService.searchAddress({ basic_search: '', isadvanced: false }, this.examinerId).subscribe(value => {
          this.locationDataSearch = value.data;
        })
        this.examinerNumber = res.data.examiner_reference_id;
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
        if (this.isEmailId) {
          this.userForm.controls.is_examiner_with_email.setValue(false);
          this.isEmailId = true;
          this.userData = { examiner_details: { is_examiner_login: true } }

        }
        this.userForm.get('role_id').updateValueAndValidity();
        if (status == 'next') {
          this.tabIndex = 1;
        } else if (status == 'close') {
          // this._location.back();
          this.cancel()
        }
        this.userForm.markAsUntouched();
        this.userForm.updateValueAndValidity();
      }, error => {
        this.tabIndex = 0;
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    }
    else {
      this.userService.updateEditUser(this.userForm.getRawValue().id, this.userForm.getRawValue()).subscribe(res => {
        this.alertService.openSnackBar("User updated successfully", 'success');
        //this.examinerId = res.data.id;
        if (this.isEmailId) {
          this.userForm.controls.sign_in_email_id.disable();
          this.userForm.controls.is_examiner_with_email.setValue(false)
          this.isEmailId = true;
          this.userData = { examiner_details: { is_examiner_login: true } }
        }

        // this.router.navigate(['/subscriber/users'])
        if (status == 'next') {
          this.tabIndex = 1;
        } else if (status == 'close') {
          // this._location.back();
          this.cancel();
        }

        this.userForm.markAsUntouched();
        this.userForm.updateValueAndValidity();
      }, error => {
        this.tabIndex = 0;
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }


  }
  role: any;
  cancel() {
    // this._location.back();
    this.role = this.cookieService.get('role_id')
    switch (this.role) {
      case '2':
        this.router.navigate(["/subscriber/users"]);
        break;
      case '3':
        this.router.navigate(["/subscriber/manager/users"]);
        break;
      case '4':
        this.router.navigate(["/subscriber/staff/users"]);
        break;
      case '12':
        this.router.navigate(["/subscriber/staff/users"]);
        break;
      default:
        this._location.back();
        break;
    }
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
    if (this.isMobile)
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
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
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize >= 3.5) {
        this.fileUpload.nativeElement.value = "";
        //this.alertService.openSnackBar("File size is too large", 'error');
        let title = 'Selected Signature File : "' + fileName + '" file size is ' + FileSize + 'MB is too large.'
        this.openAlertDialog(title, 'File size should be upto 3MB !')
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
      if (this.renderingForm.touched || this.licenseChangeStatus) {
        this.renderingFormSubmit();
      }
      if (this.texonomySearch.touched) {
        this.renderingFormSubmit();
      }
    } else if (this.tab == 4) {
      // if (this.loca.touched)
      // this.locationSubmit();
    }
    this.tab = i
    //if (i == 0)
    if (i == 4) {
      this.locationAddStatus = false;
    }
    this.selected = -1
  }

  mailingAddressSubmit(status?) {
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
        this.alertService.openSnackBar("Mailing address added successfully", 'success');
      } else {
        this.alertService.openSnackBar("Mailing address updated successfully", 'success');
      }
      this.mailingAddressForm.markAsUntouched();
      this.mailingAddressForm.updateValueAndValidity();
      if (status == 'next') {
        this.tabIndex = 2;
      } else if (status == 'close') {
        //this._location.back();
        this.cancel();
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  billingSelectedFile: File;


  errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
  addFile(event) {

    this.billingSelectedFile = null;
    let fileTypes = ['pdf']

    if (fileTypes.includes(event.target.files[0].name.split('.').pop().toLowerCase())) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 30) {
        this.errors.file.isError = true;
        this.errors.file.error = "File size is too large";
        this.alertService.openSnackBar("File size is too large", 'error');
        return;
      }
      this.errors = { file: { isError: false, error: "" }, doc_type: { isError: false, error: "" } }
      this.errors.doc_type.error = "";
      this.file = event.target.files[0].name;
      this.billingSelectedFile = event.target.files[0];
      this.billingProviderForm.get('isFileChanged').patchValue(true);
      this.billingProviderForm.get('file').patchValue(this.billingSelectedFile);
      this.w9Url = null;
      this.fileUploadBilling.nativeElement.value = "";
    } else {
      this.billingSelectedFile = null;
      this.errors.file.isError = true;
      this.fileUploadBilling.nativeElement.value = "";
      this.errors.file.error = "This file type is not accepted";
      this.alertService.openSnackBar("This file type is not accepted", 'error');
    }

  }

  downloadDocumet(element) {
    if (element.file_url)
      this.examinerService.downloadOndemandDocuments({ file_url: element.file_url }).subscribe(res => {
        this.alertService.openSnackBar("File downloaded successfully", "success");
        saveAs(res.signed_file_url, element.file_name);
      })
  }

  billingSubmit: boolean = false;
  billingPrviderSubmit(status?) {
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
    let formData = new FormData()
    Object.keys(this.billingProviderForm.controls).forEach((key) => {
      this.billingProviderForm.get(key).updateValueAndValidity();
      if (this.billingProviderForm.get(key).value && typeof (this.billingProviderForm.get(key).value) == 'string') {
        this.billingProviderForm.get(key).setValue(this.billingProviderForm.get(key).value.trim())
      }
      if (this.billingProviderForm.get(key).value == null) {
        this.billingProviderForm.get(key).setValue('');
      }
      if (key != 'file') {
        formData.append(key, this.billingProviderForm.get(key).value.toString())
      }

    });
    if (this.billingProviderForm.invalid) {
      window.scrollTo(0, 0)
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.billingSelectedFile) {
      formData.append('file', this.billingSelectedFile)
    }

    this.userService.updateBillingProvider(this.examinerId, formData).subscribe(mail => {

      if (!this.billingProviderForm.value.id) {
        this.alertService.openSnackBar("Billing provider added successfully", 'success');
      } else {
        this.alertService.openSnackBar("Billing provider updated successfully", 'success');
      }
      this.updateFormData(this.examinerId);
      this.billingProviderForm.markAsUntouched();
      this.billingProviderForm.updateValueAndValidity();
      if (status == 'next') {
        this.tabIndex = 3;
      } else if (status == 'close') {
        //this._location.back();
        this.cancel()
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  clearAutoComplete() {
    this.renderingForm.patchValue({
      taxonomy_id: null
    })
    this.texonomyValue = null;
    this.texonomySearch.reset();
  }
  renderingSubmit: boolean = false;
  renderingFormSubmit(status?) {
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
    if (!this.texonomyValue) {
      this.texonomyValue = null
      this.texonomySearch.patchValue("")
    }
    let sign = this.signData ? this.signData.replace('data:image/png;base64,', '') : '';
    this.renderingForm.value.signature = sign;
    console.log(this.renderingForm.value)
    this.userService.updateRenderingProvider(this.examinerId, this.renderingForm.value).subscribe(render => {
      this.licenseChangeStatus = false;
      if (!this.renderingForm.value.id) {
        this.alertService.openSnackBar("Rendering provider added successfully", 'success');
      } else {
        this.alertService.openSnackBar("Rendering provider updated successfully", 'success');
      }
      this.updateFormData(this.examinerId);
      this.renderingForm.markAsUntouched();
      this.renderingForm.updateValueAndValidity();
      if (status == 'next') {
        this.tabIndex = 4;
      } else if (status == 'close') {
        // this._location.back();
        this.cancel();
      }
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  licenseData: any = [];
  editStatus: boolean = false;
  licenseChangeStatus: boolean = false;
  openLicense(data?: any, index?) {
    this.editStatus = this.editStatus;
    const dialogRef = this.dialog.open(LicenseDialog, {
      width: '800px',
      data: { states: this.states, details: data, editStatus: this.editStatus }
    });

    dialogRef.afterClosed().subscribe(result => {

      //With ID
      if (result) {
        if (result.id) {
          console.log("with")
          for (var i in this.licenseData) {
            if (i != index) {
              if (this.licenseData[i].state_id == result.state_id) {
                this.alertService.openSnackBar('Already added', 'error');
                this.editStatus = false;
                return;
              }
            }
          }
          if (this.editStatus) {
            this.licenseData[index] = result;
            this.licenseChangeStatus = true;
            this.alertService.openSnackBar('License Updated Successfully', 'success');
            this.licenceDataSource = new MatTableDataSource(this.licenseData)
            return
          }
          this.editStatus = false;
          this.licenseChangeStatus = true;
          this.licenseData.push(result);
          this.alertService.openSnackBar('License Added Successfully', 'success');
          console.log(result);
          this.licenceDataSource = new MatTableDataSource(this.licenseData);
          console.log(this.licenceDataSource);
          return
        }


        //Without ID
        if (!result.id) {
          console.log("without")
          for (var i in this.licenseData) {
            if (i != index) {
              if (this.licenseData[i].state_id == result.state_id) {
                this.alertService.openSnackBar('Already added', 'error');
                this.editStatus = false;
                return;
              }
            }
          }
          if (this.editStatus) {
            this.licenseData[index] = result;
            this.licenseChangeStatus = true;
            console.log(this.licenseData)
            this.alertService.openSnackBar('License Updated Successfully', 'success');
            this.licenceDataSource = new MatTableDataSource(this.licenseData);
            console.log(this.licenceDataSource);
            return
          }

          this.editStatus = false;
          this.licenseChangeStatus = true;
          this.licenseData.push(result);
          console.log(this.licenseData)
          this.alertService.openSnackBar('License Added Successfully', 'success');
          this.licenceDataSource = new MatTableDataSource(this.licenseData)
          console.log(this.licenseData)
        }

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
      width: '500px',
      data: { name: dialogue, address: true, title: e.license_number }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result['data']) {
        if (!e.id) {
          this.licenseData.splice(i, 1);
          this.alertService.openSnackBar('License Removed Successfully', 'success');
          this.licenceDataSource = new MatTableDataSource(this.licenseData)
          return
        }
        this.userService.deleteLicense(e.id).subscribe(license => {
          this.licenseData.splice(i, 1);
          this.alertService.openSnackBar('License Removed Successfully', 'success');
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
  assignLocation(event: Event, trigger: MatAutocompleteTrigger) {
    this.addresssearch.patchValue(null);
    this.locationAddStatus = true;
    this.locationData = null;
    this.national_provider_identifier = null;
    setTimeout(() => {
      event.stopPropagation();
      trigger.openPanel();
    }, 300);
    //this.router.navigate(['/subscriber/location/existing-location', this.examinerId])
  }

  removeLocation(e, index) {
    this.openDialog('remove', e);
  }

  //existing location
  addresssearch = new FormControl("", Validators.compose([Validators.pattern("^[a-zA-Z0-9-&, ]{0,100}$")]));
  filteredOptions: any;
  locationData: any = null;
  national_provider_identifier: any = null;
  locationAddStatus: boolean = false;

  addressOnChange(data) {
    this.locationData = null;
    this.locationData = data;
    this.selected = -1
  }

  locationSubmit() {
    if (this.locationData == null) {
      this.alertService.openSnackBar('Please select existing location', 'error');
      return
    }

    let regexp = new RegExp('^[0-9]*$'),
      test = regexp.test(this.national_provider_identifier);
    if (this.national_provider_identifier != null && !test) {
      this.alertService.openSnackBar('Please enter valid national provider identifier', 'error');
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

  cmsState: any;
  mailingState: any;
  billingState: any;
  renderState: any;
  changeState(state, type, state_code?) {
    if (state_code) {
      if (type == 'cms') {
        this.cmsState = state_code;
      } else if (type == 'billing') {
        this.billingState = state_code;
      } else if (type == 'render') {
        this.renderState = state_code;
      } else if (type == 'mailing') {
        this.mailingState = state_code;
      }
      return
    }
    //console.log(state)
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        if (type == 'cms') {
          this.cmsState = res.state_code;
        } else if (type == 'billing') {
          this.billingState = res.state_code;
        } else if (type == 'render') {
          this.renderState = res.state_code;
        } else if (type == 'mailing') {
          this.mailingState = res.state_code;
        }
      }
    })
  }
  openDialog(dialogue, user) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: "Service Location" }
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
    if (this.router.url.includes('new-examiner')) {
      this.router.navigate([this.router.url + '/edit-location', data.id, 2, this.examinerId])
    } else {
      this.router.navigate([this.router.url + '/edit-location', data.id, 2])
    }

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
  getStateCode(id) {
    for (var i in this.states)
      if (id == this.states[i].id) {
        return this.states[i].state_code;
      }
  }

  sameAsMailling(e) {
    if (e.checked) {
      let addAddress = {
        street1: this.mailingAddressForm.value.street1,
        street2: this.mailingAddressForm.value.street2,
        city: this.mailingAddressForm.value.city,
        state: this.mailingAddressForm.value.state,
        zip_code: this.mailingAddressForm.value.zip_code,
        phone_no1: this.mailingAddressForm.value.phone_no1,
        phone_ext1: this.mailingAddressForm.value.phone_ext1,
        fax_no: this.mailingAddressForm.value.fax_no
      }
      this.billingProviderForm.patchValue(addAddress)
      this.changeState(this.mailingAddressForm.value.state, 'cms')
    } else {
      let addresEmpty = {
        street1: null,
        street2: null,
        city: null,
        state: null,
        zip_code: null,
        phone_no1: null,
        phone_ext1: null,
        fax_no: null
      }
      this.billingProviderForm.patchValue(addresEmpty);
    }
  }
  npiChange(e, i) {
    if (e.checked) {
      if (i == 1) {
        this.national_provider_identifier = this.renderingForm.value.national_provider_identifier
      } else {
        this.national_provider_identifier = this.billingProviderForm.value.national_provider_identifier
      }
    } else {
      this.national_provider_identifier = null;
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
    console.log(data)
    dialogRef.disableClose = true;
    this.states = data.states;

    this.licenseForm = this.formBuilder.group({
      id: [""],
      license_number: [null, Validators.compose([Validators.required, Validators.maxLength(15)])],
      state_id: [null, Validators.compose([Validators.required])],
    });
    if (data.details) {
      if (data.id) {
        this.changeState(data.details.state, data.details.state_code);
      } else {
        this.changeState(data.details.state_id);
      }

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
    this.changeState(this.licenseForm.get('state_id').value)
    this.dialogRef.close(this.licenseForm.value);
  }
  licenceState: any;
  changeState(state, state_code?) {
    if (state_code) {
      this.licenceState = state_code;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.licenceState = res.state_code;
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


