import { Component, OnInit } from '@angular/core';
import * as globals from '../../globals';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  no_data = globals.no_data
  constructor() { }

  ngOnInit() {
  }

}
