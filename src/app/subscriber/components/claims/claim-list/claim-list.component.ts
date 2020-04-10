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
  bodyPartsList = [];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private exportService: ExportService,
    public dialog: MatDialog,
    private claimService: ClaimService
  ) {
    this.claimService.seedData("body_part").subscribe(res => {
      this.bodyPartsList = res.data;
    });
    this.getclaims();
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "First Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'first_name', "disabled"]
      } else {
        this.columnName = ["Last Name", "First Name", "Date of Birth", "Date of Injury", "Injury", "Claim number", "Examiner", "Action"]
        this.columnsToDisplay = ['last_name', 'first_name', 'date_of_birth', 'date_of_injury', 'claim_injuries', 'claim_number', "examiner", "disabled"]
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
  claimList(claim) {
    let bodyParts = [];
    claim.map(res => {
      res.body_part_id.map(id => {
        let body_part = this.bodyPartsList.find(element => element.id == id);
        bodyParts.push(body_part ? body_part.body_part_name : "");
      })
    })
    return bodyParts;
  }
  claims = [];
  getclaims() {
    this.claimService.getClaims().subscribe(res => {
      this.claims = res.data;
      this.dataSource = new MatTableDataSource(this.claims)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  gotoEdit(data) {
    this.router.navigate(["/admin/users/" + data.id])
  }

  navigate() {
    this.router.navigate(['/subscriber/claims/new-claim']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportData() {
    let data = [];
    this.claims.map(res => {
      data.push({
        "First Name": res.first_name,
        "Last Name": res.last_name,
        "Claim Number": res.claim_number,
        "Date of Birth": res.date_of_birth
      })
    })
    this.exportService.exportExcel(data, "Claim-List")
  }
  expandId: any;
  openElement(element) {
    this.router.navigate(['/subscriber/claims/', element.id])
    if (this.isMobile) {
      this.expandId = element.claim_id;
    }
  }
  editClaim(element) {
    console.log(element)
    this.router.navigate(['/subscriber/claims/', element.claim_id])
  }
}
