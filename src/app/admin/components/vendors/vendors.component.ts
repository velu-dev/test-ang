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
import { Role } from '../../models/role.model';
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VendorsComponent implements OnInit {
  screenWidth: number;
  xls = globals.xls;
  roles: Role[];
  selectedRole: any = [];
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
    this.screenWidth = window.innerWidth;
    this.title.setTitle("APP | Manage User");
    this.roles = [];
    this.userService.getVendorRole().subscribe(response => {
      response.data.map(role => {
        if (!(role.role_name == "Admin")) {
          this.roles.push(role)
          this.selectedRoleId.push(role.id)
        }
      })
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
    this.userService.getUsers([5,7,9]).subscribe(response => {
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
    this.router.navigate(["/admin/users/" + data.id])

  }
  selectedRoleId = []
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
    this.router.navigate(['/admin/vendor/new'])
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
