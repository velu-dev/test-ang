import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}



