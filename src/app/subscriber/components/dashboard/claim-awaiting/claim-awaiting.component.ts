import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SubscriberService } from 'src/app/subscriber/service/subscriber.service';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-claim-awaiting',
  templateUrl: './claim-awaiting.component.html',
  styleUrls: ['./claim-awaiting.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClaimAwaitingComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource: any;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  constructor(private breakpointObserver: BreakpointObserver,
    private subscriberService: SubscriberService,
    private router: Router,
    public dialog: MatDialog) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant"]
        this.columnsToDisplay = ['is_expand', 'claimant_name']
      } else {
        this.columnName = ["Claimant", "Claim Number", "Examiner", "Exam Type", "Date Created"]
        this.columnsToDisplay = ['claimant_name', 'claim_number', "examiner", "exam_type", "created_date"]
      }
    })
  }

  ngOnInit() {
    this.subscriberService.getClaimAwait().subscribe(claims => {
      claims.data.map(claim => {
        claim.date_of_birth = claim.date_of_birth ? moment(claim.date_of_birth).format("MM-DD-YYYY") : '';
        claim.claimant_name = claim.claimant_last_name + ', ' + claim.claimant_first_name;
        claim.created_date = claim.createdAt ? moment(claim.createdAt).format("MM-DD-YYYY") : '';
        claim.created_time = claim.createdAt ? moment(claim.createdAt).format("hh:mm a") : '';
        claim.examiner = claim.ex_last_name + ' ' + claim.ex_first_name + '' + (claim.ex_suffix ? ', ' + claim.ex_suffix : '');
      })
      this.dataSource = new MatTableDataSource(claims.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.claimant_name.toLowerCase().includes(filter) || (data.examiner && data.examiner.toLowerCase().includes(filter)) || (data.claim_number && data.claim_number.includes(filter)) || (data.created_date && data.created_date.includes(filter)) || (data.created_time && data.created_time.toLowerCase().includes(filter)) || (data.date_of_birth && data.date_of_birth.includes(filter)) || (data.exam_type_code && data.exam_type_code.toLowerCase().includes(filter));
      };
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile)
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  claimNavigate(element) {
    this.router.navigate([this.router.url + '/edit-claim', element.id])
  }

}
