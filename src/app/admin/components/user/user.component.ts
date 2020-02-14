import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class UserComponent implements OnInit {
  roles = ["Admin", "Subscriber", "Vendor"]
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnName = ["First Name", "Last Name", "Email", "Role"]
  columnsToDisplay = ['first_name', 'last_name', 'email', 'role'];
  expandedElement: PeriodicElement | null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
export interface PeriodicElement {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    first_name: "james",
    last_name: "Taylor",
    email: "jt@gmail.com",
    role: "Historian"
  }, {
    first_name: "iiek",
    last_name: "Stortenbecker",
    email: "ns@gmail.com",
    role: "Historian Staff"
  }, {
    first_name: "iatrick",
    last_name: "Curry",
    email: "pc@company.com",
    role: "Summarizer"
  }, {
    first_name: "Brock",
    last_name: "Curry",
    email: "brock@company.com",
    role: "Summarizer Staff"
  }, {
    first_name: "James",
    last_name: "Taylor",
    email: "jt@gmail.com",
    role: "Historian"
  }, {
    first_name: "iiek",
    last_name: "Stortenbecker",
    email: "ns@gmail.com",
    role: "Historian Staff"
  }, {
    first_name: "Patrick",
    last_name: "Curry",
    email: "pc@company.com",
    role: "Summarizer"
  }, {
    first_name: "Brock",
    last_name: "Curry",
    email: "brock@company.com",
    role: "Summarizer Staff"
  }, {
    first_name: "Patrick",
    last_name: "Curry",
    email: "pc@company.com",
    role: "Summarizer"
  }, {
    first_name: "irock",
    last_name: "Curry",
    email: "brock@company.com",
    role: "Summarizer Staff"
  },
];