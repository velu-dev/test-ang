import { Component, OnInit, ViewChild } from '@angular/core';
import * as globals from '../../../../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { Role } from 'src/app/shared/model/role.model';
import { User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ExportService } from 'src/app/shared/services/export.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.scss']
})
export class ClaimListComponent implements OnInit {
  screenWidth: number;
  xls = globals.xls;
  roles: Role[];
  selectedRole: any = [];
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  expandedElement: User | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches ),
      shareReplay()
    );
  isMobile: boolean = false;
  checked = true;
  allUser: any;
  filterValue : string;
  tabIndex: number = 0;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private router: Router,
    private title: Title,
    private exportService: ExportService,
    public dialog: MatDialog
  ) {

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name","Action"]
        this.columnsToDisplay = ['is_expand', 'first_name',"edit"]
      } else {
        this.columnName = ["First Name", "Last Name", "Date of Birth", "Claim number","Examiner","Gender","Action"]
        this.columnsToDisplay = ['first_name', 'last_name', 'date_of_birth', 'claim_number',"examiner","gender","edit"]
      }
    })
    this.screenWidth = window.innerWidth;
    this.title.setTitle("APP | Manage User");
    this.roles = [];

    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit() {
  }
  users = [];
  getUser() {
    this.users = [];
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
    this.getUser()
  }

  tabchange(event) {
    this.filterValue = '';
    this.dataSource = [];
    this.users = [];
    this.tabIndex = event;
    let tabName;
    if (event == 0) {
      tabName = 'activeUsers'
    } else if (event == 1) {
      tabName = 'invitedUsers'
    } else if (event == 2) {
      tabName = 'disabledUsers'
    }
    this.allUser[tabName].map(user => {
      user['isExpand'] = false;
      this.users.push(user);
    })
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
 
}
