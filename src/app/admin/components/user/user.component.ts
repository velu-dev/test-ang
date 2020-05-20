import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ExportService } from './../../../shared/services/export.service';
import * as globals from '../../../globals';
import { Role } from '../../models/role.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import * as moment from 'moment';

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
      map(result => result.matches),
      shareReplay()
    );
  isMobile: boolean = false;
  checked = true;
  allUser: any;
  filterValue: string;
  tabIndex: number = 0;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private router: Router,
    private exportService: ExportService,
    public dialog: MatDialog
  ) {

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Last Name", "Disable User"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Last Name", "First Name", "Email", "Role", "Company","Account Number", "Subscribed On", "Disable User"]
        this.columnsToDisplay = ['last_name', 'first_name', 'sign_in_email_id', 'role_name', "organization_name", "account_no", 'createdAt', "disabled"]
      }
    })
    this.screenWidth = window.innerWidth;
    this.roles = [];
    this.userService.getSubscriberRole().subscribe(response => {
      response.data.map(role => {
        // if (!(role.role_name == "Admin")) {
        this.roles.push(role)
        this.selectedRoleId.push(role.id)
        // }
      })
      this.getUser();
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
  getUser() {
    this.users = [];
    this.userService.getSubscribers().subscribe(response => {
      this.allUser = response;
      this.tabchange(this.tabIndex);
    }, error => {
    })
  }
  gotoEdit(data) {
    this.router.navigate(["/admin/users/" + data.id])

  }
  gotoDelete(data) {
    // this.router.navigate(["/admin/admin-users/" + data.id])
    this.openDialog('delete', data);
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
      this.columnName[this.columnName.length - 1] = "Disable User"
      tabName = 'activeUsers'
    } else if (event == 1) {
      this.columnName[this.columnName.length - 1] = "Cancel Invite"
      tabName = 'invitedUsers'
    } else if (event == 2) {
      this.columnName[this.columnName.length - 1] = "Enable User"
      tabName = 'disabledUsers'
    }
    this.allUser[tabName].map(user => {
      user['isExpand'] = false;
      this.users.push(user);
    })
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) =>(typeof(data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
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
    if(this.users.length > 0){
    this.users.map(res => {
      data.push({
        "Last Name": res.last_name,
        "First Name": res.first_name,
        "Email": res.sign_in_email_id,
        "Role": res.role_name,
        "Company": res.organization_name,
        "Account Number": res.account_no,
        "Enrolled On": moment(res.createdAt).format("MM-DD-YYYY")
      })
    })
    this.exportService.exportExcel(data, "Subscriber-Users" + moment().format('MM-DD-YYYYhh:mm'))
    }
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
  onDisable(data, id) {
    if (this.tabIndex == 2) {
      this.openDialog('enable', id);
    } else {
      this.openDialog('disable', id);
    }
  }

  openDialog(dialogue, user) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.userService.disableUser(user.id, !user.status).subscribe(res => {
          this.getUser();
        })
      } else {

      }
    });
  }

}
