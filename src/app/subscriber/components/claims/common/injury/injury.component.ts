import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  // providers: []
})
export class InjuryComponent implements OnInit {
  displayedColumns: string[] = ['body_part', 'date_of_injury', 'action'];
  dataSource: any;
  // bodyPartsList = [];
  claim_id: any = "";
  @Input('body_part') bodyPartsList;
  @Input('claim_id') claimId;
  @Input('state') states;
  @Input('date_of_birth') date_of_birth;
  injuryDetails = [];
  today = new Date();
  constructor(public dialog: MatDialog, private claimService: ClaimService, public alertService: AlertService) {
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
        this.getInjury();
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
      width: '350px',
      data: { name: 'delete', address: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.claimService.deleteInjury(data.id).subscribe(res => {
          this.alertService.openSnackBar("Injury deleted successfully!", "success")
          this.getInjury();
          this.injuryDetails.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.injuryDetails)
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      }
    })

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
  injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
  today = new Date();
  bodyPartsList = [];
  isEdit: any;
  id: any;
  date_of_birth: any;
  constructor(
    private claimService: ClaimService,
    public dialogRef: MatDialogRef<InjuryPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public alertService: AlertService) {
    this.bodyPartsList = data['body_parts'];
    this.claim_id = data['claim_id'];
    this.isEdit = data['isEdit'];
    this.date_of_birth = data['date_of_birth'];
    if (this.isEdit) {
      this.injuryInfo = data['data'];
    }
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ctChange() {
    if (!this.injuryInfo.continuous_trauma) {
      this.injuryInfo.continuous_trauma_start_date = null;
      this.injuryInfo.continuous_trauma_end_date = null;
    }
  }
  addInjury() {
    if (this.injuryInfo.body_part_id.length == 0) {
      this.alertService.openSnackBar("Please select body part", "error")
      return
    }
    if (!this.injuryInfo.date_of_injury) {
      this.alertService.openSnackBar("Please select injury date", "error")
      return
    } else {
      if (!(moment(this.injuryInfo.date_of_injury).isSameOrAfter(moment(this.date_of_birth)))) {
        this.alertService.openSnackBar("Please select injury date after date of birth", "error")
        return
      }
      if (!(moment(this.injuryInfo.date_of_injury).isSameOrBefore(moment(new Date())))) {
        this.alertService.openSnackBar("Please select injury date before today", "error");
        return
      }
    }
    if (this.injuryInfo.continuous_trauma) {
      if (this.injuryInfo.continuous_trauma_start_date) {
        if (!(moment(this.injuryInfo.continuous_trauma_start_date).isSameOrAfter(moment(this.date_of_birth)))) {
          this.alertService.openSnackBar("Continues trauma Start date should after date of birth", "error")
          return
        }
        if (!(moment(this.injuryInfo.continuous_trauma_start_date).isSameOrBefore(moment(new Date())))) {
          this.alertService.openSnackBar("Continues trauma Start date should be before today", "error");
          return
        }
        if (this.injuryInfo.continuous_trauma_end_date) {
          if (!(moment(this.injuryInfo.continuous_trauma_end_date).isSameOrAfter(moment(this.date_of_birth)))) {
            this.alertService.openSnackBar("Continues trauma End date should after date of birth", "error")
            return
          }
          if (!(moment(this.injuryInfo.continuous_trauma_end_date).isSameOrBefore(moment(new Date())))) {
            this.alertService.openSnackBar("Continues trauma End date should be before today", "error");
            return
          }
          if (!(moment(this.injuryInfo.continuous_trauma_start_date).isSameOrBefore(moment(this.injuryInfo.continuous_trauma_end_date)))) {
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
      let date = new Date(this.injuryInfo.date_of_injury)
      let injury = moment(date).format("MM-DD-YYYY")
      //this.injuryInfo.date_of_injury = new Date(this.injuryInfo.date_of_injury)
      //this.injuryInfo.date_of_injury = moment( this.injuryInfo.date_of_injury).format("MM-DD-YYYY")
      this.injuryInfo.body_part_id.map(res => {
        let editData = {
          id: this.injuryInfo['id'],
          body_part_id: [res],
          date_of_injury: injury,
          continuous_trauma: this.injuryInfo.continuous_trauma,
          continuous_trauma_start_date: this.injuryInfo.continuous_trauma_start_date,
          continuous_trauma_end_date: this.injuryInfo.continuous_trauma_end_date,
          injury_notes: this.injuryInfo.injury_notes,
          diagram_url: this.injuryInfo.diagram_url
        }
        this.claimService.updateInjury(editData, this.claim_id).subscribe(res => {
          this.alertService.openSnackBar(this.isEdit ? "Injury updated successfully" : "Injury added successfully", 'success')
          this.dialogRef.close();
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      })
    } else {
      let arrData = [];
      for (var i in this.injuryInfo['body_part_id']) {
        var part = {
          body_part_id: [this.injuryInfo['body_part_id'][i]],
          date_of_injury: this.injuryInfo['date_of_injury'],
          continuous_trauma: this.injuryInfo['continuous_trauma'],
          continuous_trauma_start_date: this.injuryInfo['continuous_trauma_start_date'],
          continuous_trauma_end_date: this.injuryInfo['continuous_trauma_end_date'],
          injury_notes: this.injuryInfo['injury_notes'],
          diagram_url: this.injuryInfo['diagram_url'],
        };
        arrData.push(part)
      }
      arrData.map(row => {
        row.date_of_injury = moment(row.date_of_injury).format("MM-DD-YYYY")
        this.claimService.updateInjury(row, this.claim_id).subscribe(res => {
          this.alertService.openSnackBar(this.isEdit ? "Injury updated successfully" : "Claim Injury added successfully", 'success')
          this.dialogRef.close();
        }, error => {
          this.alertService.openSnackBar(error.error.message, "error")
        })
      })
    }
  }
  cancel() {
    this.dialogRef.close('no');
  }
}