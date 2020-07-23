import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/new-claim'])
    }
  }
}
