import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material';
import { formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { RegulationDialogueComponent } from 'src/app/shared/components/regulation-dialogue/regulation-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import * as regulation from 'src/app/shared/services/regulations';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';
import { EMAIL_REGEXP } from 'src/app/globals';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'MM-DD-YYYY hh:mm A z',
  fullPickerInput: 'MM-DD-YYYY hh:mm A z',
  datePickerInput: 'MM-DD-YYYY hh:mm A z',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

export const PICK_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM-dd-yyyy', this.locale);;
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-new-billable-item',
  templateUrl: './new-billable-item.component.html',
  styleUrls: ['./new-billable-item.component.scss'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }]
})
export class NewBillableItemComponent implements OnInit {
  billable_item: FormGroup;
  modifiers = [];
  procuderalCodes: any = [];
  examinarList: any;
  duration = [{ id: 20, value: "20" }, { id: 30, value: "30" }, { id: 45, value: "45" }, { id: 60, value: "60" }]
  examinarAddress = [];
  examinarId: any;
  addressCtrl = new FormControl();
  examinerOptions: any = [];
  address = [];
  callerAffliation = [];
  contactTypes: any;
  claimId: number;
  claimantId: number;
  claimant: any;
  isBillSubmited: boolean = false;
  isEdit: boolean;
  billableId: number;
  contactType: any;
  languageList: any = [];
  primary_language_spoken: boolean = false;
  claimantDetails = { claimant_name: "", date_of_birth: "", phone_no_1: "", phone_ext1: "" };
  claimDetails = { claim_number: "", wcab_number: "", exam_type_id: "", exam_type_code: "", exam_name: "" };
  examTypes: any;
  isLoading = false;
  modifierList = [];
  appointment_scheduled_date_time: any = null;
  isSearch: boolean = false;
  baseUrl: any;
  supplementalItems: any;
  supplementalOtherIndex: number;
  pastTwoYearDate = moment().subtract(2, 'year');
  regulation = regulation;
  filteredExaminerList: any = [];
  examinerFilterCtrl = new FormControl();
  constructor(private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private logger: NGXLogger,
    private cookieService: CookieService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.isLoading = true;
    this.claimService.seedData('exam_type').subscribe(res => {
      this.examTypes = res.data;
      this.route.params.subscribe(param => {
        this.claimId = param.claim_id;
        this.isSearch = param.isSearch;
        console.log(param)
        if (param.claimant_id)
          this.claimantId = param.claimant_id;
        this.claimService.getClaim(this.claimId).subscribe(claim => {
          this.logger.log("claim", claim);
          this.claimantId = claim.data.claimant_details.id;
          console.log(this.claimantId)
          //to send claim details exam type
          this.claimService.getSingleClaimant(this.claimantId).subscribe(claimant => {
            console.log(claimant)
            this.claimant = claimant.data[0]
            this.claimantDetails = { claimant_name: claimant.data[0].first_name + " " + claimant.data[0].last_name, date_of_birth: claimant.data[0].date_of_birth, phone_no_1: claimant.data[0].phone_no_1, phone_ext1: claimant.data[0].phone_ext1 };
          })
          // this.claimService.getProcedureType(claim.data.claim_details.exam_type_id).subscribe(res => {
          //   this.procuderalCodes = res.data;
          // })
          this.claimService.getProcedureTypeAttoney(claim.data.claim_details.id).subscribe(procedure => {
            this.procuderalCodes = procedure.data;
          })
          let Examtype = { exam_type_code: "", exam_name: "" };
          this.examTypes.map(exam => {
            if (exam.id == claim.data.claim_details.exam_type_id) {
              Examtype = exam;
            }
          })
          this.claimDetails = { claim_number: claim.data.claim_details.claim_number, exam_type_id: claim.data.claim_details.exam_type_id, wcab_number: claim.data.claim_details.wcab_number, exam_type_code: Examtype.exam_type_code, exam_name: Examtype.exam_name }
        })
        if (param.billable) {
          this.isEdit = true
          this.billableId = param.billable;
          this.claimService.getBillableItemSingle(param.billable).subscribe(res => {
            if (res['data'].exam_type.primary_language_spoken) {
              this.primary_language_spoken = true;
            }
            this.isChecked = res.data.exam_type.is_psychiatric;
            this.claimService.seedData("modifier").subscribe(seed => {
              this.modifierList = seed.data;
              if (this.isChecked) {
                this.modifiers = this.modifierList;
              } else {
                seed.data.map(modifier => {
                  if (modifier.modifier_code != "96")
                    this.modifiers.push(modifier);
                })
              }
            })
            this.billable_item.patchValue(res['data'])
            //this.examinarChange(res['data'].)
            if (res['data'].appointment.examiner_id != null) {
              let ex = { value: res['data'].appointment.examiner_id, address_id: res['data'].appointment.examiner_service_location_id }
              this.examinarChange(ex)
            }
            this.contactType = res['data'].intake_call.call_type
          })
        }
      })
    })
    this.isLoading = false;

  }

