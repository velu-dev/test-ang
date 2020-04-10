import { Component, OnInit, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppointmentComponent implements OnInit {
  xls = globals.xls
  completed = globals.completed
  columnName = []
  columnsToDisplay = [];
  displayedColumns: string[] = ["act", 'name', 'claim_number', 'exam_type', 'location', 'date', "status", "data"];
  dataSource: MatTableDataSource<any>;
  filterAll: any;
  roles = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile = false;
  expandedElement: any | null;
  disabled = false;
  filterValue;
  filterAll;
  roles
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Name", "Claim Numbers", "Status"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Name", "Claim Numbers", "Exam Type", "Location", "Date", "Status", "Review Documents"]
        this.columnsToDisplay = ['name', 'claim_number', 'exam_type', 'location', 'date', "status", "data"]
      }
    })
  }

  ngOnInit() {
    let data = [
      { 'name': 'Sanchez, Jorge T ', 'claim_number': '123xyz45', 'exam_type': 'QME', 'location': '23 Big blvd. Riverside, CA 99302', 'date': '03-25-2020', "status": 'Confirmed', "data": '' },
      { 'name': 'Sanchez, Jorge T ', 'claim_number': '123xyz45', 'exam_type': 'QME', 'location': '23 Big blvd. Riverside, CA 99302', 'date': '03-25-2020', "status": 'Not Confirmed', "data": '' },
      { 'name': 'Sanchez, Jorge T ', 'claim_number': '123xyz45', 'exam_type': 'QME', 'location': '23 Big blvd. Riverside, CA 99302', 'date': '03-25-2020', "status": 'Left Voicemail', "data": '' },
      { 'name': 'Sanchez, Jorge T ', 'claim_number': '123xyz45', 'exam_type': 'QME', 'location': '23 Big blvd. Riverside, CA 99302', 'date': '03-25-2020', "status": 'Confirmed', "data": '' },
      { 'name': 'Sanchez, Jorge T ', 'claim_number': '123xyz45', 'exam_type': 'QME', 'location': '23 Big blvd. Riverside, CA 99302', 'date': '03-25-2020', "status": 'Not Confirmed', "data": '' },
      { 'name': 'Sanchez, Jorge T ', 'claim_number': '123xyz45', 'exam_type': 'QME', 'location': '23 Big blvd. Riverside, CA 99302', 'date': '03-25-2020', "status": 'Left Voicemail', "data": '' }
    ]
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filterByRole(a?) {

  }
  expandId: any;
  openElement(element) {
    console.log(element)
    this.router.navigate(['/subscriber/examiner/appointment-details'])
    if (this.isMobile) {
      this.expandId = element.id;
      // element.isExpand = !element.isExpand;
    }
  }
  exportData() {

  }
  click() {
    this.router.navigate(['/subscriber/examiner/appointment-details'])
  }

  exportData(){

  }
  
  filterByRole(value?: string) {

  }
}