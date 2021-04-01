import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatDialog } from '@angular/material';
import { state } from 'src/app/shared/messages/errors'
import { BreadcrumbService } from 'xng-breadcrumb';
import { breadcrumbreducer } from 'src/app/shared/store/breadcrumb.reducer';
import { IntercomService } from 'src/app/services/intercom.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
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
  claimDetail = { exam_type_id: null };
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
  is_billable_item_available: any;
  constructor(private claimService: ClaimService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location,
    private intercom: IntercomService,
    private cookieService: CookieService
  ) {
    this.intercom.setClaimant("Claimant");
    this.intercom.setClaimNumber("Claim");
    this.claimService.seedData('state').subscribe(res => {
      this.states = res.data;
    })
    this.claimService.seedData("body_part").subscribe(res => {
      this.bodyParts = res.data;
    })
    this.route.params.subscribe(param => {
      console.log(param);
      if (param.claim_id) {
        this.claimId = param.claim_id;
        this.isLoading = true;
        this.claimService.getClaim(param.claim_id).subscribe(res => {
          this.intercom.setClaimant(res['data'].claimant_details.first_name + ' ' + res['data'].claimant_details.last_name);
          this.cookieService.set('claimDetails', res['data'].claimant_details.first_name + ' ' + res['data'].claimant_details.last_name)
          this.intercom.setClaimNumber(res.data.claim_details.claim_number);
          this.dateOfBirth = res.data.claimant_details.date_of_birth;
          this.claimantDetail = res.data.claimant_details;
          this.claimDetail = res.data.claim_details;
          this.claimDetail['is_billable_item_available'] = res.data.is_billable_item_available;
          this.is_billable_item_available = res.data.is_billable_item_available;
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
  public changeExamType(exam_type_id: any): void {
    if (exam_type_id == 3) {
      this.claimDetail['exam_type_id'] = exam_type_id;
    } else {
      this.claimDetail['exam_type_id'] = exam_type_id;
    }
  }
  billableItemCount = 0;
  public billableitemCount(count: any): void {
    this.billableItemCount = count;
    if (count == 0) {
      this.is_billable_item_available = false;
      this.claimDetail['is_billable_item_available'] = false;
    } else {
      this.is_billable_item_available = true;
      this.claimDetail['is_billable_item_available'] = true;
    }
  }
  onChange(eve) {
    window.location.reload();
    // console.log("fdsfdsfdsf")
    // this.router.navigate([this.router.url])
  }
  ngOnInit() {
  }
  navigateBillable() {
    this.router.navigate([this.router.url + '/new-billable-item'])
  }

}



