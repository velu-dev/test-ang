import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
import { AlertService } from 'src/app/shared/services/alert.service';
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
  dataSource: any;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = [];
  filterValue: string;
  paramsId: any;
  historyData: any;
  rushRequest: any;
  inFile: any = [];
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private onDemandService: OnDemandService, private alertService: AlertService) {

    this.route.params.subscribe(param => {
      this.paramsId = param;

    })

    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "File Name", "Download"]
        this.columnsToDisplay = ['is_expand', 'file_name', 'download']
      } else {
        this.columnName = ["File Name", "Rush Request?", "Date Requested", "Date Received", "Download"]
        this.columnsToDisplay = ['file_name', 'service_priority', "date_of_request", "date_of_communication", 'download']
      }
    })
  }

  ngOnInit() {

    this.onDemandService.getHistory(this.paramsId.id, this.paramsId.billId).subscribe(history => {
      this.historyData = history;
      this.historyData.documets_sent_and_received.map(inFile => {
        if (inFile.transmission_direction == 'IN') {
          this.inFile.push(inFile)
        }

      })
      this.dataSource = new MatTableDataSource(this.inFile)
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

 
  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.document_id;
    }

  }

  onDemandSubmit() {
    return;
    let data = {
      claim_id: this.paramsId.id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      service_description: "",
      document_category_id: this.historyData.documets[0].document_category_id,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: this.historyData.documets[0].service_request_type_id,
      service_provider_id: this.historyData.documets[0].service_provider_id // default 3
    }
    this.onDemandService.requestCreate(data).subscribe(history => {
      this.alertService.openSnackBar("Medical History Questionnaire On Demand created successfully!", 'success');
    }, error => {
      console.log(error);
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }

  download(data) {
    saveAs(data.file_url, data.file_name);
  }

}
