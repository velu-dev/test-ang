import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoryComponent implements OnInit {
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
  paramsId: any;
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private onDemandService: OnDemandService) {

    this.route.params.subscribe(param => {
      console.log(param)
      this.paramsId = param;
      this.onDemandService.getHistory(param.id,param.billId).subscribe(history=>{
        console.log(history,"history")
      })
    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName = ["File Name", "Rush Request?", "Date Requested", "Date Received", "Download"]
        this.columnsToDisplay = ['file_name', 'rush_request', "request_date", "received_date", 'download']
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

  onDemandSubmit() {

   let data=  {
      claim_id: this.paramsId.id,
      service_priority: "rush",
      service_description: "",
      document_type_id: 7,
      billable_item_id: this.paramsId.billId,
      service_request_type_id : 3,
      service_provider_id: 3 // default 3
  }
    this.onDemandService.requestCreate(data).subscribe(service => {

    })
  }

}
const ELEMENT_DATA = [
  { "id": 143, "file_name": "Medical History Questionnaire file name", "rush_request": "No", "request_date": "01-02-2020", "received_date": "01-02-2020", "Download": "" },
];
