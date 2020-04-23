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
import { ExaminerService } from '../../service/examiner.service';

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
  left_voicemail = globals.left_voicemail
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
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private examinerService: ExaminerService
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Name", "Claim Numbers", "Status"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["","Name", "Claim Numbers", "Exam Type", "Location", "Date", "Status", "Review Documents"]
        this.columnsToDisplay = ['image','claimant_name', 'claim_number', 'exam_type', 'location', 'appointment_scheduled_date_time', "status", "data"]
      }
    })
  }

  ngOnInit() {
    
    this.examinerService.getExaminationDetails().subscribe(res => {
      console.log(res)
      this.dataSource = new MatTableDataSource(res['data'])
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    }, error => {
      console.log(error)
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
  click() {
    this.router.navigate(['/subscriber/examiner/appointment-details'])
  }

  exportData() {

  }

  filterByRole(value?: string) {

  }
}