import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { OnDemandService } from 'src/app/subscriber/service/on-demand.service';
import { MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
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
  inFile:any = [];
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
    private onDemandService: OnDemandService) {

    this.route.params.subscribe(param => {
      console.log(param)
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
      console.log(history, "history")
      this.historyData = history;
      // this.historyData.documets_sent_and_received = [{
      //   "document_transmit_mode": "IMMEDIATE",
      //   "date_of_request": "2020-07-28T06:34:04.253Z",
      //   "service_priority": "rush",
      //   "on_demand_service_request_id": 65,
      //   "on_demand_services_request_docs_id": 120,
      //   "transmitted_file_name": "1051031960_VenkatesanMariyappan_M_1021001733_transcription_01_20200728_173404_393_XP.docx",
      //   "document_id": 2180,
      //   "transmission_direction": "OUT",
      //   "date_of_communication": "2020-07-28T06:34:04.394Z",
      //   "file_name": "429c227ae4b7b36490be80509b850ff6-1595484870265.docx",
      //   "file_url": "https://d3qlsnvvobb6z6.cloudfront.net/organization_10_111301101232/claims/IMEDEPO/4b98ebcc35be73dbe47d54af20856198.docx?Expires=1596109913&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kM3Fsc252dm9iYjZ6Ni5jbG91ZGZyb250Lm5ldC9vcmdhbml6YXRpb25fMTBfMTExMzAxMTAxMjMyL2NsYWltcy9JTUVERVBPLzRiOThlYmNjMzViZTczZGJlNDdkNTRhZjIwODU2MTk4LmRvY3giLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTYxMDk5MTN9fX1dfQ__&Signature=gJKckKiGjQe8beAVJXEWmGPNYwGth~yP1QEJkF~hrWo8glyfR~HslkTWy0wHNl66Fz20WdJOlw4E0rh9wZbA-af-s4sPhCB7QFrZECuzbrtriclYT6rCCxCHE6SWcZ~pKBm7bQOpEPY-93Gb1msmda6GdNZn6JVTS1BwoEzmCjikx7zt1CY06l5xHqUWw5ZWqsjXlmadBXOxHWGEYPCQQ9lzZhUBHBHXTwm7HNsa0By8F9dHaR4ovW9DxumyRCvvFbxRzuXdJ7rqCl0gLT26cHlx6i4ybHupEc-NkMjnwsx8OJo0fAT-vHBFxLfKn4vZ7XjCGiNonAWwcGBVQZk1lQ__&Key-Pair-Id=APKAJQ63EA47SVC6S4KQ"
      // },
      // {
      //   "document_transmit_mode": "IMMEDIATE",
      //   "date_of_request": "2020-07-28T06:34:04.253Z",
      //   "service_priority": "rush",
      //   "on_demand_service_request_id": 65,
      //   "on_demand_services_request_docs_id": 121,
      //   "transmitted_file_name": "1051031960_VenkatesanMariyappan_M_1021001733_transcription_02_20200728_173406_286_XP.xlsx",
      //   "document_id": 2181,
      //   "transmission_direction": "OUT",
      //   "date_of_communication": "2020-07-28T06:34:06.287Z",
      //   "file_name": "Non-Admin-Users (8)-1595484890589.xlsx",
      //   "file_url": "https://d3qlsnvvobb6z6.cloudfront.net/organization_10_111301101232/claims/IMEDEPO/36f732448b0ec15202c95f23ab978d16.xlsx?Expires=1596109913&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kM3Fsc252dm9iYjZ6Ni5jbG91ZGZyb250Lm5ldC9vcmdhbml6YXRpb25fMTBfMTExMzAxMTAxMjMyL2NsYWltcy9JTUVERVBPLzM2ZjczMjQ0OGIwZWMxNTIwMmM5NWYyM2FiOTc4ZDE2Lnhsc3giLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTYxMDk5MTN9fX1dfQ__&Signature=fYAOODi9Vkzk7-kk-orl8qtx~Uu9dy~VhQXw~5PxVXzf5doC1l-ofjD36MWyorPyg-tdIlxFdaREaO78G4yyDcHhAIeM7OZ9fqQlOQa1xuDZPWuz~lnPRqp6nJl2OQcuRsf5pBBfRwDqW8Xzr11svskXCQtZsN07SJSmLwUVRWm-SB~c4gojSf9UKa56-HPs2Bzjm7LjX6znwE3ikr7-fMFG2r-L64qn8UuHjEpPwr7uFl2rk1Ely66aXZPZCCnw-cZHpZ9h4ChgUFe4wcp-BfAcUdpTUBeWdtwFMcDl2PctlUlnO-FsC12tbK9K~ZVMEecReF7hMsI036HFJYLHlA__&Key-Pair-Id=APKAJQ63EA47SVC6S4KQ"
      // },
      // {
      //   "document_transmit_mode": "IMMEDIATE",
      //   "date_of_request": "2020-07-28T06:34:04.253Z",
      //   "service_priority": "rush",
      //   "on_demand_service_request_id": 65,
      //   "on_demand_services_request_docs_id": 122,
      //   "transmitted_file_name": "1051031960_VenkatesanMariyappan_M_1021001733_transcription_03_20200728_173407_913_XP.pdf",
      //   "document_id": 100,
      //   "transmission_direction": "OUT",
      //   "date_of_communication": "2020-07-28T06:34:07.913Z",
      //   "file_name": "claimant-page-1589969682480.pdf",
      //   "file_url": "https://d3qlsnvvobb6z6.cloudfront.net/organization_10_111301101232/claims/RT/779c72745c523473cda9925a6d64d89e.pdf?Expires=1596109913&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kM3Fsc252dm9iYjZ6Ni5jbG91ZGZyb250Lm5ldC9vcmdhbml6YXRpb25fMTBfMTExMzAxMTAxMjMyL2NsYWltcy9SVC83NzljNzI3NDVjNTIzNDczY2RhOTkyNWE2ZDY0ZDg5ZS5wZGYiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTYxMDk5MTN9fX1dfQ__&Signature=JmBj7JWjHxbzMQKKqlvmilI2KYwyKtPVM1xO3c~zCOs~0f7FTsW6DxivPBw6PSJXW2yH6~y~H3Dr1AXzq7xqyfVatEBqbdC62UUcmve0bQRnQK~U80EoBQk6arH52E7yBgGRx9JBOPAJ~EiBwGbAVMZTA7haNllLEq6z2Bimv7hUkbu8YNtB9iYa5vyCbFmURn-V6VJNy1wmmQHqERuRZUaJwcghYY-3Rz3rfWMsy7tmtUJR1TCwA45naMLVSzYG5vzfBlXW7DI72iCHAkHKgMvNdBluq0uWYt6t-DhwHNcBAVPEJjqy2~kvy9G9-oqRMPINRjwuMRjeazQU~~DMDA__&Key-Pair-Id=APKAJQ63EA47SVC6S4KQ"
      // }
      // ]
      this.historyData.documets_sent_and_received.map(inFile=>{
        if(inFile.transmission_direction == 'IN'){
          this.inFile.push(inFile)
        }

      })
      this.dataSource = new MatTableDataSource(this.inFile)
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

  // rushChanges(e) {
  //   this.rushRequest = e;
  // }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.document_id;
    }

  }

  onDemandSubmit() {
    console.log(this.rushRequest)
    let data = {
      claim_id: this.paramsId.id,
      service_priority: this.rushRequest ? "rush" : 'normal',
      service_description: "",
      document_type_id: this.historyData.documets[0].document_type_id,
      billable_item_id: this.paramsId.billId,
      service_request_type_id: this.historyData.documets[0].service_request_type_id,
      service_provider_id: this.historyData.documets[0].service_provider_id // default 3
    }
    console.log(data);
    this.onDemandService.requestCreate(data).subscribe(history => {
      console.log(history)
    }, error => {
      console.log(error)
    })
  }

  download(data) {
    saveAs(data.file_url, data.file_name);
  }

}
const ELEMENT_DATA = [
  { "id": 143, "file_name": "Medical History Questionnaire file name", "rush_request": "No", "request_date": "01-02-2020", "received_date": "01-02-2020", "Download": "" },
];
