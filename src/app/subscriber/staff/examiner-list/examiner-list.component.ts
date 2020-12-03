import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { Router } from '@angular/router';
import * as globals from '../../../globals';
import { ExaminerService } from '../../service/examiner.service';
@Component({
  selector: 'app-examiner-list',
  templateUrl: './examiner-list.component.html',
  styleUrls: ['./examiner-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ExaminerListComponent implements OnInit {
  xls = globals.xls;
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  isMobile = false;
  disabled = false;
  expandedElement: any | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tabIndex;
  applyFilter;
  filterValue;
  examinerList: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private examinerService: ExaminerService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Last Name", "Disable User"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Last Name", "First Name", "Email", "Action"]
        this.columnsToDisplay = ['last_name', 'first_name', 'email', 'action']
      }
    })

  }

  ngOnInit() {
    this.examinerService.getExaminerList().subscribe(response => {
      this.dataSource = new MatTableDataSource(response['data']);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    }, error => {

    })

  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
    }
  }

  onDisable(data, user) {
    this.router.navigate(['/subscriber/location/new-location', user.id])
  }

}
