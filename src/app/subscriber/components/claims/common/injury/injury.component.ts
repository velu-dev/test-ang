import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  body_part: string;
  d_o_i: string;
  action: string;
}
@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.scss']
})
export class InjuryComponent implements OnInit {
  displayedColumns: string[] = ['body_part', 'd_o_i', 'action'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}

const ELEMENT_DATA: PeriodicElement[] = [
  { body_part: '148 - Face - multiple parts any combination of above parts', d_o_i: '05-04-2020 ', action: ' ' }
];