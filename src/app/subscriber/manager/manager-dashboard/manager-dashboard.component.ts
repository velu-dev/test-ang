import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/manager/new-intake'])
    }
  }
}
