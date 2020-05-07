import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-claimant-details',
  templateUrl: './claimant-details.component.html',
  styleUrls: ['./claimant-details.component.scss']
})
export class ClaimantDetailsComponent implements OnInit {
  @Input('claimant') claimantDetailsclaiman;
  @Input('state') states;
  constructor() { }

  ngOnInit() {
  }

}
