import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';
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
  dataSource1: any = ELEMENT_DATA;
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
  dataSource: any;
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
      //this.roles = response.data;
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

        this.userService.getEditUser(params_res.id).subscribe(res => {
          this.userData = res.data;
          let user = {
            id: res.data.id,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            middle_name: res.data.middle_name,
            company_name: res.data.company_name,
            sign_in_email_id: res.data.sign_in_email_id,
            role_id: res.data.role_id,
            suffix: res.data.suffix
          }
          this.userForm.patchValue(user)
        })
      } else {
      }
    })
  }

  ngOnInit() {

    this.userForm = this.formBuilder.group({
      id: [""],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      middle_name: ['', Validators.compose([Validators.maxLength(50)])],
      sign_in_email_id: [{ value: '', disabled: this.isEdit }, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])],
      role_id: [{ value: '', disabled: this.isEdit }, Validators.required],
      suffix: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      SameAsSubscriber: [false]
    });
    this.userForm.patchValue({ role_id: 11 })
  }

  sameAsSub(e) {
    console.log(e.checked)
    if (e.checked) {
      this.userForm.disable();
      this.userService.getProfile().subscribe(res => {
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
      })
    }else{
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

    if (this.isExaminer) {
      if (this.userExaminerForm.invalid) {
        window.scrollTo(0, 400)
        this.userExaminerForm.markAllAsTouched();
        return;
      }
      if (this.addressForm.invalid) {
        window.scrollTo(0, 900)
        this.addressForm.markAllAsTouched();
        return;
      }
    }
    if (!this.isEdit) {

      this.userService.createExaminerUser(this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User created successfully!", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })

    }
    else {
      this.userForm.value.role_id = this.userData.role_id
      console.log(this.userForm.value)
      this.userService.updateEditUser(this.userForm.value.id, this.userForm.value).subscribe(res => {
        this.alertService.openSnackBar("User updated successfully!", 'success');
        this.router.navigate(['/subscriber/users'])
      }, error => {
        this.alertService.openSnackBar(error.message, 'error');
      })
    }
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
        //this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file too long", 'error');
        return;
      }
      this.selectedFile = event.target.files[0].name;
      this.openSign(event);
    } else {
      this.selectedFile = null;
      //this.fileUpload.nativeElement.value = "";
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
      //this.fileUpload.nativeElement.value = "";
    });
  }

  selectedFile: any = null;
  removeSign() {
    this.signData = null;
    this.selectedFile = null;
  }

  tabchange(i) {

  }

}


const ELEMENT_DATA = [
  { "id": 132, "address": "123 Street St, Suite 4, Los Angeles, CA 99999-1234", "service_type": "20 - Urgent Care", "phone": "(123) 456 - 7890", "npi_number": "999999999", "status": "Yes" },
  { "id": 132, "address": "123 Street St, Suite 4, Los Angeles, CA 99999-1234", "service_type": "20 - Urgent Care", "phone": "(123) 456 - 7890", "npi_number": "999999999", "status": "Yes" },
  { "id": 132, "address": "123 Street St, Suite 4, Los Angeles, CA 99999-1234", "service_type": "20 - Urgent Care", "phone": "(123) 456 - 7890", "npi_number": "999999999", "status": "Yes" },
  { "id": 132, "address": "123 Street St, Suite 4, Los Angeles, CA 99999-1234", "service_type": "20 - Urgent Care", "phone": "(123) 456 - 7890", "npi_number": "999999999", "status": "Yes" },
  { "id": 132, "address": "123 Street St, Suite 4, Los Angeles, CA 99999-1234", "service_type": "20 - Urgent Care", "phone": "(123) 456 - 7890", "npi_number": "999999999", "status": "Yes" },
  { "id": 132, "address": "123 Street St, Suite 4, Los Angeles, CA 99999-1234", "service_type": "20 - Urgent Care", "phone": "(123) 456 - 7890", "npi_number": "999999999", "status": "Yes" },

];
