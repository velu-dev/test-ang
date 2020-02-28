import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as globals from '../../../globals';
import { User } from './../../../shared/model/user.model';
import { Role } from './../../../shared/model/role.model';
import { UserService } from './../../service/user.service';
import { Router } from '@angular/router';
import { ExportService } from './../../../shared/services/export.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  screenWidth: number;
  xls = globals.xls;
  roles: Role[];
  selectedRole: any = [];
  dataSource: any;
  columnName = ["First Name", "Last Name", "Email", "Role", "Action"]
  columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "action"];
  expandedElement: User | null;
  selectedRoleId = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private userService: UserService,
    private router: Router,
    private exportService: ExportService) {
    this.screenWidth = window.innerWidth;
    this.roles = [];
    this.userService.getRoles().subscribe(response => {
      this.roles = response.data;
      // response.data.map(role => {
        
        // if (!(role.role_name == "Admin")) {
        //   this.roles.push(role)
        //   this.selectedRoleId.push(role.id)
        // }
      // })
      this.getUser(this.selectedRoleId);
      this.roles.map(function (el) {
        var o = Object.assign({}, el);
        o['checked'] = false;
        return o;
      });
      // console.log()
    })
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit() {
  }
  users = [];
  getUser(roles) {
    this.users = [];
    this.userService.getUsers(roles).subscribe(response => {
      response.data.map(user => {
        user['isExpand'] = false;
        this.users.push(user);
      })
      this.dataSource = new MatTableDataSource(this.users)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
    })
  }
  gotoEdit(data) {
    this.router.navigate(["/subscriber/users/" + data.id])

  }
  filterByRole(value?: string) {
    this.selectedRoleId = [];
    this.roles.map(res => {
      if (value) {
        res['checked'] = !res['checked'];
        this.selectedRoleId.push(res.id)
      } else {
        if (res['checked']) {
          this.selectedRoleId.push(res.id);
        }
      }
    })
    this.getUser(this.selectedRoleId)
  }
  navigate() {
    this.router.navigate(['/subscriber/users/new'])
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
  openElement(element) {
    if ((this.screenWidth < 800)) {
      element.isExpand = !element.isExpand;
    }
  }
}
