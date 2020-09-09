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
import * as moment from 'moment';
import { MatMenuTrigger } from '@angular/material';
import { BreadcrumbService } from 'xng-breadcrumb';
@Component({
  selector: 'app-claimant',
  templateUrl: './claimant.component.html',
  styleUrls: ['./claimant.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ClaimantComponent implements OnInit {
  screenWidth: number;
  xls = globals.xls;
  roles: Role[];
  selectedRole: any = [];
  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  expandedElement: User | null;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private exportService: ExportService,
    public dialog: MatDialog,
    private claimService: ClaimService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.getUser();
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["Claimant Name", "Examiner", "Date of Birth", "Date of Injury", "Claim Number"]
        this.columnsToDisplay = ['claimant_name', 'examiner', 'date_of_birth', "date_of_injury", "claim_number"]
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
      res.data.map(claim => {
        claim.date_of_birth = claim.date_of_birth ? moment(claim.date_of_birth).format("MM-DD-YYYY") : '';
        claim.date_of_injury = claim.date_of_injury ? moment(claim.date_of_injury).format("MM-DD-YYYY") : '';
        claim.examiner = claim.ex_last_name + ' ' + claim.ex_first_name + '' + (claim.ex_suffix ? ', ' + claim.ex_suffix : '');
        claim.claimant_name = claim.last_name + ', ' + claim.first_name;
      })
      this.users = res.data;
      this.dataSource = new MatTableDataSource(this.users)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.claimant_name.toLowerCase().includes(filter) || (data.date_of_birth && data.date_of_birth.includes(filter)) || (data.date_of_injury && data.date_of_injury.includes(filter)) || (data.examiner && data.examiner.toLowerCase().includes(filter)) || (data.claim_number && data.claim_number.includes(filter));
      };
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    })
  }
  gotoEdit(e) {
    this.router.navigate(["subscriber/claimant/edit-claimant", e.id])
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
        "Date of Birth": res.date_of_birth,
        "Gender": res.gender
      })
    })
    this.exportService.exportExcel(data, "Claimant")
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element;
    }
  }
  openClaimant() {
    this.router.navigate(['subscriber/claims/new-claim'])
  }

}
