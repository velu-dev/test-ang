import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatChipInputEvent, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { IntercomService } from 'src/app/services/intercom.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { BillingService } from 'src/app/subscriber/service/billing.service';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { Location } from '@angular/common';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-bill-line-item',
  templateUrl: './bill-line-item.component.html',
  styleUrls: ['./bill-line-item.component.scss']
})
export class BillLineItemComponent implements OnInit {

  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  //@Input() billingId: number;
  //table
  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;
  removable = true;
  unitTypes: any = [{ unit_type: 'Units', unit_short_code: 'UN' }, { unit_type: 'Pages', unit_short_code: 'UN' }];
  filteredmodifier: any;
  modiferList: any = ['93', '94', '95', '96'];
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('scrollBottom', { static: false }) private scrollBottom: ElementRef;
  constructor(private logger: NGXLogger,
    private claimService: ClaimService,
    private breakpointObserver: BreakpointObserver,
    private alertService: AlertService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public billingService: BillingService,
    private fb: FormBuilder,
    private intercom: IntercomService,
    private _location: Location,
    private cookieService: CookieService) {
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });

  }

  ngOnInit() {
    this.getBillLineItem();
  }

  billing_line_items: any;
  newFeeScheduleStatus: boolean;
  billingCodeDetails: any;
  getBillLineItem() {
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.billingService.getBillLineItem(this.paramsId.claim_id, this.paramsId.billId).subscribe(line => {
      if (!this.billingData.certified_interpreter_required) {
        let index = this.modiferList.indexOf('93');
        this.modiferList.splice(index, 1)
      }
      if (!this.billingData.is_psychological_exam) {
        let index = this.modiferList.indexOf('96');
        this.modiferList.splice(index, 1)
      }
      this.filteredmodifier = this.modiferList
      if (line.data) {
        this.billing_line_items = line.data;
        line.data.map((item, index) => {
          this.newFeeScheduleStatus = this.billing_line_items[0].is_new_fee_schedule;
          this.billingCodeDetails = this.billing_line_items[0].billing_code_details;
          let firstData = {};
          this.addRow(1);
          let modifier = item.modifier ? item.modifier.split('-') : [];
          line.data[index].modifierList = modifier;
          if (this.newFeeScheduleStatus && item.is_auto_generate && !item.is_excess_pages) {
            if (item.unit_type == 'unit') item.unit_type = 'Units';
            item.units = item.units ? item.units : 1;
            item.charge = item.charge ? item.charge : item.units * item.billing_code_details.unit_price;
            item.unit_price = item.billing_code_details.unit_price ? item.billing_code_details.unit_price : 0;
            item.filteredmodifier = item.modifier_seed_data && item.modifier_seed_data.length ? item.modifier_seed_data.map(data => data.modifier_code) : [];
            item.modifierTotal = 0
            let modData = item.modifier_seed_data && item.modifier_seed_data.map((e, i) => {
              let presentMod = modifier.includes(e.modifier_code)
              if (presentMod) {
                let modIndex = modifier.findIndex(m => m == e.modifier_code)
                if (e.modifier_code == modifier[modIndex]) {
                  e.exclude_modifiers.map((ex, ind) => {
                    let filterIndex = item.filteredmodifier.findIndex(m => m == ex)
                    item.filteredmodifier.splice(filterIndex, 1)
                  });
                  if (+e.price_increase > 0) {

                    let calculateChange = (+e.price_increase / 100) * (+item.units * +item.billing_code_details.unit_price);
                    item.modifierTotal = (+item.modifierTotal + +calculateChange);
                    item.charge = (+item.modifierTotal + +item.units * +item.billing_code_details.unit_price);
                  }
                }
              }
            })
          }
          firstData = {
            id: item.id,
            modifierList: modifier,
            item_description: item.item_description,
            procedure_code: item.procedure_code,
            modifier: item.modifier,
            unitType: item.unit_type,
            units: item.units,
            charge: +item.charge,
            payment: item.payment_amount ? item.payment_amount : 0.00,
            balance: 0,
            isEditable: [true],
            unit_price: item.unit_price ? +item.unit_price : null,
            is_post_payment: item.is_post_payment,
            post_payment_id: item.post_payment_id,
            billing_code_details: item.billing_code_details,
            modifier_seed_data: item.modifier_seed_data,
            is_auto_generate: item.is_auto_generate,
            filteredmodifier: item.filteredmodifier,
            unitTotal: +item.charge,
            is_excess_pages: item.is_excess_pages,
            modifierTotal: item.modifierTotal
          }
          this.getFormControls.controls[index].patchValue(firstData)
          if (this.getFormControls.controls[index].status == "VALID") {
            this.getFormControls.controls[index].get('isEditable').setValue(false);
          }
        })

      }
    }, error => {
      this.logger.error(error)
    })
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      id: [''],
      item_description: ['', Validators.compose([Validators.required])],
      procedure_code: ['', Validators.compose([Validators.required])],
      modifierList: [[]],
      modifier: ['', Validators.compose([Validators.pattern('^[0-9]{2}(?:-[0-9]{2})?(?:-[0-9]{2})?(?:-[0-9]{2})?$')])],
      unitType: [''],
      units: ['', Validators.compose([Validators.required, Validators.min(1), Validators.pattern('^(0|[0-9]{1,100}\d*)$')])],
      charge: ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(99999999.99)])],
      payment: [0],
      balance: [0],
      total_charge: [0],
      isEditable: [true],
      is_post_payment: [],
      post_payment_id: [],
      unit_price: [null],
      billing_code_details: [],
      modifier_seed_data: [],
      is_auto_generate: [null],
      filteredmodifier: [[]],
      modifierTotal: [0],
      unitTotal: [0],
      is_excess_pages: [null]
    });
  }

  addRow(status?: number) {
    if (status != 1) {
      let newRowStatus = true
      for (var j in this.getFormControls.controls) {
        if (this.getFormControls.controls[j].status == 'INVALID') {
          newRowStatus = false;
        }
      }

      if (!newRowStatus) {
        this.alertService.openSnackBar("Please fill existing data", 'error');
        return;
      }
    }


    const control = this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
    if (status != 1) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }
  }

  deleteRow(index: number, group) {
    this.openDialogBillLine('remove', index, group);

  }

  openDialogBillLine(dialogue, index, group) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: "Billing Line Item" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        if (group.value.id) {
          this.billingService.removeBillItem(group.value.id, this.paramsId.claim_id, this.paramsId.billId,).subscribe(del => {
            this.alertService.openSnackBar("Bill Line Item removed successfully", 'success');
            const control = this.userTable.get('tableRows') as FormArray;
            control.removeAt(index);
            this.billing_line_items.splice(index, 1)
            return
          }, err => {
            this.alertService.openSnackBar(err.error.message, 'error');
          })
        } else {
          const control = this.userTable.get('tableRows') as FormArray;
          control.removeAt(index);
          this.billing_line_items.splice(index, 1)
        }
      }
    })
  }

  editRow(group: FormGroup, i) {
    console.log(group)
    if (group.get('procedure_code').value && group.get('procedure_code').value.trim() && this.newFeeScheduleStatus) {
      let valReplace = group.get('procedure_code').value.replace(/[^a-zA-Z]/g, "");
      if (valReplace.toLowerCase() == 'mlprr') {
        console.log(valReplace)
        group.get('is_excess_pages').patchValue(true);
        this.getFormControls.at(i).get('modifier').disable()
        this.getFormControls.at(i).get('modifierList').disable();
        this.getFormControls.at(i).get('modifierList').updateValueAndValidity();
        this.getFormControls.at(i).get('modifier').updateValueAndValidity();
      }

    }
    group.get('isEditable').setValue(true);
    if (group.value.is_auto_generate && this.newFeeScheduleStatus) {
      group.get('procedure_code').disable();
      group.get('unitType').disable();
      group.get('charge').disable();
    }
  }

  doneRow(group: FormGroup, index) {
    Object.keys(group.controls).forEach((key) => {
      if (group.get(key).value && typeof (group.get(key).value) == 'string')
        group.get(key).setValue(group.get(key).value.trim())
    });
    if (group.status == "INVALID") {
      group.markAllAsTouched();
      return;
    }
    if (group.untouched) {
      return;
    }

    let moidfier = group.get('modifierList').value.toString();
    moidfier = moidfier ? moidfier.replace(/,/g, '-') : null;
    let data = {
      id: group.value.id,
      item_description: group.value.item_description,
      procedure_code: group.value.procedure_code,
      modifier: moidfier,
      units: group.value.units,
      charge: group.get('charge').value ? parseFloat(group.get('charge').value).toFixed(2) : group.get('charge').value,
      total_charge: this.calculateTotal(),
      unit_type: group.value.unitType,
      unit_short_code: this.getUnitCode(group.value.unitType)
    }

    this.billingService.createBillLine(this.paramsId.billingId, this.paramsId.billId, this.paramsId.claim_id, data).subscribe(line => {
      group.get('id').setValue(line.data.id);
      if (data.id) {
        this.alertService.openSnackBar("Bill Line Item updated successfully", 'success');
      } else {
        this.alertService.openSnackBar("Bill Line Item added successfully", 'success');
      }
      let modifier = line.data.modifier ? line.data.modifier.split('-') : [];
      this.billing_line_items[index] = line.data;
      this.billing_line_items[index].modifierList = modifier;
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  unitChange(group, i, e) {
    if (e && group.value.is_auto_generate && this.newFeeScheduleStatus && !group.value.is_excess_pages) {
      console.log(group);
      let calculateChange = 0;
      if (group.get('modifierList').value.length) {
        group.value.modifier_seed_data.map((e, i) => {
          if (group.get('modifierList').value.includes(e.modifier_code)) {
            if (+e.price_increase > 0) {
              calculateChange += (e.price_increase / 100) * (+group.get('units').value * +group.value.billing_code_details.unit_price);
            }
          }

        });
        group.get('modifierTotal').patchValue(+calculateChange);
      }
      let charge = (e * group.get('unit_price').value) + +group.get('modifierTotal').value
      group.get('unitTotal').patchValue(+(e * group.get('unit_price').value))
      group.get('charge').patchValue(+charge)
    } else if (group.value.is_excess_pages) {
      let charge = +group.get('units').value * + this.billingCodeDetails.rate_for_extra_units
      group.get('charge').patchValue(+charge)
    }
  }

  procedureChange(val, group) {
    let valReplace;
    if (val && val.trim() && this.newFeeScheduleStatus) {
      valReplace = val.replace(/[^a-zA-Z]/g, "");
      if (valReplace.toLowerCase() == 'mlprr') {
        group.get('is_excess_pages').patchValue(true);
        group.get('modifierList').patchValue([]);
        group.get('unitType').patchValue(this.billingCodeDetails.extra_unit_type == 'page' ? 'Pages' : '');
        group.get('modifier').disable();
        group.get('modifierList').disable();
        group.get('modifierList').updateValueAndValidity();
        group.get('modifier').updateValueAndValidity();
      } else {
        group.get('is_excess_pages').patchValue(false);
        group.get('modifier').enable();
        group.get('modifier').updateValueAndValidity();
        group.get('modifierList').enable();
        group.get('modifierList').updateValueAndValidity();
      }
    }
  }
  getUnitCode(code) {
    if (code) {
      for (var c in this.unitTypes) {
        if (this.unitTypes[c].unit_type == code) {
          return this.unitTypes[c].unit_short_code;
        }
      }
    } else {
      return null;
    }

  }


  cancelRow(group: FormGroup, i) {
    if (!group.value.id) {
      this.deleteRow(i, group);
      return
    }
    console.log(group, i)
    console.log(this.billing_line_items)
    let data = [];
    data.push(this.billing_line_items[i])
    data.map((item, index) => {
      let firstData = {};
      let modifier = item.modifier ? item.modifier.split('-') : [];
      if (this.newFeeScheduleStatus && item.is_auto_generate && !item.is_excess_pages) {
        if (item.unit_type == 'unit') item.unit_type = 'Units';
        item.units = item.units ? item.units : 1;
        item.charge = item.charge ? item.charge : item.units * item.billing_code_details.unit_price;
        item.unit_price = item.billing_code_details.unit_price ? item.billing_code_details.unit_price : 0;
        item.filteredmodifier = item.modifier_seed_data && item.modifier_seed_data.length ? item.modifier_seed_data.map(data => data.modifier_code) : [];
        item.modifierTotal = 0
        let modData = item.modifier_seed_data.map((e, i) => {
          let presentMod = modifier.includes(e.modifier_code)
          if (presentMod) {
            let modIndex = modifier.findIndex(m => m == e.modifier_code)
            if (e.modifier_code == modifier[modIndex]) {
              e.exclude_modifiers.map((ex, ind) => {
                let filterIndex = item.filteredmodifier.findIndex(m => m == ex)
                item.filteredmodifier.splice(filterIndex, 1)
              });
              if (+e.price_increase > 0) {

                let calculateChange = (+e.price_increase / 100) * (+item.units * +item.billing_code_details.unit_price);
                item.modifierTotal = (+item.modifierTotal + +calculateChange);
                item.charge = (+item.modifierTotal + +item.units * +item.billing_code_details.unit_price);
              }
            }
          }
        })
      }
      firstData = {
        id: item.id,
        modifierList: modifier,
        item_description: item.item_description,
        procedure_code: item.procedure_code,
        modifier: item.modifier,
        unitType: item.unit_type,
        units: item.units,
        charge: +item.charge,
        payment: item.payment_amount ? item.payment_amount : 0.00,
        balance: 0,
        isEditable: [true],
        unit_price: item.unit_price ? +item.unit_price : null,
        is_post_payment: item.is_post_payment,
        post_payment_id: item.post_payment_id,
        billing_code_details: item.billing_code_details,
        modifier_seed_data: item.modifier_seed_data,
        is_auto_generate: item.is_auto_generate,
        filteredmodifier: item.filteredmodifier,
        unitTotal: +item.charge,
        is_excess_pages: item.is_excess_pages,
        modifierTotal: item.modifierTotal
      }
      this.getFormControls.controls[i].patchValue(firstData)
    })
    group.get('isEditable').setValue(false);

  }

  remove(val: string, group: FormGroup, gruopindex?): void {
    const index = group.value.modifierList.indexOf(val);
    if (group.value.is_auto_generate && this.newFeeScheduleStatus && !group.value.is_excess_pages) {
      group.value.modifier_seed_data.map((e, i) => {
        if (e.modifier_code == val) {
          let modifier = e.exclude_modifiers.map((ex, ind) => {
            if (!group.get('filteredmodifier').value.includes(ex)) group.get('filteredmodifier').value.push(ex)
          })
          if (+e.price_increase > 0) {
            let calculateChange = (e.price_increase / 100) * (+group.get('units').value * +group.value.billing_code_details.unit_price);
            group.get('modifierTotal').patchValue(Math.abs(+group.get('modifierTotal').value - +calculateChange));
            group.get('charge').patchValue(Math.abs(+group.get('modifierTotal').value + (+group.get('units').value * +group.value.billing_code_details.unit_price)));
          }
        }
      });
      console.log(group);
    }
    if (index >= 0) {
      group.get('modifierList').value.splice(index, 1);
    }
    group.get('modifierList').updateValueAndValidity();
  }

  selected(event: MatAutocompleteSelectedEvent, group: FormGroup, index?): void {
    if (group.value.modifierList.length > 0 && group.value.modifierList.includes(event.option.viewValue)) {
      this.alertService.openSnackBar("Already added", "error");
      return;
    }
    if (group.value.modifierList.length > 3) {
      this.alertService.openSnackBar("Maximum 4 value", "error");
      return;
    }
    if (group.value.is_auto_generate && this.newFeeScheduleStatus) {
      group.value.modifier_seed_data.map((e, i) => {
        if (e.modifier_code == event.option.viewValue) {
          e.exclude_modifiers.map((ex, ind) => {
            let filterIndex = group.get('filteredmodifier').value.findIndex(m => m == ex)
            group.get('filteredmodifier').value.splice(filterIndex, 1)
          });
          if (+e.price_increase > 0) {
            let calculateChange = (e.price_increase / 100) * (+group.get('units').value * +group.value.billing_code_details.unit_price);
            group.get('modifierTotal').patchValue(Math.abs(+group.get('modifierTotal').value + +calculateChange));
            group.get('charge').patchValue(Math.abs(+group.get('modifierTotal').value + (+group.get('units').value * +group.value.billing_code_details.unit_price)));

          }
        }

      });
      console.log(group);
    }
    let modify = group.value.modifierList;
    modify.push(event.option.viewValue)
    group.get('modifierList').setValue(modify)
  }

  rowSelected(group: FormGroup) {
  }

  calculateTotal() {
    let total: any = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].get('charge').value) {
        total += parseFloat(this.getFormControls.controls[j].get('charge').value)
      }
    }
    return total.toFixed(2);
  }

  calculateTotalBal() {
    let total: any = 0;
    let payment: any = 0
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].get('charge').value) {
        total += parseFloat(this.getFormControls.controls[j].get('charge').value)
      }
      if (this.getFormControls.controls[j].get('payment').value) {
        payment += parseFloat(this.getFormControls.controls[j].get('payment').value)
      }
    }
    return (total - payment).toFixed(2);
  }

  calculateTotalPayment() {
    let total: any = 0;
    for (var j in this.getFormControls.controls) {
      if (this.getFormControls.controls[j].get('payment').value) {
        total += parseFloat(this.getFormControls.controls[j].get('payment').value)
      }
    }
    return total.toFixed(2);
  }

  openAuto(e, trigger: MatAutocompleteTrigger) {
    e.stopPropagation()
    trigger.openPanel();
  }

  add(event: MatChipInputEvent, group: FormGroup): void {
    return;
  }


}
