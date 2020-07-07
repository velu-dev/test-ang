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
  selector: 'app-billable-item-awaiting',
  templateUrl: './billable-item-awaiting.component.html',
  styleUrls: ['./billable-item-awaiting.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillableItemAwaitingComponent implements OnInit {
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
        this.columnName = ["", "Claimant", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["Claimant", "Claim Number", "Examiner", "Procedure Type", "Date Created"]
        this.columnsToDisplay = ['claimant_name', 'claim_number', "examiner", "procedure_type", "created_date"]
      }
    })
  }

  ngOnInit() {
    this.subscriberService.getBillableAwait().subscribe(billable => {
      billable.data.map(bill => {
        bill.date_of_birth = bill.date_of_birth ? moment(bill.date_of_birth).format("MM-DD-YYYY") : '';
        bill.claimant_name = bill.claimant_last_name + ', ' + bill.claimant_first_name;
        bill.created_date = bill.createdAt ? moment(bill.createdAt).format("MM-DD-YYYY") : '';
        bill.created_time = bill.createdAt ? moment(bill.createdAt).format("hh:mm a") : '';
        bill.examiner = bill.ex_last_name + ' '+ bill.ex_first_name +''+ (bill.ex_suffix ? ', '+bill.ex_suffix : '')
      })
      console.log(billable);
      this.dataSource = new MatTableDataSource(billable.data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.claimant_name.toLowerCase().includes(filter) || (data.date_of_birth && data.date_of_birth.includes(filter)) ||  (data.claim_number && data.claim_number.includes(filter)) || (data.examiner && data.examiner.toLowerCase().includes(filter)) || (data.created_date && data.created_date.includes(filter)) || (data.created_time && data.created_time.toLowerCase().includes(filter));
      };
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigateBillableEdit(e) {
    this.router.navigate(['/subscriber/billable-item/edit-billable-item', e.claim_id, e.claimant_id, e.id])
  }

}
const ELEMENT_DATA = [
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "claim_number": "123-xyz 352", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "procedure_type": "Examination", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "Mariappan", "first_name": "Rajan", "claim_number": "123-xyz 352", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "procedure_type": "Deposition", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "ss1", "Selvaraj": "Sarath", "claim_number": "123-xyz 352", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "procedure_type": "Deposition", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "Venkat", "first_name": "Velu", "claim_number": "123-xyz 352", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "procedure_type": "Examination", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "ss1", "first_name": "ss1", "claim_number": "123-xyz 352", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "procedure_type": "Deposition", "created_date": '12-10-2020', }

];