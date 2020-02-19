import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {
  dataSource: any;
  columnName = ["First Name", "Last Name", "Email", "Role", "Action"]
  columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "action"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private userService: UserService, private router: Router, private title: Title) {
    this.title.setTitle("APP | Manage Admin");
    this.getUser([1]);
  }
  ngOnInit() {
  }
  getUser(roles) {
    console.log(roles)
    this.userService.getUsers(roles).subscribe(response => {
      this.dataSource = new MatTableDataSource(response.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.log(error)
    })
  }

}
