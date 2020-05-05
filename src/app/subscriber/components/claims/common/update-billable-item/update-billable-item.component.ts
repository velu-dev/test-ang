import { Component, OnInit, Input } from '@angular/core';
export interface PeriodicElement {
  billable_item: string;
  examiner: string;
  d_o_s: string;
  status: string;
}
@Component({
  selector: 'app-update-billable-item',
  templateUrl: './update-billable-item.component.html',
  styleUrls: ['./update-billable-item.component.scss']
})
export class UpdateBillableItemComponent implements OnInit {
  displayedColumns: string[] = ['billable_item', 'examiner', 'd_o_s', 'status'];
  dataSource = ELEMENT_DATA;
  @Input('state') states;
  constructor() { }

  ngOnInit() {
  }

}
const ELEMENT_DATA: PeriodicElement[] = [
  { billable_item: 'AME Examination', examiner: 'Dr. Martin', d_o_s: '30 Mar 2019', status: 'Paid' },
  { billable_item: 'Supplemental', examiner: 'Dr. Martin', d_o_s: '30 Mar 2019', status: 'Paid' },
  { billable_item: 'AME Reevaluation', examiner: 'Dr. Martin', d_o_s: '-', status: 'Awaiting Date' },
];
