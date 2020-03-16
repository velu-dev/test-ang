import { Component, OnInit, ViewChild } from '@angular/core';
import * as globals from '../../../../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Role } from 'src/app/shared/model/role.model';
import { User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ExportService } from 'src/app/shared/services/export.service';
import { MatDialog } from '@angular/material/dialog';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
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
      map(result => result.matches),
      shareReplay()
    );

  isMobile = false;
  checked = true;
  allUser: any;
  filterValue: string;
  tabIndex: number = 0;
  disabled = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private exportService: ExportService,
    public dialog: MatDialog,
    private claimService: ClaimService
  ) {
    this.getUser();
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled"]
      } else {
        this.columnName = ["First Name", "Last Name", "Date of Birth", "Claim number", "Examiner", "Gender", "Action"]
        this.columnsToDisplay = ['first_name', 'last_name', 'date_of_birth', 'claim_number', "examiner", "gender", "disabled"]
      }
    })
    this.screenWidth = window.innerWidth;
    this.roles = [];

    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit() {
  }
  users = [];
  getUser() {
    this.claimService.getClaimant().subscribe(res => {
      this.users = res.data;
      this.tabchange(0);
    })
  }
  gotoEdit(data) {
    this.router.navigate(["/admin/users/" + data.id])
  }

  tabchange(event) {
    console.log(event)
    this.filterValue = '';
    this.tabIndex = event;
    // let tabName;
    // if (event == 0) {
    //   tabName = 'activeUsers'
    // } else if (event == 1) {
    //   tabName = 'invitedUsers'
    // } else if (event == 2) {
    //   tabName = 'disabledUsers'
    // }
    // this.allUser[tabName].map(user => {
    //   user['isExpand'] = false;
    //   this.users.push(user);
    // })
    console.log(this.users)
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  navigate() {
    if (this.tabIndex == 0) {
      this.router.navigate(['/subscriber/claims/new-claimant'])
    } else if (this.tabIndex == 1) {
      alert("In Progress");
    } else if (this.tabIndex == 2) {
      alert("In Progress");
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
