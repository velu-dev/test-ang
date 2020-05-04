import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatDialog } from '@angular/material';
export interface PeriodicElement {
  billable_item: string;
  examiner: string;
  d_o_s: string;
  status: string;
}
@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss']
})


export class EditClaimComponent implements OnInit {
  panelOpenState = false;
  claimId: any;
  claimantDetail = {};
  claimDetail = {};
  constructor(private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location) {
    this.route.params.subscribe(param => {
      if (param.id) {
        this.claimId = param.id;
        this.claimService.getClaim(param.id).subscribe(res => {
          console.log("cliam", res.data)
          this.claimantDetail = res.data.claimant_details;
          this.claimDetail= res.data.claim_details;
        })
      }
    })
  }

  ngOnInit() {
  }

}



