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
  claimAdminEdit = false;
  employerEdit = false;
  aaEdit = false;
  daEdit = false;
  deoEdit = false;
  saveClick = { claimAdmin: false, employer: false, aa: false, da: false, deu: false };
  isLoading = true;
  states = [];
  isSectionOpen: boolean = false;
  constructor(private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location) {
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
    this.claimService.seedData('state').subscribe(res => {
      this.states = res.data;
    })
  }
  isStepOpen = false;
  setStep(event) {
    console.log("at open", this.isClosed, this.isStepOpen)
    this.isStepOpen = true;
    this.step = event;
    if (event == 2) {
      this.isClosed.ca = true;
    } else if (event == 3) {
      this.isClosed.emp = true;
    } else if (event == 4) {
      this.isClosed.aa = true;
    } else if (event == 5) {
      this.isClosed.da = true;
    } else if (event == 6) {
      this.isClosed.deu = true;
    }
  }
  isClosed = { aa: false, ca: false, da: false, deu: false, emp: false };
  closed(event) {
    this.claimAdminEdit = false;
    this.employerEdit = false;
    this.aaEdit = false;
    this.daEdit = false;
    this.deoEdit = false;
    this.isStepOpen = false;
    if (event == "ca") {
      this.isClosed.ca = false;
    } else if (event == "emp") {
      this.isClosed.emp = false;
    } else if (event == "aa") {
      this.isClosed.aa = false;
    } else if (event == "da") {
      this.isClosed.da = false;
    } else {
      this.isClosed.deu = false;
    }
  }
  isEditChange(event, type) {
    console.log(event)
    if (type == "ca") {
      this.claimAdminEdit = false;
    } else if (type == "emp") {
      this.employerEdit = false;
    } else if (type == "aa") {
      this.aaEdit = false;
    } else if (type == "da") {
      this.daEdit = false;
    } else {
      this.deoEdit = false;
    }
  }
  navigateBillable() {
    this.router.navigate(['/subscriber/new-billable-item', this.claimId, this.claimantDetail.id])
  }

}



