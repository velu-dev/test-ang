import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';
import { Router } from '@angular/router';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  page_not_found = globals.page_not_found;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  gotoHome() {
    this.router.navigate(['/'])
  }
}
