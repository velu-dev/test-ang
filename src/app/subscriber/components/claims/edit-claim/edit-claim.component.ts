import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatDialog } from '@angular/material';
import { state } from 'src/app/shared/messages/errors'
import { BreadcrumbService } from 'xng-breadcrumb';
@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss']
})


export class EditClaimComponent implements OnInit {
  step = 0;
  panelOpenState = false;
  claimId: any;
  claimantDetail: any = {};
  claimDetail = {};
  claimAdminDetail = {};
  aAttorneyDetail = {};
  dAttorneyDetail = {};
  deuDetail = {};
  employeDetail = {};
  injuryDetails = [];
  isLoading = true;
  states = [];
  dateOfBirth: any;
  bodyParts = [];
  employerEdit: any;
  constructor(private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location,
    private breadcrumbService: BreadcrumbService) {
    this.claimService.seedData("body_part").subscribe(res => {
      this.bodyParts = res.data;
    })
    this.route.params.subscribe(param => {
      console.log(param);
      if (param.claim_id) {
        this.claimId = param.claim_id;
        this.isLoading = true;
        this.claimService.getClaim(param.claim_id).subscribe(res => {
          console.log(res.data.claimant_details)
          this.dateOfBirth = res.data.claimant_details.date_of_birth;
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
    this.claimService.seedData('state').subscribe(res => {
      this.states = res.data;
    })
  }
  navigateBillable() {
    this.router.navigate(['/subscriber/claimants/claimant/' + this.claimantDetail.id + '/claim/' + this.claimId + '/new-billable-item'])
  }

}



