import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
@Component({
  selector: 'app-nodata',
  templateUrl: './nodata.component.html',
  styleUrls: ['./nodata.component.scss']
})
export class NodataComponent implements OnInit {
  table_no_data = globals.table_no_data
  constructor() { }

  ngOnInit() {
  }

}
