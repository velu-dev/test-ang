import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { date_of_birth } from 'src/app/shared/messages/errors';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
  body_part: string;
  d_o_i: string;
  action: string;
}
export const PICK_FORMATS = {
  // parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  // display: {
  //   dateInput: 'input',
  //   monthYearLabel: { year: 'numeric', month: 'short' },
  //   dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  //   monthYearA11yLabel: { year: 'numeric', month: 'long' }
  // }
};
@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
  // providers: []
})
export class InjuryComponent implements OnInit {
  // displayedColumns: string[] = ['body_part', 'date_of_injury', 'action'];
  // dataSource: any;
  // bodyPartsList = [];
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  expandedElement: any;
  claim_id: any = "";
  @Input('body_part') bodyPartsList;
  @Input('claim_id') claimId;
  @Input('state') states;
  @Input('date_of_birth') date_of_birth;
  injuryDetails = [];
  today = new Date();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile = false;
  constructor(public dialog: MatDialog, private claimService: ClaimService, public alertService: AlertService, private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Body parts", "Action"]
        this.columnsToDisplay = ['is_expand', 'body_part', "action"]
      } else {
        this.columnName = ["Body parts", "Date of injury", "Action"]
        this.columnsToDisplay = ['body_part', 'date_of_injury', "action"]
      }
    })
  }

  ngOnInit() {
    this.getInjury();
  }
  getInjury() {
    this.claimService.getInjury(this.claimId).subscribe(res => {
      this.injuryDetails = res.data;
      this.injuryParser();
    })
  }
  injuryParser() {
    // this.claimService.seedData("body_part").subscribe(res => {
    // this.bodyPartsList = res.data;
    let data = [];
    if (this.injuryDetails)
      this.injuryDetails.map(res => {
        this.claim_id = res.claim_id;
        let bpart = [];
        res.body_part_id.map(bp => {
          let iii = this.bodyPartsList.find(val => val.id == bp)
          if (iii)
            bpart.push(iii.body_part_code + " - " + iii.body_part_name);
          let i = {
            claim_id: res.claim_id,
            continuous_trauma: res.continuous_trauma,
            continuous_trauma_end_date: res.continuous_trauma_end_date,
            continuous_trauma_start_date: res.continuous_trauma_start_date,
            date_of_injury: res.date_of_injury,
            id: res.id,
            injury_notes: res.injury_notes,
            body_part_id: [bp],
            body_part: bpart.join(",")
          }
          data.push(i)
        })
      })
    this.dataSource = new MatTableDataSource(data)
    // })
  }
  openDialog(injury, index): void {
    const dialogRef = this.dialog.open(InjuryPopup, {
      width: '800px',
      disableClose: true,
      data: { isEdit: true, data: injury, claim_id: this.claimId, body_parts: this.bodyPartsList, date_of_birth: this.date_of_birth }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no') {
        this.ngOnInit();
      } else {
        // this.getInjury();
      }
    });
  }
  addInjury() {
    const dialogRef = this.dialog.open(InjuryPopup, {
      width: '800px',
      data: { isEdit: false, claim_id: this.claimId, body_parts: this.bodyPartsList, date_of_birth: this.date_of_birth }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no')
        this.ngOnInit()
    });
  }

  deleteInjury(data, index) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '500px',
      data: { name: 'remove', address: true, title: data.body_part }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.claimService.deleteInjury(data.id).subscribe(res => {
          this.alertService.openSnackBar("Injury removed successfully", "success")
          this.getInjury();
          this.injuryDetails.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.injuryDetails)
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      }
    })

  }
  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
  }
}

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
  selector: 'injury-dialog',
  templateUrl: 'injury-dialog.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class InjuryPopup {
  claim_id: any = "";
  injuryInfo = { id: null, body_part_id: [], date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
  today = new Date();
  bodyPartsList = [];
  isEdit: any;
  id: any;
  date_of_birth: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  bodyPartCtrl = new FormControl();
  filteredBodyParts: Observable<string[]>;
  bodyParts: string[] = [];
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  constructor(
    private claimService: ClaimService,
    public dialogRef: MatDialogRef<InjuryPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public alertService: AlertService) {
    // this.bodyPartsList = data['body_parts'];
    data['body_parts'].map(bp => {
      let body_part = bp;
      body_part.body_part_with_code = (bp.body_part_code + " - " + bp.body_part_name)
      this.bodyPartsList.push(body_part);
    })
    this.filteredBodyParts = this.bodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((body_part: string | null) => body_part ? this._filter(body_part) : this.bodyPartsList.slice()));
    this.claim_id = data['claim_id'];
    this.isEdit = data['isEdit'];
    this.date_of_birth = moment(data['date_of_birth']);
    if (this.isEdit) {
      data['data'].body_part_id.map(id => {
        this.bodyPartsList.map(bp => {
          if (bp.id == id) {
            this.bodyParts.push(bp.body_part_code + " - " + bp.body_part_name)
          }
        })
      })
      this.injuryInfo.body_part_id = data["data"]["body_part_id"];
      this.injuryInfo.continuous_trauma = data["data"]["continuous_trauma"];
      this.injuryInfo.continuous_trauma_end_date = data["data"]["continuous_trauma_end_date"] ? moment(data["data"]["continuous_trauma_end_date"].split("T")[0]) : null,
        this.injuryInfo.continuous_trauma_start_date = data["data"]["continuous_trauma_start_date"] ? moment(data["data"]["continuous_trauma_start_date"].split("T")[0]) : null;
      this.injuryInfo.date_of_injury = data["data"]["date_of_injury"] ? moment(data["data"]["date_of_injury"].split("T")[0]) : null;
      this.injuryInfo.injury_notes = data["data"]["injury_notes"];
      this.injuryInfo.id = data["data"]["id"];
    }
    dialogRef.disableClose = true;
  }
  onDate(event): void {
    if (this.injuryInfo.continuous_trauma) {
      this.injuryInfo.continuous_trauma_start_date = new Date(this.injuryInfo.date_of_injury);
    }
  }
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.bodyParts.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.bodyPartCtrl.setValue(null);
    }
  }

  remove(body_part: string): void {
    console.log(body_part)
    const index = this.bodyParts.indexOf(body_part);

    if (index >= 0) {
      this.injuryInfo.body_part_id.splice(index, 1)
      this.bodyParts.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option)
    this.bodyParts.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.bodyPartCtrl.setValue(null);
  }
  selectBodypart(body_part) {
    this.injuryInfo.body_part_id.push(body_part.id)
  }

  private _filter(value: string): string[] {
    let filterValue = "";
    if (typeof (value) == 'string')
      filterValue = value.toLowerCase();
    return this.bodyPartsList.filter(body_part => body_part.body_part_with_code.toLowerCase().indexOf(filterValue) >= 0);
  }
  bodyPart(bodypart) {
    for (var i in this.bodyPartsList) {
      if (this.bodyPartsList[i].id == bodypart[0]) {
        return this.bodyPartsList[i].body_part_code + "-" + this.bodyPartsList[i].body_part_name
      }
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ctChange() {
    if (!this.injuryInfo.continuous_trauma) {
      this.injuryInfo.continuous_trauma_start_date = null;
      this.injuryInfo.continuous_trauma_end_date = null;
    }
    if (this.injuryInfo.continuous_trauma) {
      // if (!this.isEdit) {
      this.injuryInfo.continuous_trauma_start_date = new Date(this.injuryInfo.date_of_injury);
      // }
    }
  }
  addInjury() {
    let date_of_birth = moment(this.date_of_birth, 'MM-DD-YYYY')//.format('MM-DD-YYYY[T]HH:mm:ss');// moment(this.date_of_birth, "MM-DD-YYYY");
    let injury_date = this.injuryInfo.date_of_injury ? moment(this.injuryInfo.date_of_injury, "MM-DD-YYYY") : null;
    let ct_start_date = this.injuryInfo.continuous_trauma_start_date ? moment(this.injuryInfo.continuous_trauma_start_date, "MM-DD-YYYY") : null;
    let ct_end_date = this.injuryInfo.continuous_trauma_end_date ? moment(this.injuryInfo.continuous_trauma_end_date, "MM-DD-YYYY") : null;
    if (this.injuryInfo.body_part_id.length == 0) {
      this.alertService.openSnackBar("Please select body part", "error")
      return
    }
    if (!this.injuryInfo.date_of_injury) {
      this.alertService.openSnackBar("Please select injury date", "error")
      return
    } else {
      if (!(injury_date.isSameOrAfter(date_of_birth))) {
        this.alertService.openSnackBar("Please select injury date greater than date of birth", "error")
        return
      }
      if (!(injury_date.isSameOrBefore(moment(new Date())))) {
        this.alertService.openSnackBar("Please select injury date before today", "error");
        return
      }
    }
    if (this.injuryInfo.continuous_trauma) {
      if (this.injuryInfo.continuous_trauma_start_date) {
        if (!(ct_start_date.isSameOrAfter(date_of_birth))) {
          this.alertService.openSnackBar("Continues trauma Start date should after date of birth", "error")
          return
        }
        if (!(ct_start_date.isSameOrBefore(moment(new Date())))) {
          this.alertService.openSnackBar("Continues trauma Start date should be before today", "error");
          return
        }
        if (this.injuryInfo.continuous_trauma_end_date) {
          if (!(ct_end_date.isSameOrAfter(date_of_birth))) {
            this.alertService.openSnackBar("Continues trauma End date should after date of birth", "error")
            return
          }
          if (!(ct_end_date.isSameOrBefore(moment(new Date())))) {
            this.alertService.openSnackBar("Continues trauma End date should be before today", "error");
            return
          }
          if (!(ct_start_date.isSameOrBefore(ct_end_date))) {
            this.alertService.openSnackBar("Continues trauma end date should below than start date", "error")
            return
          }
        }
      } else {
        this.alertService.openSnackBar("Please select start date", "error")
        return;
      }
    }
    if (!this.injuryInfo.body_part_id) {
      this.alertService.openSnackBar("Please fill the injury information", "error")
      return;
    } else {
      if (!this.injuryInfo.date_of_injury) {
        this.alertService.openSnackBar("Please fill the injury date", "error")
        return
      }
    }

    if (this.isEdit) {
      // let date = new Date(this.injuryInfo.date_of_injury)
      // let injury = moment(date).format("MM-DD-YYYY")
      this.injuryInfo.body_part_id.map(res => {
        let editData = {
          id: this.injuryInfo['id'],
          body_part_id: [res],
          date_of_injury: this.injuryInfo.date_of_injury ? moment(this.injuryInfo.date_of_injury).format("MM-DD-YYYY") : null,
          continuous_trauma: this.injuryInfo.continuous_trauma,
          continuous_trauma_start_date: this.injuryInfo.continuous_trauma_start_date ? moment(this.injuryInfo.continuous_trauma_start_date).format("MM-DD-YYYY") : null,
          continuous_trauma_end_date: this.injuryInfo.continuous_trauma_end_date ? moment(this.injuryInfo.continuous_trauma_end_date).format("MM-DD-YYYY") : null,
          injury_notes: this.injuryInfo.injury_notes,
          diagram_url: this.injuryInfo.diagram_url
        }
        this.claimService.updateInjury(editData, this.claim_id).subscribe(res => {
          this.alertService.openSnackBar(this.isEdit ? "Injury updated successfully" : "Injury added successfully", 'success')
          this.dialogRef.close();
          this.isEdit = false;
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      })
    } else {
      let arrData = [];
      for (var i in this.injuryInfo['body_part_id']) {
        var part = {
          body_part_id: [this.injuryInfo['body_part_id'][i]],
          date_of_injury: this.injuryInfo.date_of_injury ? moment(this.injuryInfo.date_of_injury).format("MM-DD-YYYY") : null,
          continuous_trauma: this.injuryInfo['continuous_trauma'],
          continuous_trauma_start_date: this.injuryInfo.continuous_trauma_start_date ? moment(this.injuryInfo.continuous_trauma_start_date).format("MM-DD-YYYY") : null,
          continuous_trauma_end_date: this.injuryInfo.continuous_trauma_end_date ? moment(this.injuryInfo.continuous_trauma_end_date).format("MM-DD-YYYY") : null,
          injury_notes: this.injuryInfo['injury_notes'],
          diagram_url: this.injuryInfo['diagram_url'],
        };
        arrData.push(part)
      }

      // let count = 0;
      // arrData.map(row => {
      this.claimService.addInjury(arrData, this.claim_id).subscribe(res => {
        // if (arrData.length == count)
        this.dialogRef.close();
        this.alertService.openSnackBar(this.isEdit ? "Injury updated successfully" : "Claim Injury added successfully", 'success')
      }, error => {
        this.alertService.openSnackBar(error.error.message, "error")
      })
      //   count = count + 1;
      // })
    }
  }
  changeEvent() {
    this.date_of_birth = moment(this.date_of_birth, "MM-DD-YYYY");// moment(this.claimant.date_of_birth);
  }
  cancel() {
    this.dialogRef.close('no');
  }
}