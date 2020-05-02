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
  displayedColumns: string[] = ['billable_item', 'examiner', 'd_o_s', 'status'];
  dataSource = ELEMENT_DATA;
  panelOpenState = false;
  constructor() { }

  ngOnInit() {
  }

}

const ELEMENT_DATA: PeriodicElement[] = [
  { billable_item: 'AME Examination', examiner: 'Dr. Martin', d_o_s: '30 Mar 2019', status: 'Paid' },
  { billable_item: 'Supplemental', examiner: 'Dr. Martin', d_o_s: '30 Mar 2019', status: 'Paid' },
  { billable_item: 'AME Reevaluation', examiner: 'Dr. Martin', d_o_s: '-', status: 'Awaiting Date' },
];


