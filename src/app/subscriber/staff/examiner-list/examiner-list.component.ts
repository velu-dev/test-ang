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
  data = [
    { id: 1, first_name: 'Sarath.s', last_name: 'sarath', sign_in_email_id: 'sarath.s@auriss.com' },
    { id: 1, first_name: 'Venkatesan', last_name: 'Mariyappan', sign_in_email_id: 'venkatesan.m@auriss.com' },
    { id: 1, first_name: 'Rajan', last_name: 'M', sign_in_email_id: 'rajan.s@auriss.com' },
  ];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  isMobile = false;
  disabled = false;
  expandedElement: any | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver,private router: Router, ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Last Name", "Disable User"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Last Name", "First Name", "Email", "Action"]
        this.columnsToDisplay = ['last_name', 'first_name', 'sign_in_email_id', 'action']
      }
    })
    this.dataSource = new MatTableDataSource(this.data);

  }

  ngOnInit() {
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
      // element.isExpand = !element.isExpand;
    }
  }

  onDisable(data, user) {
    this.router.navigate(['/subscriber/staff/manage-address'])
  }

}
