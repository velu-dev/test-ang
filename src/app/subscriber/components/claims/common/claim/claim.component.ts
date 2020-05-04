import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  @Input('claim') claimDetail;

  constructor() { }

  ngOnInit() {
  }

}
