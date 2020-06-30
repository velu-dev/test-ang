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
import * as moment from 'moment';
@Component({
  selector: 'app-billable-item',
  templateUrl: './billable-item.component.html',
  styleUrls: ['./billable-item.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
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
  expandId: any = 0;
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
  users = [];
  disabled = false;
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
        this.columnsToDisplay = ['is_expand', 'first_name', "action"]
      } else {
        this.columnName = ["Last Name", "First Name", "Date of Birth", "Date of Service", "Exam Type", "Claim Number", "Examiner", "Status", "Action"]
        this.columnsToDisplay = ['last_name', 'first_name', 'date_of_birth', 'date_of_service', "exam_type_code", "claim_number", "examiner_name", "status", "action"]
      }
    })
    this.screenWidth = window.innerWidth;
    this.roles = [];

    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
  }

  ngOnInit() {

    this.claimService.getBillableItemList().subscribe(res => {
      res['data'].map(bill=>{
        bill.date_of_birth = moment(bill.date_of_birth).format("MM-DD-YYYY");
        bill.date_of_service = bill.date_of_service ?  moment(bill.date_of_service).format("MM-DD-YYYY") : '';
       })
      this.dataSource = new MatTableDataSource(res['data'])
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.last_name.toLowerCase().includes(filter) || data.first_name.toLowerCase().includes(filter) || (data.date_of_birth && data.date_of_birth.includes(filter)) || (data.date_of_service && data.date_of_service.includes(filter)) ||  (data.claim_number && data.claim_number.includes(filter)) || (data.examiner_name && data.examiner_name.toLowerCase().includes(filter)) || (data.exam_type_code && data.exam_type_code.toLowerCase().includes(filter));
      };
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.claim_id;
      // element.isExpand = !element.isExpand;
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
        "Date Of Birth": res.date_of_birth,
        "Date of Service": res.date_of_service
      })
    })
    this.exportService.exportExcel(data, "BIllable Items")
  }

  navigate(element) {
    this.router.navigate(['/subscriber/appointment/appointment-details', element.claim_id, element.id])
  }

  navigateBillableEdit(e) {
    this.router.navigate(['/subscriber/billable-item/edit-billable-item', e.claim_id, e.claimant_id, e.id])
  }
}
