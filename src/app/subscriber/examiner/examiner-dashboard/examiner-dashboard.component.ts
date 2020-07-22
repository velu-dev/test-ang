import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examiner-dashboard',
  templateUrl: './examiner-dashboard.component.html',
  styleUrls: ['./examiner-dashboard.component.scss']
})
export class ExaminerDashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/new-claim'])
    }
  }

}
