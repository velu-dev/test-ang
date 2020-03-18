import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { map, shareReplay } from 'rxjs/operators';
import * as globals from '../../../../globals';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/shared/services/export.service';
import { MatDialog } from '@angular/material/dialog';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { Role } from 'src/app/shared/model/role.model';
import { User } from 'src/app/shared/model/user.model';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-billable-item',
  templateUrl: './billable-item.component.html',
  styleUrls: ['./billable-item.component.scss']
})
export class BillableItemComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  screenWidth: number;
  roles: Role[];
  xls = globals.xls;
  selectedRole: any = [];
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  expandedElement: User | null;
  isMobile = false;
  checked = true;
  allUser: any;
  filterValue: string;
  users = []
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private exportService: ExportService,
    public dialog: MatDialog,
    private claimService: ClaimService
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled"]
      } else {
        this.columnName = ["Last Name","First Name",  "Date of Birth", "Date of Service", "Exam Type", "Claim Numbers", "Examiner", "Status", "Action"]
        this.columnsToDisplay = ['last_name', 'first_name', 'date_of_birth', 'date_of_service', "exam_type", "claim_numbers", "examiner", "status", "action"]
      }
    })
    this.screenWidth = window.innerWidth;
    this.roles = [];

    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.users)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  exportData() {
    let data = [];
    this.users.map(res => {
      data.push({
        "First Name": res.first_name,
        "Last Name": res.last_name,
        "Date Of Birth": res.date_of_birth,
        "Date of Service": res.date_of_service
      })
    })
    this.exportService.exportExcel(data, "BIllable Items")
  }
}
