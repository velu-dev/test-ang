import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-billable-item',
  templateUrl: './new-billable-item.component.html',
  styleUrls: ['./new-billable-item.component.scss']
})
export class NewBillableItemComponent implements OnInit {
  billable_item: FormGroup;
  modifiers: any;
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
  isBillSubmited: boolean = false;
  isEdit: boolean;
  billableId: number;
  constructor(private formBuilder: FormBuilder,
    private claimService: ClaimService,
    private alertService: AlertService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(param => {
      this.claimId = param.claim;
      this.claimantId = param.claimant;
      if (param.billable) {
        this.isEdit = true
        this.billableId = param.billable;
      }
    })
  }

  ngOnInit() {
    this.billable_item = this.formBuilder.group({
      claim_id: [this.claimId],
      claimant_id: [this.claimantId],
      exam_type: this.formBuilder.group({
        procedure_type: [null, Validators.required],
        modifier_id: [null]
      }),
      appointment: this.formBuilder.group({
        examiner_id: [null],
        appointment_scheduled_date_time: [null],
        duration: [null],
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

    this.claimService.seedData("modifier").subscribe(res => {
      this.modifiers = res.data;
    })
    this.claimService.seedData("procedural_codes").subscribe(res => {
      res.data.map(proc => {
        if (proc.procedural_code != "ML100") {
          this.procuderalCodes.push(proc);
        }
      })
    })
    this.claimService.seedData("agent_type").subscribe(res => {
      res.data.map(caller => {
        if (caller.id != 5 && caller.id != 6 && caller.id != 7) {
          this.callerAffliation.push(caller);
        }
      })
    })

    this.claimService.seedData("contact_type").subscribe(res => {
      this.contactTypes = res.data;
      // if (this.isEdit) {
      //   if (this.contactType) {
      //     let type = this.contactTypes.find(element => element.id == this.contactType)
      //     this.changeCommunicationType(type, 'auto');
      //   }
      // }
    })

    this.claimService.listExaminar().subscribe(res => {
      this.examinarList = res.data;
    })

  }
  procedure_type() {
    this.billable_item.patchValue({
      exam_type: { modifier_id: [] }
    })
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
    console.log(address)
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

  contactMask = { type: "", mask: "" }
  changeCommunicationType(contact, type) {
    if (contact)
      if (type == "man")
        this.billable_item.patchValue({
          intake_call: {
            call_type_detail: ""
          }
        })
    switch (contact.contact_type) {
      case "E1":
        this.contactMask.mask = "";
        this.contactMask.type = "email";
        break;
      case "E2":
        this.contactMask.mask = "email";
        break;
      case "M1":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "M2":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "L1":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "L2":
        this.contactMask.mask = "(000) 000-0000";
        break;
      case "F1":
        this.contactMask.mask = "000-000-0000";
        break;
      case "F2":
        this.contactMask.mask = "000-000-0000";
        break;
    }

  }

  submitBillableItem() {
    this.isBillSubmited = true;
    if (this.billable_item.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.claimService.createBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.claimService.updateBillableItem(this.billable_item.value).subscribe(res => {
        this.alertService.openSnackBar(res.message, "success");
        //this.router.navigate(['/subscriber/claims'])
        this._location.back();
      }, error => {
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    }
  }

}