import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-upcomming-billable-item',
  templateUrl: './upcomming-billable-item.component.html',
  styleUrls: ['./upcomming-billable-item.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UpcommingBillableItemComponent implements OnInit {
   isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
dataSource:any = new MatTableDataSource([])
columnsToDisplay = [];
expandedElement;
isMobile = false;
columnName = [];
filterValue: string;
constructor(private breakpointObserver: BreakpointObserver) {
  this.isHandset$.subscribe(res => {
    this.isMobile = res;
    if (res) {
      this.columnName = ["", "Claimant", "Action"]
      this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
    } else {
      this.columnName = ["Claimant","Procedure Type", "Examiner", "Date of service / Date Item Received", "Service Location", "History On Demand", "Records On Demand", "Examination  Status"]
      this.columnsToDisplay = ['claimant_name','procedure_type', "examiner", "dos", 'service_location', 'history_on_demand', 'records_on_demand', 'exam_Status']
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
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.", "dos": "12-10-2020","service_location":"123 Boulevard avenue - Los Angeles", "history_on_demand":"Complete", "records_on_demand":"In Progress", "exam_Status":"Not Confirmed" },
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.", "dos": "12-10-2020","service_location":"123 Boulevard avenue - Los Angeles", "history_on_demand":"Accepted", "records_on_demand":"Complete", "exam_Status":"Left Voicemail" },
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.", "dos": "12-10-2020","service_location":"123 Boulevard avenue - Los Angeles", "history_on_demand":"Sent", "records_on_demand":"Sent", "exam_Status":"Confirmed" },
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.", "dos": "12-10-2020","service_location":"123 Boulevard avenue - Los Angeles", "history_on_demand":"Complete", "records_on_demand":"In Progress", "exam_Status":"Not Confirmed" },
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.", "dos": "12-10-2020","service_location":"123 Boulevard avenue - Los Angeles", "history_on_demand":"Accepted", "records_on_demand":"Sent", "exam_Status":"Confirmed" },
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.", "dos": "12-10-2020","service_location":"123 Boulevard avenue - Los Angeles", "history_on_demand":"Complete", "records_on_demand":"In Progress", "exam_Status":"Not Confirmed" },

];
