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
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
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
        this.columnName = ["", "First Name","Disable", "Action"]
        this.columnsToDisplay = ['is_expand', 'first_name',"disabled", "action"]
      } else {
        this.columnName = ["First Name", "Last Name", "Email", "Role","Disabled", "Action"]
        this.columnsToDisplay = ['first_name', 'last_name', 'sign_in_email_id', 'role_name',"disabled", "action"]
      }
    })
    this.screenWidth = window.innerWidth;
    this.title.setTitle("APP | Manage User");
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
  openElement(element) {
    if (this.isMobile) {
      element.isExpand = !element.isExpand;
    }
  }
  onDisable(data, id) {
    if (data.checked) {
      this.openDialog('enable', id);
    } else {
      this.openDialog('disable', id);
    }
  }
  openDialog(dialogue, data) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      width: '350px',
      data: { name: dialogue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['data']) {
        alert("Deleted")
      } else {
        alert("Cancled")
      }
    });
  }
}
