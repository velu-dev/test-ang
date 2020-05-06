import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatDialog } from '@angular/material';
import { state } from 'src/app/shared/messages/errors';
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
  claimAdminDetail = {};
  aAttorneyDetail = {};
  dAttorneyDetail = {};
  deuDetail = {};
  employeDetail = {};
  injuryDetails = [];
  claimAdminEdit = false;
  employerEdit = false;
  aaEdit = false;
  daEdit = false;
  deoEdit = false;
  isLoading = true;
  states = [];
  constructor(private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location) {
    this.claimService.seedData('state').subscribe(res => {
      this.states = res.data;
    })
    this.route.params.subscribe(param => {
      if (param.id) {
        this.claimId = param.id;
        this.isLoading = true;
        this.claimService.getClaim(param.id).subscribe(res => {
          this.claimantDetail = res.data.claimant_details;
          this.claimDetail = res.data.claim_details;
          this.claimAdminDetail = res.data.agent_details.InsuranceAdjuster;
          this.employeDetail = res.data.agent_details.Employer;
          this.aAttorneyDetail = res.data.agent_details.ApplicantAttorney;
          this.dAttorneyDetail = res.data.agent_details.DefenseAttorney;
          this.deuDetail = res.data.agent_details.DEU;
          this.injuryDetails = res.data.claim_injuries;
          this.isLoading = false;
        })
      }
    })
  }

  ngOnInit() {
  }
  setStep(a){

  }

}



