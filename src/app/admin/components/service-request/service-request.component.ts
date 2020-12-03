import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from './../../services/user.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiceRequestComponent implements OnInit {
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Subscriber Name", "Servive Status"]
        this.columnsToDisplay = ['is_expand', 'subscriber_first_name', "service_request_transmit_status"]
      } else {
        this.columnName = ["Subscriber Name", "Subscriber Account", "Requester Name", "Claim #", "Reference #", "Service Type", "Request Date Time", "Request Reference", "Service Priority", "Service Provider Name", "Service Provider Account", "Service Status"]
        this.columnsToDisplay = ['subscriber_first_name', 'subscriber_account_no', 'requester_first_name', 'claim_number', 'reference_no', 'service_request_type', 'date_of_request', 'request_reference_id', 'service_priority', 'service_provider', 'service_provider_account_no', 'service_request_transmit_status']
      }
    });
    this.userService.getServiceRequests().subscribe(res => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngOnInit() {
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

}
const ELEMENT_DATA = [
  { "id": 132, "subscriber_name": "Venkat", "subscriber_account": "2566854", "requesterName": "Sarath", "claim_ref": "4455698", "service_type": "type", "request_date": "02-02-2020", "request_ref": "4644", "service_priority": "priority", "service_provider_name": "Rajan", "ppmc_account": "1458956", "service_status": "Status" },

];
