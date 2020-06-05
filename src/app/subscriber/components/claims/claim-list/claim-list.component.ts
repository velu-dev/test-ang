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
import { NGXLogger } from 'ngx-logger';
import * as moment from 'moment';
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
    private claimService: ClaimService,
    private logger: NGXLogger
  ) {
    this.logger.debug('Your log message goes here');
    this.logger.debug('Multiple', 'Argument', 'support');
    this.logger.error('Error message');
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
        this.columnName = ["Last Name", "First Name", "Date of Injury", "Claim number", "WCAB number", "Examiner", "Action"]
        this.columnsToDisplay = ['last_name', 'first_name', 'date_of_injury', 'claim_number', "wcab_number", "examiner_name", "disabled"]
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
      res.data.map(claim=>{
        if(claim.claim_injuries != null &&  claim.claim_injuries[0] && claim.claim_injuries[0].date_of_injury) { 
        claim.date_of_injury = moment(claim.claim_injuries[0].date_of_injury).format("MM-DD-YYYY")
        claim.claim_injuries[0].date_of_injury = moment(claim.claim_injuries[0].date_of_injury).format("MM-DD-YYYY");
        }else{
          claim.date_of_injury = null;
        } 
      })
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
        "WCAB number": res.wcab_number
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
    localStorage.setItem("isName", "true");
    localStorage.setItem("exam_type", element.exam_type_name);
    localStorage.setItem("name", element.first_name + " " + element.last_name)
    localStorage.setItem("claim_number", element.claim_number)
    this.router.navigate(['/subscriber/edit-claim', element.claim_id])
  }
}
