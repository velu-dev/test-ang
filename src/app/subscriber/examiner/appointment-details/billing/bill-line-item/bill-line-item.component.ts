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
import { formatDate, Location } from '@angular/common';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { saveAs } from 'file-saver';
import { AlertDialogueComponent } from 'src/app/shared/components/alert-dialogue/alert-dialogue.component';

@Component({
  selector: 'app-bill-line-item',
  templateUrl: './bill-line-item.component.html',
  styleUrls: ['./bill-line-item.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      state('void', style({ height: '0px', minHeight: '0' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillLineItemComponent implements OnInit {

  @Input() billingData: any;
  @Input() paramsId: any;
  @Input() isMobile: any;
  @Input() review: string;
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
  @ViewChild('uploader', { static: false }) fileUpload: ElementRef;
  selectAllStatus: boolean = false;
  showDocumentSec: boolean = false;
  selectedFiles: FileList;
  fileList = [];
  fileName: any = []
  support_documents = [];
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

    if (this.review.toLowerCase() == 'second') {
      this.userTable = this.fb.group({
        payor_claim_control_number: ['', Validators.compose([Validators.required])],
        file: [],
        tableRows: this.fb.array([])
      });
      this.fileList = [];
      this.fileName = [];
      this.showDocumentSec = false;
      this.selectAllStatus = false;
    } else {
      this.userTable = this.fb.group({
        tableRows: this.fb.array([])
      });
    }

    this.billingService.getBillLineItem(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId).subscribe(line => {
      if (!this.billingData.certified_interpreter_required) {
        let index = this.modiferList.indexOf('93');
        this.modiferList.splice(index, 1)
      }
      if (!this.billingData.is_psychological_exam) {
        let index = this.modiferList.indexOf('96');
        this.modiferList.splice(index, 1)
      }
      this.filteredmodifier = this.modiferList
      let firstLineCharge: boolean = false;
      if (line.data) {
        this.billing_line_items = line.data;
        firstLineCharge = this.billing_line_items[0].charge ? false : true;
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
          if (this.review.toLowerCase() == 'second') {
            firstData['bill_request_reason'] = item.support_documents_details.bill_request_reason;
            firstData['billed_service_authorized'] = item.support_documents_details.billed_service_authorized ? item.support_documents_details.billed_service_authorized : false;
            firstData['support_documents_attached'] = item.support_documents_details.support_documents_attached ? item.support_documents_details.support_documents_attached : false;
          }
          this.getFormControls.controls[index].patchValue(firstData)
          if (this.getFormControls.controls[index].status == "VALID") {
            this.getFormControls.controls[index].get('isEditable').setValue(false);
          }
          if (this.review.toLowerCase() == 'second') {
            this.getFormControls.controls[index].get('isEditable').setValue(false);
          }
        })
        if (this.review.toLowerCase() == 'second') {
          this.support_documents = line.support_documents ? line.support_documents : [];
          this.userTable.get('payor_claim_control_number').patchValue(line.payor_claim_control_number);
        }

        if (this.newFeeScheduleStatus && firstLineCharge && this.getFormControls.at(0)) {
          let moidfier = this.getFormControls.at(0).get('modifierList').value.toString();
          moidfier = moidfier ? moidfier.replace(/,/g, '-') : null;
          let data = {
            id: this.getFormControls.at(0).value.id,
            item_description: this.getFormControls.at(0).value.item_description,
            procedure_code: this.getFormControls.at(0).value.procedure_code,
            modifier: moidfier,
            units: this.getFormControls.at(0).value.units,
            charge: this.getFormControls.at(0).get('charge').value ? parseFloat(this.getFormControls.at(0).get('charge').value).toFixed(2) : this.getFormControls.at(0).get('charge').value,
            total_charge: this.calculateTotal(),
            unit_type: this.getFormControls.at(0).value.unitType,
            unit_short_code: this.getUnitCode(this.getFormControls.at(0).value.unitType)
          }

          this.billingService.createBillLine(this.paramsId.billingId, this.paramsId.billId, this.paramsId.claim_id, data).subscribe(line => {
          }, error => {
            this.alertService.openSnackBar(error.error.message, 'error');
          })
        }
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
      is_excess_pages: [null],
      reviewShow: [false],

      bill_request_reason: [],
      billed_service_authorized: [false],
      support_documents_attached: [false],

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
      this.intercom.setBillItemChange(this.billing_line_items[index])
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

  reviewCheck(value, group, groupAll) {
    group.get('reviewShow').patchValue(value);
    if (value) {
      this.showDocumentSec = true;
    }
    if (!value) {
      this.selectAllStatus = value
    }
    let statusArr = groupAll.map(data => {
      return data.get('reviewShow').value;
    })

    if (statusArr.includes(true)) {
      this.showDocumentSec = true;
    } else {
      this.showDocumentSec = false;
    }
  }


  selectAllCheck(value, group) {
    group.map((data, i) => {
      data.get('reviewShow').patchValue(value);
    })
    if (value) {
      this.showDocumentSec = true;
    } else {
      this.showDocumentSec = false;
    }
  }

  saveReview(grp, fullForm) {
    console.log(grp, fullForm)
    let showConfirmDialog = false;
    let reason_details = []
    let formData = new FormData()
    grp.map((data, i) => {
      console.log(data)
      if (data.get('reviewShow').value) {
        reason_details.push({
          bill_line_item_id: data.get('id').value,
          bill_request_reason: data.get('bill_request_reason').value,
          billed_service_authorized: data.get('billed_service_authorized').value,
          support_documents_attached: data.get('support_documents_attached').value
        })
        data.get('bill_request_reason').setValidators([Validators.required])
        data.get('billed_service_authorized').setValidators([Validators.required])
        data.get('support_documents_attached').setValidators([Validators.required])
        data.get('bill_request_reason').updateValueAndValidity();
        data.get('billed_service_authorized').updateValueAndValidity();
        data.get('support_documents_attached').updateValueAndValidity();
      } else {
        data.get('bill_request_reason').setValidators([])
        data.get('billed_service_authorized').setValidators([])
        data.get('support_documents_attached').setValidators([])
        data.get('bill_request_reason').updateValueAndValidity();
        data.get('billed_service_authorized').updateValueAndValidity();
        data.get('support_documents_attached').updateValueAndValidity();
      }
      if (data.get('support_documents_attached').value) {
        showConfirmDialog = true;
      }

    })



    if (grp.status == "INVALID" || fullForm.status == "INVALID") {
      //grp.markAllAsTouched();
      //fullForm.markAllAsTouched();
      return;
    }

    if (showConfirmDialog && this.fileList && this.fileList.length == 0 && this.support_documents && this.support_documents.length == 0) {
      const dialogRef = this.dialog.open(AlertDialogueComponent, {
        width: '500px',
        data: { title: 'Bill Line Item', message: "Select supporting Document 'Yes' but not File exist, Do you want to proceed?", yes: true, no: true, type: "info", info: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          formData.append('reason_details', JSON.stringify(reason_details));
          formData.append('payor_claim_control_number', fullForm.get('payor_claim_control_number').value);
          formData.append('is_file_changed', this.fileList && this.fileList.length > 0 ? 'true' : 'false');

          if (this.fileList) {
            for (let i = 0; i < this.fileList.length; i++) {
              formData.append('file', this.fileList[i]);
            }
          }

          this.billingService.postSBRSupport(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, formData).subscribe(line => {
            console.log(line);
            this.alertService.openSnackBar('Updated Successfully', 'success');
            this.fileList = []
          }, error => {
            console.log(error);
          })
        } else {
          return;
        }
      })
      return;
    }

    formData.append('reason_details', JSON.stringify(reason_details));
    formData.append('payor_claim_control_number', fullForm.get('payor_claim_control_number').value);
    formData.append('is_file_changed', this.fileList && this.fileList.length > 0 ? 'true' : 'false');

    if (this.fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append('file', this.fileList[i]);
      }
    }

    this.billingService.postSBRSupport(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, formData).subscribe(line => {
      console.log(line);
      this.alertService.openSnackBar('Updated Successfully', 'success');
      this.fileList = [];
      this.fileName = [];
      this.support_documents = line.data.support_documents ? line.data.support_documents : [];
    }, error => {
      console.log(error);
    })
  }


  addFile(event) {
    // this.selectedFiles = null
    this.selectedFiles = event.target.files;
    let fileTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];


    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (fileTypes.includes(this.selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = this.selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 501) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar("File size is too large", 'error');
          return;
        }
        this.fileName.push({ file_name: this.selectedFiles[i].name })
        this.fileList.push(this.selectedFiles[i])
        console.log(this.selectedFiles[i])
      } else {
        this.selectedFiles = null
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }

    // group.get('file').patchValue(this.selectedFiles);
    // group.get('support_documents').patchValue(this.fileName);
  }

  download(element, file_name) {
    this.billingService.downloadOndemandDocuments({ file_url: element }).subscribe(res => {
      this.alertService.openSnackBar("File downloaded successfully", "success");
      saveAs(res.signed_file_url, file_name);
    })
  }

  RemoveFile(file, index) {
    console.log(this.fileList)
    this.openDialogDelete('delete', file, index);

  }

  openDialogDelete(dialogue, data, index) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: dialogue, address: true, title: data.file_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        console.log(data, index);
        if (data.id) {
          this.billingService.removeLineDoc(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, data.id).subscribe(del => {
            console.log(del)
            this.support_documents.splice(index, 1)
          })
        } else {
          this.fileList.splice(index, 1)
          this.fileName.splice(index, 1)
        }
      }
    })


  }

  reuploadFile(event, file, index) {

    let selectedFiles = event.target.files;
    let fileTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];


    for (let i = 0; i < selectedFiles.length; i++) {
      if (fileTypes.includes(selectedFiles[i].name.split('.').pop().toLowerCase())) {
        var FileSize = selectedFiles[i].size / 1024 / 1024; // in MB
        if (FileSize > 501) {
          this.fileUpload.nativeElement.value = "";
          this.alertService.openSnackBar("File size is too large", 'error');
          return;
        }
        this.fileName.push({ file_name: selectedFiles[i].name })
        this.fileList.push(selectedFiles[i])
        if (file && file.id) {
          this.billingService.removeLineDoc(this.paramsId.claim_id, this.paramsId.billId, this.paramsId.billingId, file.id).subscribe(del => {
            console.log(del)
            this.support_documents.splice(index, 1);
            // this.fileUpload.nativeElement.click();
          })
        } else {
          this.fileList.splice(index, 1)
          this.fileName.splice(index, 1)
        }
      } else {
        selectedFiles = null
        this.fileUpload.nativeElement.value = "";
        this.alertService.openSnackBar("This file type is not accepted", 'error');
      }
    }


  }

  BillLineSame(group, index, event) {
    if (event.checked) {
      let formData = {
        bill_request_reason: this.getFormControls.controls[index - 1].value.bill_request_reason,
        billed_service_authorized: this.getFormControls.controls[index - 1].value.billed_service_authorized,
        support_documents_attached: this.getFormControls.controls[index - 1].value.support_documents_attached
      }
      group.patchValue(formData)
    } else {
      let formData = {
        bill_request_reason: '',
        billed_service_authorized: false,
        support_documents_attached: false
      }
      group.patchValue(formData)
    }
  }

}