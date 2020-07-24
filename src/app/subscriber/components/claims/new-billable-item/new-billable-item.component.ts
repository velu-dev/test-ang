import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'L LT',
  fullPickerInput: 'L LT',
  datePickerInput: 'L',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-new-billable-item',
  templateUrl: './new-billable-item.component.html',
  styleUrls: ['./new-billable-item.component.scss'],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }]
})
export class NewBillableItemComponent implements OnInit {
  billable_item: FormGroup;
  modifiers = [];
  procuderalCodes: any = [];
  examinarList: any;
  duration = [{ id: 20, value: "20" }, { id: 30, value: "30" }, { id: 45, value: "45" }, { id: 60, value: "60" }]
  examinarAddress: Observable<any[]>;
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
  claimantDetails = { claimant_name: "", date_of_birth: "", phone_no_1: "" };
  claimDetails = { claim_number: "", wcab_number: "", exam_type_id: "" };
  examTypes: any;
  isLoading = false;
  modifierList = [];
  constructor(private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.isLoading = true;
    this.claimService.seedData('exam_type').subscribe(res => {
      this.examTypes = res.data;
    })
    this.route.params.subscribe(param => {
      this.claimId = param.claim;
      this.claimantId = param.claimant;
      this.claimService.getClaim(this.claimId).subscribe(claim => {
        this.claimService.getProcedureType(claim.data.exam_type.procedure_type).subscribe(res => {
          this.procuderalCodes = res.data;
        })
        this.claimDetails = { claim_number: claim.data.claim_details.claim_number, exam_type_id: claim.data.claim_details.exam_type_id, wcab_number: claim.data.claim_details.wcab_number }
      })
      this.claimService.getSingleClaimant(this.claimantId).subscribe(claimant => {
        this.claimant = claimant.data[0]
        this.claimantDetails = { claimant_name: claimant.data[0].first_name + " " + claimant.data[0].last_name, date_of_birth: claimant.data[0].date_of_birth, phone_no_1: claimant.data[0].phone_no_1 };

      })
      if (param.billable) {
        this.isEdit = true
        this.billableId = param.billable;
        this.claimService.getBillableItemSingle(param.billable).subscribe(res => {
          if (res['data'].exam_type.primary_language_spoken) {
            this.primary_language_spoken = true;
          }
          this.isChecked = res.data.exam_type.is_psychiatric;
          this.claimService.seedData("modifier").subscribe(res => {
            this.modifierList = res.data;
            if (this.isChecked) {
              this.modifiers = this.modifierList;
            } else {
              res.data.map(modifier => {
                if (modifier.modifier_code != "96")
                  this.modifiers.push(modifier);
              })
            }
          })
          this.billable_item.patchValue(res['data'])
          //this.examinarChange(res['data'].)
          if (res['data'].appointment) {
            let ex = { value: res['data'].appointment.examiner_id, address_id: res['data'].appointment.examination_location_id }
            this.examinarChange(ex)
          }
          this.contactType = res['data'].intake_call.call_type
        })
      }
    })
    this.isLoading = false;
  }

  ngOnInit() {
    this.billable_item = this.formBuilder.group({
      id: [{ value: '', disable: true }],
      claim_id: [this.claimId],
      claimant_id: [this.claimantId],
      exam_type: this.formBuilder.group({
        procedure_type: [null, Validators.required],
        modifier_id: [null],
        is_psychiatric: [false],
        primary_language_spoken: [{ value: '', disabled: true }]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [null],
        appointment_scheduled_date_time: [null],
        duration: [null, Validators.compose([Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(450)])],
        examination_location_id: [null]
      }),
      intake_call: this.formBuilder.group({
        caller_affiliation: [null],
        caller_name: [null],
        call_date: [null],
        call_type: [null],
        call_type_detail: [null],
        notes: [null],
      })

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
    })

  }
  procedure_type(procuderalCode) {
    if (procuderalCode.modifier)
      this.modifiers = procuderalCode.modifier;
    this.billable_item.patchValue({
      exam_type: { modifier_id: [] }
    })
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

  todayDate = { appointment: new Date(), intake: new Date() }
  pickerOpened(type) {
    if (type = 'intake') {
      this.todayDate.intake = new Date();
    } else {
      this.todayDate.appointment = new Date();
    }
  }

  isAddressSelected = false;
  selectedExaminarAddress: any = {};
  changeExaminarAddress(address) {
    this.billable_item.patchValue({
      appointment: {
        examination_location_id: address.address_id
      }
    })
    this.isAddressSelected = true;
    this.selectedExaminarAddress = address;
  }


  examinarChange(examinar) {
    this.addressCtrl.setValue('');
    this.selectedExaminarAddress = '';
    this.isAddressSelected = false;
    this.examinarId = examinar.id;
    this.claimService.getExaminarAddress(this.examinarId).subscribe(res => {
      this.examinerOptions = []
      this.examinerOptions = res['data'];
      this.examinarAddress = this.addressCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterAddress(value))
        );

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

  private _filterAddress(value: string): any {
    const filterValue = value.toLowerCase();
    return this.examinerOptions.filter(option => option.street1.toLowerCase().includes(filterValue));
  }

  submitBillableItem() {
    this.isBillSubmited = true;

    Object.keys(this.billable_item.controls).forEach((key) => {
      if (this.billable_item.get(key).value && typeof (this.billable_item.get(key).value) == 'string')
        this.billable_item.get(key).setValue(this.billable_item.get(key).value.trim())
    });
    if (this.billable_item.invalid) {
      return;
    }
    this.billable_item.value.exam_type.is_psychiatric = this.isChecked;
    this.billable_item.value.appointment.duration = this.billable_item.value.appointment.duration == "" ? null : this.billable_item.value.appointment.duration;
    if (!this.isEdit) {
      this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateBillableItem(this.billable_item.value, this.billableId).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        //this.router.navigate(['/subscriber/claims'])
        this._location.back();
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
    this._location.back();
  }

}
