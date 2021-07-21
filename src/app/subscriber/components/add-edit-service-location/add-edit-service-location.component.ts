import { Component, OnInit, Inject } from '@angular/core';
import { SubscriberService } from '../../service/subscriber.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CookieService } from 'src/app/shared/services/cookie.service';
import * as globals from './../../../globals';
import { debounceTime } from 'rxjs/operators';
import { ClaimService } from '../../service/claim.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SubscriberUserService } from '../../service/subscriber-user.service';

@Component({
  selector: 'app-add-edit-service-location',
  templateUrl: './add-edit-service-location.component.html',
  styleUrls: ['./add-edit-service-location.component.scss']
})
export class AddEditServiceLocationComponent implements OnInit {
  locationForm: FormGroup;
  states: any;
  addressType: any;
  locationSubmit: boolean = false;
  pageStatus: number;
  displayedColumns: string[] = ['examiner', 'date_added'];
  dataSource: any;
  editStatus: boolean = true;
  locatStatus: boolean = false;
  locationId: number = null;
  examinerId: number;
  user: any;
  examiner_list: any;
  baseUrl: any;
  streetAddressList = [];
  isAddressError = false;
  isAddressSearched = false;

  constructor(private subscriberService: SubscriberService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog,
    private claimService: ClaimService,
    private userService: SubscriberUserService
  ) {
    this.subscriberService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })
    this.user = JSON.parse(this.cookieService.get('user'));
    this.user['role_id'] = this.cookieService.get('role_id')
    this.route.params.subscribe(params_res => {
      // this.locationForm.enable();
      // this.editStatus = true;
      console.log(params_res)
      this.pageStatus = params_res.status;
      this.examinerId = params_res.id;
      if (params_res.location_id) {
        this.locatStatus = true;
        this.editStatus = false;
        this.locationId = params_res.location_id;
        this.getLocation();
      }
      if (this.examinerId) {
        this.subscriberService.getExaminer(this.examinerId).subscribe(res => {
          this.examinerName = res.examiner_details.last_name + ' ' + res.examiner_details.first_name + (res.examiner_details.suffix ? ', ' + res.examiner_details.suffix : '')
        })
        this.getMailingAddress();
      } else {

      }
    })


  }
  locationData = {};
  examinerName: string;
  getLocation() {

    if (this.pageStatus == 2) {
      this.subscriberService.getSingleLocationExaminer(this.locationId, this.examinerId).subscribe(locations => {
        this.locationUpdate(locations.data['0']);
        this.locationData = locations.data['0'];
        locations.data['0'].examiner_list.map(data => {
          if (data.id == this.examinerId) {
            this.examinerName = data.last_name + ' ' + data.first_name + (data.suffix ? ', ' + data.suffix : '')
          }
        });
        this.edit();
      })
    } else {
      this.subscriberService.getSingleLocation(this.locationId).subscribe(locations => {
        this.locationUpdate(locations.data['0'])
        this.locationData = locations.data['0'];
      })
    }
  }

  locationUpdate(details) {
    console.log(details)
    let location = details
    let data = {
      id: location.id,
      service_location_name: location.service_location_name,
      street1: location.street1,
      street2: location.street2,
      city: location.city,
      state: location.state,
      state_code: location.state_code,
      zip_code: location.zip_code,
      phone_no: location.phone_no,
      fax_no: location.fax_no,
      email: location.email,
      primary_contact: location.primary_contact,
      primary_contact_phone: location.primary_contact_phone,
      phone_ext1: location.phone_ext1,
      alternate_contact_1: location.alternate_contact_1,
      alternate_contact_1_phone: location.alternate_contact_1_phone,
      phone_ext2: location.phone_ext2,
      alternate_contact_2: location.alternate_contact_2,
      alternate_contact_2_phone: location.alternate_contact_2_phone,
      phone_ext3: location.phone_ext3,
      notes: location.notes,
      service_code_id: location.service_code_id,
      national_provider_identifier: location.national_provider_identifier,
      is_active: location.is_active.toString(),
    }
    this.changeState(data.state, data.state_code)
    console.log(this.locationForm.value)
    this.locationForm.patchValue(data);
    console.log(this.locationForm.value)
    this.dataSource = new MatTableDataSource(location.examiner_list ? location.examiner_list : []);
    this.examiner_list = location.examiner_list ? location.examiner_list : [];
    this.locationForm.disable();
  }
  isSubscriberAddressPresent: boolean = false;
  subscriberAddress: any;
  ngOnInit() {
    this.userService.getSubscriberAddress().subscribe(res => {
      if (res.data) {
        this.subscriberAddress = res.data;
        this.isSubscriberAddressPresent = true;
      }
    }, error => { })
    this.locationForm = this.formBuilder.group({
      id: [null],
      service_location_name: [null, Validators.required],
      street1: [null, Validators.required],
      street2: [null],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zip_code: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      phone_no: [null],
      fax_no: [null],
      email: [null, Validators.compose([Validators.pattern('^[A-z0-9._%+-]+@[A-z0-9.-]+\\.[A-z]{2,4}$')])],
      primary_contact: [""],
      phone_ext1: [{ value: "", disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      primary_contact_phone: [""],
      alternate_contact_1: [""],
      alternate_contact_1_phone: [""],
      phone_ext2: [{ value: "", disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      alternate_contact_2: [""],
      alternate_contact_2_phone: [""],
      phone_ext3: [{ value: "", disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      notes: [null],
      service_code_id: [null, Validators.required],
      //national_provider_identifier: [null],
      is_active: ['true'],
    })
    this.locationForm.get('street1').valueChanges
      .pipe(
        debounceTime(500),
      ).subscribe(key => {
        if (key && typeof (key) == 'string')
          key = key.trim();
        this.isAddressSearched = true;
        if (key)
          this.claimService.searchAddress(key).subscribe(address => {
            this.streetAddressList = address.suggestions;
            this.isAddressError = false;
          }, error => {
            if (error.status == 0)
              this.isAddressError = true;
            this.streetAddressList = [];
          })
        else
          this.streetAddressList = [];
      })


    // this.locationForm.get("phone_no").valueChanges.subscribe(res => {
    //   if (this.locationForm.get("phone_no").value && this.locationForm.get("phone_no").valid) {
    //     this.locationForm.get("phone_ext1").enable();
    //   } else {
    //     this.locationForm.get("phone_ext1").reset();
    //     this.locationForm.get("phone_ext1").disable();
    //   }
    // })
    this.locationForm.get("primary_contact_phone").valueChanges.subscribe(res => {
      console.log(this.locationForm.get("primary_contact_phone").value)
      if (this.locationForm.get("primary_contact_phone").value && this.locationForm.get("primary_contact_phone").valid) {
        this.locationForm.get("phone_ext1").enable();
      } else {
        console.log(String(res).length != 10, String(res).length)
        if (String(res).length != 10)
          this.locationForm.get("phone_ext1").reset();
        this.locationForm.get("phone_ext1").disable();
      }
    })
    this.locationForm.get("alternate_contact_1_phone").valueChanges.subscribe(res => {
      console.log(res, this.locationForm.get("alternate_contact_1_phone").value, this.locationForm.get("alternate_contact_1_phone").valid);
      if (this.locationForm.get("alternate_contact_1_phone").value && this.locationForm.get("alternate_contact_1_phone").valid) {
        this.locationForm.get("phone_ext2").enable();
      } else {
        if (String(res).length != 10)
          this.locationForm.get("phone_ext2").reset();
        this.locationForm.get("phone_ext2").disable();
      }
    })
    this.locationForm.get("alternate_contact_2_phone").valueChanges.subscribe(res => {
      if (this.locationForm.get("alternate_contact_2_phone").value && this.locationForm.get("alternate_contact_2_phone").valid) {
        this.locationForm.get("phone_ext3").enable();
      } else {
        if (String(res).length != 10)
          this.locationForm.get("phone_ext3").reset();
        this.locationForm.get("phone_ext3").disable();
      }
    })
    this.subscriberService.seedData('service_code').subscribe(response => {
      this.addressType = response['data'];
    }, error => {
      console.log("error", error)
    })

    if (this.pageStatus == 2) {
      this.locationForm.addControl('national_provider_identifier', new FormControl(null, Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength(15)])));
    }

    let role = this.cookieService.get('role_id')
    switch (role) {
      case '1':
        this.baseUrl = "/admin";
        break;
      case '2':
        this.baseUrl = "/subscriber/";
        break;
      case '3':
        this.baseUrl = "/subscriber/manager/";
        break;
      case '4':
        this.baseUrl = "/subscriber/staff/";
        break;
      case '11':
        this.baseUrl = "/subscriber/examiner/";
        break;
      case '12':
        this.baseUrl = "/subscriber/staff/";
        break;
      default:
        this.baseUrl = "/";
        break;
    }
  }

  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })

    this.locationForm.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  serviceState: any;
  changeState(state, state_code?) {
    if (state_code) {
      this.serviceState = state_code;
      return;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.serviceState = res.state_code;
      }
    })
  }
  locationFromSubmit() {
    Object.keys(this.locationForm.controls).forEach((key) => {
      if (this.locationForm.get(key).value && typeof (this.locationForm.get(key).value) == 'string')
        this.locationForm.get(key).setValue(this.locationForm.get(key).value.trim())
    });
    this.locationSubmit = true;
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched()
      return;
    }

    let examiner = []
    if (this.locationForm.value.is_active == 'false') {
      this.examiner_list.map(ex => {
        if (ex.id != this.user.id) {
          examiner.push(ex)
          this.inActiveStatus = true
        }

      })
      if (this.inActiveStatus) {
        this.opendialog(examiner)
        return;
      }

    }

    if (this.pageStatus == 2) {
      this.subscriberService.updateExaminerLocation(this.examinerId, this.locationForm.value).subscribe(location => {
        //console.log(location)
        if (this.locationForm.value.id) {
          this.alertService.openSnackBar('Service Location Updated Successfully', 'success');
        } else {
          this.alertService.openSnackBar('Service Location Created Successfully', 'success');
        }
        this.router.navigate([this.baseUrl + 'users/examiner', this.examinerId, 1])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    } else {
      this.subscriberService.updateLocation(this.locationForm.value).subscribe(location => {
        //console.log(location)
        if (this.locationForm.value.id) {
          this.alertService.openSnackBar('Service Location Updated Successfully', 'success');
        } else {
          this.alertService.openSnackBar('Service Location Created Successfully', 'success');
        }
        this._location.back();
        // this.router.navigate([this.baseUrl + '/location'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  cancel() {
    if (this.pageStatus == 2) {
      this.router.navigate([this.baseUrl + 'users/examiner', this.examinerId, 1])
      return;
    }
    if (this.locationId) {
      this.getLocation()
      this.editStatus = false;
    } else {
      this._location.back();
    }

  }
  addressesCheck = { mailing_as_subscriber: false, billing_as_subsciber: false, billing_as_mailing: false }
  subscriberMailAddress: any;
  sameAsSubscriber(e, type) {
    if (e.checked) {
      this.addressesCheck.billing_as_mailing = false
      // this.userService.getSubscriberAddress().subscribe(res => {
      delete this.subscriberAddress.id;
      this.subscriberMailAddress = this.subscriberAddress;
      this.changeState("", this.subscriberAddress.state_code)
      this.locationForm.patchValue(this.subscriberAddress);
      this.locationForm.patchValue({
        primary_contact: this.subscriberAddress.contact_person,
        primary_contact_phone: this.subscriberAddress.phone_no1,
        phone_ext1: this.subscriberAddress.phone_ext1,
        alternate_contact_1: this.subscriberAddress.alternate_contact_1,
        alternate_contact_1_phone: this.subscriberAddress.phone_no2,
        phone_ext2: this.subscriberAddress.phone_ext2,
        alternate_contact_2: this.subscriberAddress.phone_ext2,
        alternate_contact_2_phone: this.subscriberAddress.alternate_contact_2_phone,
        phone_ext3: this.subscriberAddress.phone_ext3
      })
      this.states.map(state => {
        if (this.subscriberAddress.state_id == state.id) {
          this.locationForm.patchValue({ state: state.id });
        }
      })
      // })
    } else {
      let addresEmpty = {
        street1: null,
        street2: null,
        city: null,
        state: null,
        zip_code: null,
        phone_no: null,
        phone_ext: null,
        fax_no: null,
        email: null,
        primary_contact: "",
        primary_contact_phone: "",
        alternate_contact_1_phone: "",
        phone_ext1: "",
        alternate_contact_1: "",
        phone_ext2: "",
        phone_ext3: "",
        alternate_contact_2: "",
        alternate_contact_2_phone: "",
      }
      this.locationForm.patchValue(addresEmpty)
    }
  }
  edit() {
    this.editStatus = true;
    this.locationForm.enable();
    // if (this.locationForm.get("phone_no").value && this.locationForm.get("phone_no").valid) {
    //   this.locationForm.get("phone_ext1").enable();
    // } else {
    //   this.locationForm.get("phone_ext1").reset();
    //   this.locationForm.get("phone_ext1").disable();
    // }
    if (this.locationForm.get("primary_contact_phone").value && this.locationForm.get("primary_contact_phone").valid) {
      this.locationForm.get("phone_ext1").enable();
    } else {
      this.locationForm.get("phone_ext1").reset();
      this.locationForm.get("phone_ext1").disable();
    }
    if (this.locationForm.get("alternate_contact_1_phone").value && this.locationForm.get("alternate_contact_1_phone").valid) {
      this.locationForm.get("phone_ext2").enable();
    } else {
      this.locationForm.get("phone_ext2").reset();
      this.locationForm.get("phone_ext2").disable();
    }
    if (this.locationForm.get("alternate_contact_2_phone").value && this.locationForm.get("alternate_contact_2_phone").valid) {
      this.locationForm.get("phone_ext3").enable();
    } else {
      this.locationForm.get("phone_ext3").reset();
      this.locationForm.get("phone_ext3").disable();
    }
  }

  nevigateExaminer(e) {
    // this.router.navigate(['/subscriber/users/examiner/',e.id])
  }
  inActiveStatus: boolean = false;
  locationStatus(e) {
    console.log(e.value, this.user.role_id)

  }
  isMailingAddressPresent = false;
  maillingAddress: any
  getMailingAddress() {
    this.subscriberService.getMaillingAddress(this.examinerId).subscribe(address => {
      if (address.data) {
        this.isMailingAddressPresent = true;
        address.data.notes = null;
        console.log(address.data)
        this.maillingAddress = address.data
      } else {
        this.isMailingAddressPresent = false;
      }
    }, error => {
      this.isMailingAddressPresent = false;
      this.maillingAddress = null
      // let addresEmpty = {
      //   street1: null,
      //   street2: null,
      //   city: null,
      //   state: null,
      //   zip_code: null,
      //   phone_no: null,
      //   fax_no: null,
      //   email: null,
      //   primary_contact: "",
      //   primary_contact_phone: "",
      //   alternate_contact_1_phone: "",
      //   alternate_contact_1: "",
      //   alternate_contact_2: "",
      //   alternate_contact_2_phone: "",
      // }
      // this.locationForm.patchValue(addresEmpty);
    })
  }
  sameAsMailling(e) {
    console.log(this.maillingAddress)
    if (e.checked) {
      this.addressesCheck.billing_as_subsciber = true;
      if (!this.maillingAddress) {
        this.locationForm.patchValue(this.maillingAddress);
        this.locationForm.patchValue({
          primary_contact: this.maillingAddress.contact_person,
          primary_contact_phone: this.maillingAddress.phone_no1,
          phone_ext1: "",
          alternate_contact_1: "",
          alternate_contact_1_phone: this.maillingAddress.phone_no2,
          phone_ext2: "",
          alternate_contact_2: "",
          alternate_contact_2_phone: "",
          phone_ext3: ""
        })
        this.changeState(this.maillingAddress.state, this.maillingAddress.state_code)

      } else {
        this.addressesCheck.billing_as_subsciber = false;
        this.locationForm.patchValue({
          primary_contact: this.maillingAddress.contact_person,
          primary_contact_phone: this.maillingAddress.phone_no1,
          phone_ext1: "",
          alternate_contact_1: "",
          alternate_contact_1_phone: this.maillingAddress.phone_no2,
          phone_ext2: "",
          alternate_contact_2: "",
          alternate_contact_2_phone: "",
          phone_ext3: ""
        })
        this.locationForm.patchValue(this.maillingAddress)
        this.changeState(this.maillingAddress.state, this.maillingAddress.state_code)
      }

    } else {
      let addresEmpty = {
        street1: null,
        street2: null,
        city: null,
        state: null,
        zip_code: null,
        phone_no: null,
        phone_ext: null,
        fax_no: null,
        email: null,
        primary_contact: "",
        primary_contact_phone: "",
        alternate_contact_1_phone: "",
        phone_ext1: "",
        alternate_contact_1: "",
        phone_ext2: "",
        phone_ext3: "",
        alternate_contact_2: "",
        alternate_contact_2_phone: "",
      }
      this.locationForm.patchValue(addresEmpty)
    }
  }

  opendialog(examiner): void {
    const dialogRef = this.dialog.open(InActivedialog, {
      width: '500px',
      data: { examiner: examiner },

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.subscriberService.updateLocation(this.locationForm.value).subscribe(location => {
          //console.log(location)
          if (this.locationForm.value.id) {
            this.alertService.openSnackBar('Service Location Updated Successfully', 'success');
          } else {
            this.alertService.openSnackBar('Service Location Created Successfully', 'success');
          }
          this._location.back();
          // this.router.navigate([this.baseUrl + '/location']);
        }, error => {
          this.alertService.openSnackBar(error.error.message, 'error');
        })

      }
    });
  }

}

@Component({
  selector: 'inactive-dialog',
  templateUrl: 'in-active-dialog.html',
})
export class InActivedialog {

  info = globals.info
  alert = globals.alert
  examiner: any;
  constructor(
    public dialogRef: MatDialogRef<InActivedialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    this.examiner = data.examiner;
    console.log(data)
  }

  onNoClick(): void {
    this.dialogRef.close({ data: false });
  }

  onYesClick(): void {
    this.dialogRef.close(
      { data: true }
    );
  }

}
