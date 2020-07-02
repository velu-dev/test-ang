import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-claimant-details',
  templateUrl: './claimant-details.component.html',
  styleUrls: ['./claimant-details.component.scss']
})
export class ClaimantDetailsComponent implements OnInit {
  @Input('claimant') claimantDetailsclaimant;
  @Input('state') states;
  claimant_name = "";
  constructor() {

  }

  ngOnInit() {
    this.claimant_name = (this.claimantDetailsclaimant.first_name == null ? "" : this.claimantDetailsclaimant.first_name) + " " + (this.claimantDetailsclaimant.middle_name == null ? "" : this.claimantDetailsclaimant.middle_name) + " " + (this.claimantDetailsclaimant.last_name == null ? "" : this.claimantDetailsclaimant.last_name)
  }

}
