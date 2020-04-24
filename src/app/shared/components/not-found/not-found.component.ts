import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  page_not_found = globals.page_not_found;
  constructor() { }

  ngOnInit() {
  }

}
