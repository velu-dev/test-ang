import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-claimant-details',
  templateUrl: './claimant-details.component.html',
  styleUrls: ['./claimant-details.component.scss']
})
export class ClaimantDetailsComponent implements OnInit {
  @Input('claimant') claimantDetailsclaimant;
  @Input('state') states;
  constructor() {
    console.log("saasa", this.claimantDetailsclaimant)
  }

  ngOnInit() {
  }

}
