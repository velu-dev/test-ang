import { Component, OnInit, Input } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
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
  selector: 'app-update-billable-item',
  templateUrl: './update-billable-item.component.html',
  styleUrls: ['./update-billable-item.component.scss'],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }]
})
export class UpdateBillableItemComponent implements OnInit {
  displayedColumns: string[] = ['billable_item', 'd_o_s', 'examiner', 'status'];
  dataSource: any;
  @Input('state') states;
  @Input('claim_id') claimId;
  @Input('claimant_id') claimantId;


  constructor(private claimService: ClaimService, private router: Router) { }

  ngOnInit() {
    this.claimService.getbillableItem(this.claimId).subscribe(billRes => {
      console.log("billRes", billRes)
      this.dataSource = new MatTableDataSource(billRes['data'])
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }


  navigateBillableEdit(e) {
    this.router.navigate(['/subscriber/billable-item/new-billable-item', this.claimId, this.claimantId, e.id])
  }


}