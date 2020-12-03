import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/shared/services/export.service';
import * as globals from '../../../globals';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/app/shared/components/dialogue/dialogue.component';
import { User } from 'src/app/shared/model/user.model';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AdminUserComponent implements OnInit {
  xls = globals.xls
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  admin = [];
  isLoading = false;
  isMobile = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  checked = true;
  expandedElement: User | null;
  color = "primary";
  disabled = false;
  allUser: any;
  filterValue: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private exportService: ExportService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Last Name", "Disable User"]
        this.columnsToDisplay = ['is_expand', 'last_name', "disabled"]
      } else {
        this.columnName = ["Last Name", "First Name", "Email", "Role", "Enrolled On", "Disable User"]
        this.columnsToDisplay = ['last_name', 'first_name', 'sign_in_email_id', 'role_name', 'createdAt', "disabled"]
      }
    })
    this.isLoading = true;
    this.getUser([1]);
  }
  ngOnInit() {

  }
  getUser(roles) {
    this.userService.getUsers(roles).subscribe(response => {
      this.allUser = response;
      this.tabchange(this.tabIndex);
    }, error => {
    })
  }
  tabIndex: number = 0;
  tabchange(event) {
    this.filterValue = '';
    this.dataSource = [];
    this.admin = [];
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
    this.admin = this.allUser[tabName];
    this.dataSource = new MatTableDataSource(this.allUser[tabName])
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportData() {
    let data = [];
    if (this.admin.length > 0) {
      this.admin.map(res => {
        console.log(moment(res.createdAt).format("MM-DD-YYYY"));
        data.push({
          "Last Name": res.last_name,
          "First Name": res.first_name,
          "Email": res.sign_in_email_id,
          "Role": res.role_name,
          "Enrolled On": moment(res.createdAt).format("MM-DD-YYYY")
        })
      })
      this.exportService.exportExcel(data, "Admin-Users" + moment().format('MM-DD-YYYYhh:mm'))
    }
  }
  onDisable(data, user) {
    if (this.tabIndex == 2) {
      this.openDialog('enable', user);
    } else {
      this.openDialog('disable', user);
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
          this.getUser([1]);
        })
      } else {

      }
    });
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
    }
  }
}
