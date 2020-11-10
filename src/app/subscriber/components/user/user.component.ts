import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as globals from '../../../globals';
import { User } from './../../../shared/model/user.model';
import { Role } from './../../../shared/model/role.model';
import { SubscriberUserService } from '../../service/subscriber-user.service';
import { Router } from '@angular/router';
import { ExportService } from './../../../shared/services/export.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import * as moment from 'moment';
import { CookieService } from 'src/app/shared/services/cookie.service';
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
  columnName = [];
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
  filterAll = true;
  selectedFile: File = null;
  allUser: any;
  filterValue: string;
  tabIndex: number = 0;
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  user: any = {};
  constructor(
    private userService: SubscriberUserService,
    private router: Router,
    private exportService: ExportService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private alertService: AlertService,
    private cookieService: CookieService,
  ) {
    this.user = JSON.parse(this.cookieService.get('user'));
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Last Name", "Disable User"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Last Name", "First Name", "Email", "Role(s)", "Enrolled On", "Disable User"]
        this.columnsToDisplay = ['last_name', 'first_name', 'sign_in_email_id', 'role_name', 'createdAt', "disabled"]
      }
    });
    this.screenWidth = window.innerWidth;
    this.roles = [];
    this.userService.getRoles().subscribe(response => {
      response.data.map(role => {
        if (!(role.role_name == "Admin")) {
          this.roles.push(role)
          this.selectedRoleId.push(role.id)
        }
      })
      this.tabName = 'activeUsers'
      //this.getUser(this.selectedRoleId, this.tabName);
      this.filterByRole('all')
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
  getUser(roles, status) {
    this.users = [];
    this.allUser = [];
    if (this.user.role_id == 3) {
      this.userService.getManageUsers(roles, status).subscribe(response => {
        this.allUser = response;

        if (status == 'invitedUsers') {
          this.tabchange(1)
        } else if (status == 'disabledUsers') {
          this.tabchange(2)
        } else {
          this.tabchange(0)
        }

      }, error => {
      })
    } else {
      this.userService.getUsers(roles, status).subscribe(response => {
        this.allUser = response;

        if (status == 'invitedUsers') {
          this.tabchange(1)
        } else if (status == 'disabledUsers') {
          this.tabchange(2)
        } else {
          this.tabchange(0)
        }

      }, error => {
      })
    }
  }
  tabName: string;
  tabchange(event) {
    this.filterValue = '';
    this.selectedRoleId = [];
    this.dataSource = [];
    this.users = [];
    this.tabName = ''
    this.tabIndex = event;
    if (event == 0) {
      this.columnName[this.columnName.length - 1] = "Disable User"
      this.tabName = 'activeUsers'
    } else if (event == 1) {
      this.columnName[this.columnName.length - 1] = "Uninvite User"
      this.tabName = 'invitedUsers'
    } else if (event == 2) {
      this.columnName[this.columnName.length - 1] = "Enable User"
      this.tabName = 'disabledUsers'
    }
    this.users = this.allUser[this.tabName];
    this.users.map(user => {
      user.enroll = moment(user.createdAt).format("MM-DD-YYYY")
      user.subscriber = user.issubscriber ? 'subscriber' : '';
    })
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.last_name.toLowerCase().includes(filter) || (data.first_name && data.first_name.toLowerCase().includes(filter)) || (data.sign_in_email_id && data.sign_in_email_id.toLowerCase().includes(filter)) || (data.role_name && data.role_name.toLowerCase().includes(filter)) || (data.enroll && data.enroll.includes(filter)) || (data.subscriber && data.subscriber.toLowerCase().includes(filter));
    };
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
  }

  selectedRoleId = []
  filterStatus: boolean;
  filterByRole(value?: string) {
    this.selectedRoleId = [];
    this.roles.map((res, index) => {
      if (value) {
        this.filterAll ? res['checked'] = true : res['checked'] = false
        if (!this.filterAll) {
          if (index == 0) {
            res['checked'] = true
            this.selectedRoleId.push(res.id)
          }
        } else {
          this.selectedRoleId.push(res.id)
        }
      } else {
        this.filterAll = false;
        if (res['checked']) {
          this.selectedRoleId.push(res.id);
        }
      }
    })
    if (this.selectedRoleId.length == 0) {
      this.users = [];
      this.allUser = [];
      this.dataSource = new MatTableDataSource()
    } else {
      this.getUser(this.selectedRoleId, this.tabName)
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportData() {
    let data = [];
    if (this.users.length > 0) {
      this.users.map(res => {
        data.push({
          "First Name": res.first_name,
          "Last Name": res.last_name,
          "Email": res.sign_in_email_id,
          "Role": res.role_name,
          "Enrolled On": moment(res.createdAt).format("MM-DD-YYYY")
        })
      })
      this.exportService.exportExcel(data, "subscriber-users" + moment().format('MM-DD-YYYYhh:mm'))
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

  unInvite(e) {
    this.openDialogInvite('uninvite', e);

  }
  openDialog(dialogue, user) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, title: user.last_name + " " + user.first_name + " " + user.last_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        if (this.user.role_id == 3) {

          this.userService.disableManageUser(user.id, !user.status).subscribe(res => {
            this.getUser(this.selectedRoleId, this.tabName);
          })
        } else {
          this.userService.disableUser(user.id, !user.status).subscribe(res => {
            this.getUser(this.selectedRoleId, this.tabName);
          })
        }
      }
    });
  }

  openDialogInvite(dialogue, user) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue, title: user.last_name + " " + user.first_name + " " + user.last_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        this.userService.postUninvite(user.id).subscribe(resUninvite => {
          console.log(resUninvite);
          this.getUser(this.selectedRoleId, this.tabName)
        })
      }
    });
  }

  editUser(user) {
    console.log(user);
    if (user.role_id == 11) {
      // this.router.navigate(['subscriber/users/examiner', user.id])
      this.router.navigateByUrl(this.router.url + '/examiner/' + user.id)
    } else {
      //this.router.navigate(['subscriber/users/edit', user.id])
      this.router.navigateByUrl(this.router.url + '/edit/' + user.id)
    }
  }

}
