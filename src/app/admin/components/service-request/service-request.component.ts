import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  dataSource = ELEMENT_DATA;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Subscriber Name", "Servive Status"]
        this.columnsToDisplay = ['is_expand', 'subscriber_name', "service_status"]
      } else {
        this.columnName = ["Subscriber Name","Subscriber Account", "Requester Name", "Claim Reference", "Service Type", "Request date Time", "Request Reference", "Service Priority", "Service Provider Name", "Service Provider Account", "Service Status"]
        this.columnsToDisplay = ['subscriber_name','subscriber_account', 'requesterName', 'claim_ref', 'service_type', 'request_date', 'request_ref', 'service_priority', 'service_provider_name', 'ppmc_account', 'service_status']
      }
    })
  }

  ngOnInit() {
  }
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

}
const ELEMENT_DATA = [
  { "id": 132, "subscriber_name": "Venkat", "subscriber_account":"2566854", "requesterName":"Sarath", "claim_ref":"4455698", "service_type":"type", "request_date":"02-02-2020", "request_ref":"4644", "service_priority":"priority", "service_provider_name":"Rajan", "ppmc_account":"1458956", "service_status":"Status" },
  
];
