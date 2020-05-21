import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DialogData, DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as moment from 'moment';

export interface PeriodicElement {
  body_part: string;
  d_o_i: string;
  action: string;
}
@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.scss']
})
export class InjuryComponent implements OnInit {
  displayedColumns: string[] = ['body_part', 'date_of_injury', 'action'];
  dataSource: any;
  bodyPartsList = [];
  claim_id: any = "";
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
    this.claimService.seedData("body_part").subscribe(res => {
      this.bodyPartsList = res.data;
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
    })
  }
  openDialog(injury): void {
    const dialogRef = this.dialog.open(InjuryPopup, {
      width: '800px',
      data: { isEdit: true, data: injury, claim_id: this.claimId, body_parts: this.bodyPartsList, date_of_birth: this.date_of_birth }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no')
        this.ngOnInit();
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
      data: { name: 'delete', address: false }
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

@Component({
  selector: 'injury-dialog',
  templateUrl: 'injury-dialog.html',
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ctChange() {

  }
  addInjury() {
    if (this.injuryInfo.continuous_trauma) {
      if (this.injuryInfo.continuous_trauma_start_date) {

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
      this.injuryInfo.date_of_injury = new Date(this.injuryInfo.date_of_injury)
      this.injuryInfo.date_of_injury = moment(this.injuryInfo.date_of_injury).format("MM-DD-YYYY")
      this.claimService.updateInjury(this.injuryInfo, this.claim_id).subscribe(res => {
        this.alertService.openSnackBar("Claim Injury updated successfully", 'success')
        this.dialogRef.close();
      }, error => {
        this.alertService.openSnackBar(error.error.message, "error")
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
          this.alertService.openSnackBar("Claim Injury updated successfully", 'success')
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