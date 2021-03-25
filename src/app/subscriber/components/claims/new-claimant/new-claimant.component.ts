import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatPaginator, MatSort, MatTableDataSource, MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { formatDate } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM-dd-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export const PICK_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-new-claimant',
  templateUrl: './new-claimant.component.html',
  styleUrls: ['./new-claimant.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class NewClaimantComponent implements OnInit {
  dataSource: any = [];
  columnName = [];
  columnsToDisplay = [];
  expandedElement: User | null;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isMobile = false;
  claimantForm: FormGroup;
  errorMessages = errors;
  languageStatus: boolean = false;
  states: any;
  languageList: any;
  certifiedStatusYes: boolean = false;
  certifiedStatusNo: boolean = false;
  isClaimantSubmited: boolean = false;
  claimantId: number;
  today: any;
  claimNumber: any = '';
  editStatus: boolean = true;
  filterValue: string;
  claimantChanges: boolean = false;
  claimantInfo: any;
  minimumDate = new Date(1900, 0, 1);
  streetAddressList = [];
  isAddressError = false;
  isAddressSearched = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private claimService: ClaimService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private intercom: IntercomService,
    private userService: UserService,
    private cookieService: CookieService,
    public dialog: MatDialog
  ) {
    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
    })
    this.intercom.setClaimant("claimant");
    this.route.params.subscribe(param => {
      this.claimantId = param.claimant_id;
      if (param.claimant_id) {
        this.editStatus = false;
        this.getSingleClaimant();

        this.claimService.getclaimantBillable(this.claimantId).subscribe(billableRes => {

          billableRes.data.map(bill => {
            bill.date_of_injury = bill.date_of_injury ? moment(bill.date_of_injury).format("MM-DD-YYYY") : '';
            bill.examiner = bill.ex_last_name + ' ' + bill.ex_first_name
            let parts = []
            if (bill.body_parts) {
              bill.body_parts.map(part => {
                if (part.body_part_name && part.body_part_name.trim() != '') {
                  parts.push(part.body_part_name)
                }
              })
            }
            bill.parts = parts;
          })
          this.dataSource = new MatTableDataSource(billableRes.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return data.exam_type_code && data.exam_type_code.toLowerCase().includes(filter) || (data.claim_number && data.claim_number.includes(filter)) || (data.parts && data.parts[0] && data.parts[0].toLowerCase().includes(filter)) || (data.examiner && data.examiner.toLowerCase().includes(filter)) || (data.date_of_injury && data.date_of_injury.toLowerCase().includes(filter));
          };
          this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
        }, error => {
          console.log("error", error)
          this.dataSource = new MatTableDataSource([]);
        })

      }
    })
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Exam Type", "Status"]
        this.columnsToDisplay = ['is_expand', 'exam_type_code', "status"]
      } else {
        this.columnName = ['Exam Type', 'Claim Number', 'Date of Injury', 'Body Parts', 'Examiner', 'Status']
        this.columnsToDisplay = ['exam_type_code', 'claim_number', 'date_of_injury', 'parts', 'examiner', 'status']
      }
    });
  }


  ngOnInit() {
    this.claimantForm = this.formBuilder.group({
      id: [""],
      last_name: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required,])],
      middle_name: [''],
      suffix: [null, Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z.,/ ]{0,15}$')])],
      date_of_birth: [null, Validators.required],
      gender: [null],
      email: ["", Validators.compose([Validators.email])],
      handedness: [null],
      primary_language_spoken: [null],
      certified_interpreter_required: [null],
      ssn: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_no_1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext1: [null, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      organization_id: [null],
      phone_no_2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_ext2: [null, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      street1: [null],
      street2: [null],
      salutation: [null, Validators.compose([Validators.maxLength(4)])],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      other_language: [null]
    })
    this.claimantForm.get("street1").valueChanges
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
            this.streetAddressList = []
          })
      })
    this.claimService.seedData('language').subscribe(response => {
      this.languageList = response['data'];
    }, error => {
      console.log("error", error)
    })
    this.today = new Date();
    if (this.claimantId) {
      this.claimantForm.disable();

    }

    this.claimantForm.valueChanges.subscribe(val => {
      this.claimantChanges = true;
    });

  }
  selectAddress(street) {
    let state_id: any;
    this.states.map(state => {
      if (state.state_code == street.state) {
        state_id = state.id;
      }
    })
    this.claimantForm.patchValue({
      street1: street.street_line,
      street2: "",
      city: street.city,
      state: state_id,
      zip_code: street.zipcode
    })
    this.changeState("", street.state)
  }
  getSingleClaimant() {
    this.claimService.getSingleClaimant(this.claimantId).subscribe(res => {
      this.intercom.setClaimant(res['data'][0].first_name + ' ' + res['data'][0].last_name);
      this.cookieService.set('claimDetails', res['data'][0].first_name + ' ' + res['data'][0].last_name)
      this.claimantInfo = res['data'][0];
      this.languageStatus = res['data'][0].certified_interpreter_required;
      this.claimNumber = res['data'][0].claim_numbers.map(data => data.claim_number);
      this.changeState(res['data'][0].state, res['data'][0].state_code);
      this.claimantForm.patchValue(res['data'][0])
    }, error => {

    })
  }
  createClaimant() {
    if (this.claimantForm.value.certified_interpreter_required) {
      this.claimantForm.get('primary_language_spoken').setValidators([Validators.required]);
    } else {
      this.claimantForm.get('primary_language_spoken').setValidators([]);
      this.claimantForm.get('primary_language_spoken').enable();
    }

    if (this.claimantForm.value.primary_language_spoken == 20) {
      this.claimantForm.get('other_language').setValidators([Validators.required]);
    } else {
      this.claimantForm.get('other_language').setValidators([]);
    }
    this.claimantForm.get('primary_language_spoken').updateValueAndValidity();
    this.claimantForm.get('other_language').updateValueAndValidity();

    if (!this.claimantChanges) {
      return;
    }


    Object.keys(this.claimantForm.controls).forEach((key) => {
      if (this.claimantForm.get(key).value && typeof (this.claimantForm.get(key).value) == 'string')
        this.claimantForm.get(key).setValue(this.claimantForm.get(key).value.trim())
    });
    this.isClaimantSubmited = true;
    this.claimantForm.value.date_of_birth = moment(this.claimantForm.value.date_of_birth).format("MM-DD-YYYY"); //new Date()//.toDateString();
    if (this.claimantForm.invalid) {
      return;
    }
    //this.claimantForm.value['date_of_birth'] = moment(this.claimantForm.value.date_of_birth).format("MM-DD-YYYY");
    if (!this.claimantId) {
      this.claimService.createClaimant(this.claimantForm.value).subscribe(res => {
        this.alertService.openSnackBar("Claimant created successfully", 'success');
        this.editStatus = false;
        this.claimantForm.disable();
        this._location.back();
        this.claimantChanges = false;
      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error.message, 'error');
        this.claimantChanges = true;
      })
    } else {
      this.claimService.updateClaimant(this.claimantForm.value).subscribe(res => {
        this.alertService.openSnackBar("Claimant updated successfully", 'success');
        this.getSingleClaimant()
        this.editStatus = false;
        this.claimantForm.disable();
        this.claimantChanges = false;
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
        this.claimantChanges = true;
      })
    }
  }

  gender(code) {
    if (code == 'M') {
      return 'Male'
    } else if (code == 'F') {
      return 'Female'
    } else {
      return ''
    }
  }


  language(id) {
    if (id) {
      let index = this.languageList.findIndex(e => e.id == id)
      return this.languageList[index].language ? this.languageList[index].language : '';
    }
  }

  state(id) {
    if (id) {
      let index = this.states.findIndex(e => e.id == id)
      return this.states[index].state ? this.states[index].state : '';
    }
  }


  cancel() {
    //this._location.back();
    if (this.claimantId) {
      this.getSingleClaimant();
      this.editStatus = false;
    } else {
      this._location.back();
    }

    this.claimantForm.disable();
  }

  edit() {
    this.editStatus = true;
    this.claimantForm.enable();
    this.claimantChanges = false;
    if (!this.claimantForm.value.certified_interpreter_required) {
      this.claimantForm.get('primary_language_spoken').disable();
    } else {
      this.claimantForm.get('primary_language_spoken').enable();
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  openPopup() {
    let data = this.userService.getRegulation(["1", "2", "3", "4"])
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: "dsfdsd", regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
  langChange(event) {
    this.claimantForm.get('primary_language_spoken').reset();
    if (event.checked) {
      this.claimantForm.get('primary_language_spoken').enable();
    } else {
      this.claimantForm.get('primary_language_spoken').disable();
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element) {
        this.expandId = null;
      } else {
        this.expandId = element;
      }
  }

  claimNavigate(element?) {
    this.cookieService.set('claimNumber', element.claim_number)
    this.router.navigate([this.router.url + '/claim', element.claim_id])
  }

  billableNavigate() {
    this.router.navigate(['/subscriber/billable-item']);
  }
  claimantState: any;
  changeState(state, state_code?) {
    if (state == null) {
      return;
    }
    if (state_code) {
      this.claimantState = state_code;
      return;
    }
    this.states.map(res => {
      if ((res.id == state) || (res.state == state)) {
        this.claimantState = res.state_code;
      }
    })
  }
  newClaim() {
    this.router.navigate([this.router.url + '/new-claim'])
  }
}