  ngOnInit() {
    this.billable_item = this.formBuilder.group({
      id: [null],
      claim_id: [this.claimId],
      claimant_id: [this.claimantId],
      exam_type: this.formBuilder.group({
        exam_procedure_type_id: [null, Validators.required],
        modifier_id: [null],
        is_psychiatric: [false],
        primary_language_spoken: [{ value: '', disabled: true }]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [null, Validators.required],
        appointment_scheduled_date_time: [null],
        duration: [null, Validators.compose([Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(450)])],
        examiner_service_location_id: [null],
        examiner_service_location: [null],
        is_virtual_location: [false],
        conference_url: [null],
        conference_phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [null],
        caller_name: [null],
        call_date: [null],
        call_type: [null],
        call_type_detail: [null],
        notes: [null],
        caller_phone: [null, Validators.compose([Validators.pattern('[0-9]+')])],
        caller_email: [null, Validators.compose([Validators.email, Validators.pattern(EMAIL_REGEXP)])],
        phone_ext: [{ value: null, disabled: true }, Validators.compose([Validators.pattern('(?!0+$)[0-9]{0,6}'), Validators.minLength(2), Validators.maxLength(6)])],
        caller_fax: [null, Validators.compose([Validators.pattern('[0-9]+')])]
      }),
      //documents_received:[]

    })
    this.billable_item.get(["appointment", "conference_phone"]).valueChanges.subscribe(res => {
      if (this.billable_item.get(["appointment", "conference_phone"]).value && this.billable_item.get(["appointment", "conference_phone"]).valid) {
        this.billable_item.get(["appointment", "phone_ext"]).enable();
      } else {
        this.billable_item.get(["appointment", "phone_ext"]).reset();
        this.billable_item.get(["appointment", "phone_ext"]).disable();
      }
    })
    this.billable_item.get(["intake_call", "caller_phone"]).valueChanges.subscribe(res => {
      if (this.billable_item.get(["intake_call", "caller_phone"]).value && this.billable_item.get(["intake_call", "caller_phone"]).valid) {
        this.billable_item.get(["intake_call", "phone_ext"]).enable();
      } else {
        this.billable_item.get(["intake_call", "phone_ext"]).reset();
        this.billable_item.get(["intake_call", "phone_ext"]).disable();
      }
    })
    this.claimService.seedData("supplemental_item_received").subscribe(supp => {
      console.log(supp)
      this.supplementalItems = supp.data;
      this.supplementalOtherIndex = this.supplementalItems.findIndex(docs => docs.name.toLowerCase() == 'other')
      const controlArray = this.supplementalItems.map(c => new FormControl(false));
      this.billable_item.addControl('documents_received', new FormArray(controlArray))
    })
    this.claimService.seedData("language").subscribe(res => {
      this.languageList = res.data;
    })
    // this.claimService.seedData("modifier").subscribe(res => {
    //   this.modifierList = res.data;
    //   res.data.map(modifier => {
    //     if (modifier.modifier_code != "96")
    //       this.modifiers.push(modifier);
    //   })
    // })
    // this.claimService.seedData("procedural_codes").subscribe(res => {
    //   res.data.map(proc => {
    //     if (proc.procedural_code != "ML100") {
    //       this.procuderalCodes.push(proc);
    //     }
    //   })
    // })
    this.claimService.seedData("agent_type").subscribe(res => {
      this.callerAffliation = res.data;
    })

    this.claimService.seedData("intake_contact_type").subscribe(res => {
      this.contactTypes = res.data;
      if (this.isEdit) {
        if (this.contactType) {
          let type = this.contactTypes.find(element => element.id == this.contactType)
        }
      }
    })

    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;  
      this.examinerFilterCtrl.setValue(null);
    })

    this.filteredExaminerList = this.examinerFilterCtrl.valueChanges.pipe(
      startWith(null), 
      map((searchKey) => {
        if(searchKey) {
          searchKey = searchKey.toLowerCase();
          return this.examinarList.filter((examiner) => 
            examiner.first_name.toLowerCase().indexOf(searchKey) > -1 || 
            examiner.middle_name.toLowerCase().indexOf(searchKey) > -1 || 
            examiner.last_name.toLowerCase().indexOf(searchKey) > -1 || 
            examiner.suffix.toLowerCase().indexOf(searchKey) > -1
          )
        }
        else {
          return this.examinarList;
        }
      })
    )

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
  isAppointmentFuture = false;
  changeDateType(date) {
    if (date) {
      if (moment(date).isBefore(moment(new Date()))) {
        this.isAppointmentFuture = true;
        this.billable_item.get('appointment').get('examiner_service_location').setValidators([Validators.compose([Validators.required])]);
        this.billable_item.get('appointment').get('examiner_service_location').updateValueAndValidity();
      } else {
        this.isAppointmentFuture = true;
        this.billable_item.get('appointment').get('examiner_service_location').setValidators([]);
        this.billable_item.get('appointment').get('examiner_service_location').updateValueAndValidity();
      }
      this.billable_item.patchValue({
        appointment: { duration: 60 }
      })
      let timezone = moment.tz.guess();
      return this.appointment_scheduled_date_time = moment(date.toString()).tz(timezone).format('MM-DD-YYYY hh:mm A z')
    } else {
      return this.appointment_scheduled_date_time = null
    }
  }
  examTypeChange(value) {
    this.procuderalCodes.map(res => {
      if (res.exam_procedure_type_id == value) {
        console.log(res)
        this.procedure_type(res);
      }
    })
  }
  isSuplimental = false;
  isDeposition = false;
  procedure_type(procuderalCode) {
    if (procuderalCode.modifier)
      this.modifiers = procuderalCode.modifier;
    this.billable_item.patchValue({
      exam_type: { modifier_id: [] }
    })
    if (procuderalCode.exam_procedure_type.includes("SUPP")) {
      this.isSuplimental = true;
      this.billable_item.patchValue({
        appointment: {
          appointment_scheduled_date_time: null,
          duration: null,
          examiner_service_location_id: null,
          examiner_service_location: null,
          is_virtual_location: false,
          conference_url: null,
          conference_phone: null
        },
        intake_call: {
          caller_affiliation: null,
          caller_name: null,
          call_date: null,
          call_type: null,
          call_type_detail: null,
          notes: null,
          caller_phone: null,
          caller_email: null,
          caller_fax: null,
        }
      })
      if (this.billable_item.get('documents_received')) {
        const controlArray = Array(this.supplementalItems.length).fill(false);
        this.billable_item.setControl('documents_received', this.formBuilder.array(controlArray))
      }
    } else {
      if (procuderalCode.exam_procedure_type.includes("DEPO")) {
        this.isDeposition = true;
      } else {
        this.isDeposition = false;
      }
      this.isSuplimental = false;
    }
    if (procuderalCode.exam_procedure_type_id == 28) {
      this.isSuplimental = true;
    }
  }
  // procedure_type() {
  //   this.billable_item.patchValue({
  //     exam_type: { modifier_id: [] }
  //   })
  // }
  isChecked = false;
  psychiatric(event) {
    this.isChecked = event.checked;
    // this.modifiers = [];
    if (event.checked) {
      let modi = [];
      if (this.modifiers.find(obj => obj.id === 5)) {
        modi.push(5)
      }
      if (this.billable_item.value.exam_type.modifier_id != null) {
        this.billable_item.value.exam_type.modifier_id.map(res => {
          modi.push(res)
        })
      }
      this.billable_item.patchValue({
        exam_type: {
          is_psychiatric: true,
          modifier_id: modi,
        }
      })
      // this.modifiers = this.modifierList;
    } else {
      let modi = [];
      this.billable_item.value.exam_type.modifier_id.map(res => {
        if (res != 5) {
          modi.push(res)
        }
      })
      this.billable_item.patchValue({
        exam_type: {
          modifier_id: modi,
          is_psychiatric: false
        }
      })
      // this.modifiers = [];
      // this.modifierList.map(res => {
      //   if (res.modifier_code != "96")
      //     this.modifiers.push(res);
      // })
    }
  }
  todayDate = { appointment: new Date(), intake: new Date() };
  minDate: any;
  pickerOpened(type) {
    if (type = 'intake') {
      let date = moment();
      this.minDate = date.subtract(1, 'year');
      this.todayDate.intake = new Date();
    } else {
      let date = new Date();
      date.setSeconds(0);
      this.todayDate.appointment = date;
    }
  }
  VserviceLocation() {
    this.billable_item.patchValue({
      appointment: {
        is_virtual_location: true,
        examiner_service_location_id: null
      }
    })
  }
  isAddressSelected = false;
  selectedExaminarAddress: any = {};
  changeExaminarAddress(address) {
    this.billable_item.patchValue({
      appointment: {
        is_virtual_location: false,
        examiner_service_location_id: address.address_id,
        conference_url: null,
        conference_phone: null
      }
    })
    this.isAddressSelected = true;
    this.selectedExaminarAddress = address;
  }

  service_location_name: any;
  serviceLocationChange(value) {

    if (value == 0) {
      this.service_location_name = "0";
      return;
    }
    this.examinarAddress.map(address => {
      if (address.address_id == value) {
        this.service_location_name = address.service_location_name;
      }
    })

  }
  examinarChange(examinar) {
    this.addressCtrl.setValue('');
    this.selectedExaminarAddress = '';
    this.isAddressSelected = false;
    this.examinarId = examinar.id;
    this.billable_item.patchValue({
      appointment: {
        examiner_id: examinar.id
      }
    })
    if (this.examinarId) {
      this.claimService.getExaminarAddress(this.examinarId).subscribe(res => {
        this.examinerOptions = []
        this.examinerOptions = res['data'];
        this.examinarAddress = res.data;
        // this.examinarAddress = this.addressCtrl.valueChanges
        //   .pipe(
        //     startWith(''),
        //     map(value => this._filterAddress(value))
        //   );

        if (examinar.address_id) {
          res.data.map(addr => {
            if (addr.address_id == examinar.address_id) {
              this.isAddressSelected = true;
              this.selectedExaminarAddress = addr;
            }
          })
        }
        this.address = res.data;
      })
    }
  }

  private _filterAddress(value: string): any {
    const filterValue = value.toLowerCase();
    return this.examinerOptions.filter(option => option.street1.toLowerCase().includes(filterValue));
  }

  submitBillableItem() {
    if (moment(this.billable_item.get('appointment').get('appointment_scheduled_date_time').value).isBefore(moment(new Date())) && !this.billable_item.get('appointment').get('examiner_service_location').value) {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: "500px",
        data: {
          title: "Service Location",
          type: 'info',
          ok: true,
          message: 'Service Location is empty for the selected Past Appointment Date. Please select a location to proceed.'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        return
      });
    } else {
      this.submitBill();
    }
  }
  submitBill() {
    let selectedOrderIds = []
    if (this.isSuplimental) {
      selectedOrderIds = this.billable_item.value.documents_received
        .map((v, i) => v ? this.supplementalItems[i].name : null)
        .filter(v => v !== null);
    }
    if (this.isSuplimental) {
      this.billable_item.get('intake_call').get('call_date').setValidators([Validators.compose([Validators.required])]);
    } else {
      this.billable_item.get('intake_call').get('call_date').setValidators([]);
    }
    this.billable_item.get('intake_call').get('call_date').updateValueAndValidity();
    this.isBillSubmited = true;
    Object.keys(this.billable_item.controls).forEach((key) => {
      if (this.billable_item.get(key).value && typeof (this.billable_item.get(key).value) == 'string')
        this.billable_item.get(key).setValue(this.billable_item.get(key).value.trim())
    });
    // let billable_item_date: any;
    // if (this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value) {
    //   // billable_item_date = .add(1, 'minute')
    //   if (!(moment(this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).value).isSameOrAfter(moment().set('second', 0)))) {
    //     this.billable_item.get(["appointment", "appointment_scheduled_date_time"]).setErrors({'incorrect': true})
    //     return
    //   }
    // }
    if (this.billable_item.invalid) {
      return;
    }
    this.billable_item.value.exam_type.is_psychiatric = this.isChecked;
    this.billable_item.value.appointment.duration = this.billable_item.value.appointment.duration == "" ? null : this.billable_item.value.appointment.duration;
    this.billable_item.value.claimant_id = this.claimantId;
    this.billable_item.value.claim_id = +this.claimId;
    this.billable_item.value.documents_received = selectedOrderIds
    this.billable_item.value.intake_call.call_date = this.billable_item.get(['intake_call', 'call_date']).value ? moment(this.billable_item.get(['intake_call', 'call_date']).value).format("MM-DD-YYYY") : null;
    if (this.billable_item.get('appointment').get('examiner_service_location_id').value == 0) {
      this.billable_item.get('appointment').get('examiner_service_location_id').setValue(null);
    }
    if (!this.isEdit) {
      this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        // if (this.isSearch) {
        this.router.navigate([this.baseUrl + "claimants/claimant/" + this.claimantId + "/claim/" + this.claimId + "/billable-item/" + res.data.id])
        // } else {
        // this._location.back();
        // }
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateBillableItem(this.billable_item.value, this.billableId).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        //this.router.navigate(['/subscriber/claims'])
        if (this.isSearch) {
          this.router.navigate([this.baseUrl + "claimants/claimant/" + this.claimantId + "/claim/" + this.claimId + "/billable-item/" + res.data.id])
        } else {
          this._location.back();
        }

      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }
  selectedLanguage: any;
  modifyChange() {
    if (this.billable_item.value.exam_type.modifier_id)
      if (this.billable_item.value.exam_type.modifier_id.includes(2)) {
        this.languageList.map(res => {

          if (res.id == this.claimant.primary_language_spoken) {
            this.primary_language_spoken = true;
            this.selectedLanguage = res;
          }
        })
        this.billable_item.patchValue({
          exam_type: { primary_language_spoken: this.claimant.primary_language_spoken }
        })
      }
  }

  cancel() {
    if (this.isSearch) {
      this.router.navigate([this.baseUrl])
    } else {
      this._location.back();
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  supplementalCheck() {
    if (!this.billable_item.get('documents_received').value[this.supplementalOtherIndex]) {
      this.billable_item.patchValue({
        intake_call: { notes: null }
      })
    }
  }

  openPopup(title, value) {
    let data = this.userService.getRegulation(value)
    const dialogRef = this.dialog.open(RegulationDialogueComponent, {
      width: '1000px',
      data: { title: title, regulations: data },
      panelClass: 'info-regulation-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
