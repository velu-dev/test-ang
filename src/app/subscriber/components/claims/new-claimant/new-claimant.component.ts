import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as  errors from './../../../../shared/messages/errors'
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
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
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
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
  constructor(
    private breakpointObserver: BreakpointObserver,
    private claimService: ClaimService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private _location: Location,
    private route: ActivatedRoute,

  ) {
    this.route.params.subscribe(param => {
      this.claimantId = param.id;
      if (param.id) {
        this.editStatus = false;
        this.getSingleClaimant();

        this.claimService.getclaimantBillable(this.claimantId).subscribe(billableRes => {

          billableRes.data.map(bill => {
            bill.date_of_injury = bill.date_of_injury ? moment(bill.date_of_injury).format("MM-DD-YYYY") : '';
            bill.examiner = bill.ex_last_name + ' ' + bill.ex_first_name
            let parts = []
            if(bill.body_parts){
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
            return data.exam_type_code && data.exam_type_code.toLowerCase().includes(filter) || (data.claim_number && data.claim_number.includes(filter)) || (data.parts  && data.parts[0] && data.parts[0].toLowerCase().includes(filter)) || (data.examiner && data.examiner.toLowerCase().includes(filter)) || (data.date_of_injury && data.date_of_injury.toLowerCase().includes(filter));
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
      suffix: [null],
      date_of_birth: [null, Validators.required],
      gender: [null],
      email: ["", Validators.compose([Validators.email])],
      handedness: [null],
      //primary_language_not_english: [null],
      primary_language_spoken: [null],
      certified_interpreter_required: [null],
      ssn: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      phone_no_1: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      organization_id: [null],
      phone_no_2: [null, Validators.compose([Validators.pattern('[0-9]+')])],
      street1: [null],
      street2: [null],
      salutation: [null, Validators.compose([Validators.maxLength(4)])],
      city: [null],
      state: [null],
      zip_code: [null, Validators.compose([Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')])],
      created_by: [null],
      modified_by: [null],
      createdAt: [null],
      updatedAt: [null],
      claim_numbers: [],
      examiners_name: []
    })



    this.claimService.seedData('state').subscribe(response => {
      this.states = response['data'];
    }, error => {
      console.log("error", error)
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

  }
  getSingleClaimant() {
    this.claimService.getSingleClaimant(this.claimantId).subscribe(res => {
      console.log(res);
      this.languageStatus = res['data'][0].certified_interpreter_required;
      this.claimNumber = res['data'][0].claim_numbers.map(data => data.claim_number)
      this.claimantForm.patchValue(res['data'][0])
    }, error => {

    })
  }
  createClaimant() {
    if (!this.claimantForm.touched) {
      return;
    }

    Object.keys(this.claimantForm.controls).forEach((key) => {
      if (this.claimantForm.get(key).value && typeof (this.claimantForm.get(key).value) == 'string')
        this.claimantForm.get(key).setValue(this.claimantForm.get(key).value.trim())
    });
    this.isClaimantSubmited = true;
    this.claimantForm.value.date_of_birth = new Date(this.claimantForm.value.date_of_birth).toDateString();
    if (this.claimantForm.invalid) {
      return;
    }

    if (!this.claimantId) {
      this.claimService.createClaimant(this.claimantForm.value).subscribe(res => {
        this.alertService.openSnackBar("Claimant created successfully!", 'success');
        this.editStatus = false;
        this.claimantForm.disable();
        this._location.back();
      }, error => {
        console.log(error);
        this.alertService.openSnackBar(error.error, 'error');
      })
    } else {
      this.claimService.updateClaimant(this.claimantForm.value).subscribe(res => {
        this.alertService.openSnackBar("Claimant updated successfully!", 'success');
        this.getSingleClaimant()
        this.editStatus = false;
        this.claimantForm.disable();
      }, error => {
        this.alertService.openSnackBar(error.error, 'error');
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
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  langChange() {
    this.claimantForm.patchValue({ primary_language_spoken: null })
    if (this.languageStatus) {
      this.claimantForm.get('primary_language_spoken').setValidators([Validators.required]);
    } else {
      this.claimantForm.get('primary_language_spoken').setValidators([]);
    }
    this.claimantForm.get('primary_language_spoken').updateValueAndValidity();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }

  claimNavigate(element) {
    //this.router.navigate(['/subscriber/claims']);
    this.router.navigate(['/subscriber/claims/edit-claim', element.claim_id])
  }

  billableNavigate() {
    this.router.navigate(['/subscriber/billable-item']);
  }
}
