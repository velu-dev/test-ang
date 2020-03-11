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
  filterAll = false;
  selectedFile: File = null;
  allUser: any;
  filterValue: string;
  tabIndex: number = 0;
  @ViewChild('uploader', { static: true }) fileUpload: ElementRef;
  constructor(
    private userService: SubscriberUserService,
    private router: Router,
    private exportService: ExportService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private alertService: AlertService,
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name", "Disable User"]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled"]
      } else {
        this.expandId = "";
        this.columnName = ["First Name", "Last Name", "Email", "Role", "Disable User"]
        this.columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "disabled"]
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
      this.getUser(this.selectedRoleId, this.tabName);
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
  tabName: string;
  tabchange(event) {
    this.filterValue = '';
    this.selectedRoleId = [];
    this.dataSource = [];
    this.users = [];
    this.tabName = ''
    this.tabIndex = event;
    this.columnName[this.columnName.indexOf("Enable User")] = "Disable User";
    if (event == 0) {
      this.tabName = 'activeUsers'
    } else if (event == 1) {
      this.tabName = 'invitedUsers'
    } else if (event == 2) {
      this.columnName[this.columnName.indexOf("Disable User")] = "Enable User";
      this.tabName = 'disabledUsers'
    }
    this.users = this.allUser[this.tabName];
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectedRoleId = []
  filterByRole(value?: string) {
    this.selectedRoleId = [];
    this.roles.map(res => {
      if (value) {
        this.filterAll ? res['checked'] = true : res['checked'] = false
        this.selectedRoleId.push(res.id)
      } else {
        this.filterAll = false;
        if (res['checked']) {
          this.selectedRoleId.push(res.id);
        }
      }
    })
    this.getUser(this.selectedRoleId, this.tabName)
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
          this.getUser(this.selectedRoleId, this.tabName);
        })
      } 
    });
  }

}
