import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource = new MatTableDataSource([]);
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  constructor(public router: Router, private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["", "Claimant", "Examiner", "Exam Procedure Type", "Standing", "Date of Service / Date of Item Received", "Critical"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', 'examiner_name', "exam_procedure_type", "standing", 'dos', 'critical']
      }
    })
  }

  ngOnInit() {
  }
  openMenu(menu) {
    if (menu == 'intake') {
      this.router.navigate(['subscriber/staff/new-intake'])
    }
  }
  expandId: any;
  openElement(element) {
    // if (this.isMobile) {
    this.expandId = element.id;
    // }
  }
}
