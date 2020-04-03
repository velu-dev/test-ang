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
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
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
  constructor(private breakpointObserver: BreakpointObserver,private router:Router) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Name", "Claim Numbers","Status"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Name", "Claim Numbers", "Exam Type", "Location", "Date", "Status","Review Documents"]
        this.columnsToDisplay = ['name', 'claim_number', 'exam_type', 'location', 'date', "status","data"]
      }
    })
  }

  ngOnInit() {
    let data = [{'name':'sarath', 'claim_number':'123446', 'exam_type':'QME', 'location':'US', 'date':'03-23-2019', "status":'Pending',"data":''}]
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) =>(typeof(data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  expandId: any;
  openElement(element) {
    this.router.navigate(['/subscriber/examiner/appointment-details'])
    if (this.isMobile) {
      this.expandId = element.id;
      // element.isExpand = !element.isExpand;
    }
  }


}