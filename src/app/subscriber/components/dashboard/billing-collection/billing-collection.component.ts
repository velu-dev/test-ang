import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-billing-collection',
  templateUrl: './billing-collection.component.html',
  styleUrls: ['./billing-collection.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BillingCollectionComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource: any = new MatTableDataSource([])
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
        this.columnName = ["Claimant", "Procedure Type", "Examiner", "Date of service / Date Item Received", "Bill Date", "Status"]
        this.columnsToDisplay = ['claimant_name', 'procedure_type', "examiner", "dos", 'bill_date', 'status']
      }
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
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

}
const ELEMENT_DATA = [
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Not Sent", },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Accepted" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Sent" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Not Sent" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Accepted" },
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "procedure_type": "Examination", "ex_lastname": "Jorge", "ex_firstname": "Sanchez", "ex_suffix": "M.D.", "dos": "12-10-2020", "bill_date": "10-25-2020", "status": "Not Sent" },

];
