import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExaminerService } from '../../service/examiner.service';

@Component({
  selector: 'app-examiner-dashboard',
  templateUrl: './examiner-dashboard.component.html',
  styleUrls: ['./examiner-dashboard.component.scss']
})
export class ExaminerDashboardComponent implements OnInit {
  dashboardData: any;
  constructor(private examinerService: ExaminerService, private router: Router) {
    this.getCount();
  }

  ngOnInit() {
  }
  getCount() {
    this.examinerService.getExaminerDashboardData().subscribe(res => {
      this.dashboardData = res.data;
    }, error => {

    })
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/examiner/new-intake'])
    }
  }

}
