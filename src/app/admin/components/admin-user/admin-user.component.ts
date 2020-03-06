import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
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
    private title: Title,
    private breakpointObserver: BreakpointObserver,
    private exportService: ExportService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name", "Disabled" ]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled" ]
      } else {
        this.columnName = ["First Name", "Last Name", "Email", "Role", "Disabled"]
        this.columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name', "disabled"]
      }
    })
    this.isLoading = true;
    this.title.setTitle("APP | Manage Admin");
    this.getUser([1]);
  }
  ngOnInit() {
  }
  getUser(roles) {
    this.userService.getUsers(roles).subscribe(response => {
      this.allUser = response;
      this.tabchange(0);
    }, error => {
    })
  }

  tabchange(event) {
    this.filterValue = '';
    this.dataSource = [];
    this.admin = [];
    let tabName;
    if (event == 0) {
      tabName = 'activeUsers'
    } else if (event == 1) {
      tabName = 'invitedUsers'
    } else if (event == 2) {
      tabName = 'disabledUsers'
    }
    this.admin = this.allUser[tabName];
    this.dataSource = new MatTableDataSource(this.allUser[tabName])
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportData() {
    let data = [];
    this.admin.map(res => {
      data.push({
        "First Name": res.first_name,
        "Last Name": res.last_name,
        "Email ID": res.sign_in_email_id,
        "Role ID": res.role_name
      })
    })
    this.exportService.exportExcel(data, "Admin-Users")
  }
  onDisable(data, user) {
    if (data.checked) {
      this.openDialog('enable', user);
    } else {
      this.openDialog('disable', user);
    }
  }
  gotoDelete(data) {
    // this.router.navigate(["/admin/admin-users/" + data.id])
    this.openDialog('delete', data);
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
  navigate(eve) {
    // this.router.navigate(['new'])
    console.log(eve)
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
      // element.isExpand = !element.isExpand;
    }
  }
}
