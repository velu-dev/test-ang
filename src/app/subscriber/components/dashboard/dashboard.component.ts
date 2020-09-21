import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public router: Router, private logger: NGXLogger) {
    this.logger.log("hi hello")
  }

  ngOnInit() {
  }
  navigate(menu) {
    this.router.navigate([this.router.url + menu])
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/new-intake'])
    }
  }
}
