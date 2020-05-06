import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
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
  @Input('state') states;
  @Input('injury') injuryDetails;
  constructor(public dialog: MatDialog, private claimService: ClaimService) {

  }

  ngOnInit() {
    this.claimService.seedData("body_part").subscribe(res => {
      this.bodyPartsList = res.data;
      let data = []
      console.log(this.injuryDetails, this.bodyPartsList)
      this.injuryDetails.map(res => {
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
            id: 37,
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
      width: '550px',
      data: { isEdit: true, data: injury }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  addInjury() {
    const dialogRef = this.dialog.open(InjuryPopup, {
      width: '550px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'injury-dialog',
  templateUrl: 'injury-dialog.html',
})
export class InjuryPopup {
  injuryInfo: any;
  // injuryInfo = { body_part_id: null, date_of_injury: null, continuous_trauma: false, continuous_trauma_start_date: null, continuous_trauma_end_date: null, injury_notes: null, diagram_url: null }
  today = new Date();
  bodyPartsList = [];
  isEdit: any;
  id: any;
  constructor(
    private claimService: ClaimService,
    public dialogRef: MatDialogRef<InjuryPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.injuryInfo = data['data'];
    this.isEdit = data['isEdit']
    this.claimService.seedData("body_part").subscribe(res => {
      this.bodyPartsList = res.data;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ctChange() {

  }
  addInjury() {
    this.claimService.updateInjury(this.injuryInfo, this.injuryInfo.claim_id).subscribe(res => {
      console.log("res", res)
    })
  }
}