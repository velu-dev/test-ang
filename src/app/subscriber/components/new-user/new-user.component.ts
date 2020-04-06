import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Role } from 'src/app/shared/model/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import * as  errors from '../../../shared/messages/errors'
import { CookieService } from 'src/app/shared/services/cookie.service';
import { Observable } from 'rxjs';
import { ClaimService } from '../../service/claim.service';
export interface Section {
  type: string;
  name: string;
  address: string;

}
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  addresss: Section[] = [
    {
      type: 'primary',
      name: 'Venkatesan',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    },
    {
      type: 'office',
      name: 'Sarath',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    },
    {
      type: 'service',
      name: 'Velusamy',
      address: '30A, Auriss Technologies, Thirumurthi Layout Road, Lawley Road Area, Coimbatore, Tamil Nadu - 641002',
    }
  ];
  userForm: FormGroup;
  addressForm: FormGroup;
  isSubmitted = false;
  isEdit: boolean = false;
  userData: any;
  errorMessages = errors;
  passwordFieldType = "password";
  roles: Role[];
  isAdminCreate: boolean = false;
  activeTitle = "";
  user: any = {};
  states = [];
  filteredOptions: Observable<any[]>;
  addressList: any = { Primary: [], Billing: [], Service: [] };
  addressType: any;
  addAddress: boolean = false;
  billingSearch;
  serviceSearch;
  advanceSearch: FormGroup;
  searchStatus;
  advancedSearch;
  filteredStates;
  myControl = new FormControl();
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: SubscriberUserService,
    private spinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<{ breadcrumb: any }>,
    private _location: Location,
    private cookieService: CookieService,
    private claimService: ClaimService
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
    if (this.user.organization_type == 'INDV') {
      this.user.company_name = '';
    }
    delete this.user.organization_type;
    delete this.user.business_nature;
    delete this.user.logo;

    this.userService.getRoles().subscribe(response => {
      this.roles = response.data;
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

        this.userService.getUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          console.log(res.data)
          this.userForm.setValue(this.userData)
        })
      } else {
      }
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.pattern('[A-Za-z]+'), Validators.maxLength(50)])],
      company_name: [{ value: this.user.company_name, disabled: true }, Validators.compose([Validators.maxLength(100)])],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required]
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

  }

  userSubmit() {
    this.userForm.value.company_name = this.user.company_name
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.userService.createUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.error.error, 'error');
      })
    } else {
      this.userService.updateUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User update successfully", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.message, 'error');
      })
    }
  }
  cancel() {
    this._location.back();
  }

  addressIsSubmitted: boolean = false;
  id: number = 1;
  addressAll = [];
  addressformSubmit() {
    this.addressIsSubmitted = true;
    if (this.addressForm.invalid) {
      console.log(this.addressForm.value)
      return;
    }

    if (this.addressForm.value.id == '' || this.addressForm.value.id == null) {
      this.addressForm.value.id = this.id++
      this.alertService.openSnackBar("Location created successfully", 'success');
      this.addressAll.push(this.addressForm.value)

    } else {
      let index = this.addressAll.findIndex(o => o.id === this.addressForm.value.id)
      this.addressAll.splice(index, 1)
      this.alertService.openSnackBar("Location updated successfully", 'success');
      this.addressAll.push(this.addressForm.value)
    }

    this.addressList = { Primary: [], Billing: [], Service: [] };
    this.addressAll.map(data => {
      let addname;
      if (data.address_type_id == 1) {
        addname = "Service"
      } else if (data.address_type_id == 2) {
        addname = "Billing"
      } else if (data.address_type_id == 3) {
        addname = "Primary"
      }

      this.addressList[addname].push(data)
    })
    this.addAddress = false;
  }

  editAddress(details) {
    this.addAddress = true;
    this.addressForm.setValue(details)
  }

  deleteAddress(id) {
    let index = this.addressAll.findIndex(o => o.id === this.addressForm.value.id)
    this.alertService.openSnackBar("Location deleted successfully", 'success');
    this.addressAll.splice(index, 1);

    this.addressList = { Primary: [], Billing: [], Service: [] };
    this.addressAll.map(data => {
      let addname;
      if (data.address_type_id == 1) {
        addname = "Service"
      } else if (data.address_type_id == 2) {
        addname = "Billing"
      } else if (data.address_type_id == 3) {
        addname = "Primary"
      }
     
      this.addressList[addname].push(data)
    })
  }
}
