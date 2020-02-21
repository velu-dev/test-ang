import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ExportService } from './../../../shared/services/export.service';
import * as globals from '../../../globals';
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
  xls = globals.xls;
  roles = []
  selectedRole: any;
  dataSource: any;
  columnName = ["First Name", "Last Name", "Email", "Role", "Action"]
  columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "action"];
  expandedElement: User | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private userService: UserService,
    private router: Router,
    private title: Title,
    private exportService: ExportService
  ) {
    this.title.setTitle("APP | Manage User");
    this.userService.getRoles().subscribe(response => {
      this.roles = response.data.map(function (el) {
        var o = Object.assign({}, el);
        o.checked = false;
        return o;
      });
    })
    this.getUser(this.roles);
  }

  ngOnInit() {
  }
  users = [];
  getUser(roles) {
    this.userService.getUsers(roles).subscribe(response => {
      let data = []
      this.users = response.data;
      this.dataSource = new MatTableDataSource(this.users)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
    })
  }
  gotoEdit(data) {
    this.router.navigate(["/admin/users/" + data.id])

  }
  selectedRoleId = []
  filterByRole() {
    this.selectedRoleId = [];
    this.roles.map(res => {
      if (res.checked) {
        this.selectedRoleId.push(res.id);
      }
    })
    this.getUser(this.selectedRoleId)
  }
  navigate() {
    this.router.navigate(['/admin/users/new'])
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportData() {
    let data = [];
    this.users.map(res => {
      data.push({
        "First Name": res.first_name,
        "Last Name": res.last_name,
        "Email ID": res.sign_in_email_id,
        "Role ID": res.role_name
      })
    })
    this.exportService.exportExcel(data, "Non-Admin-Users")
  }
}
