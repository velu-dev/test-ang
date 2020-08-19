import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-billable-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BilllableBillingComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource = ELEMENT_DATA;
  dataSource1 = ELEMENT_DATA1;
  columnsToDisplay = [];
  columnsToDisplay1 = [];
  expandedElement;
  expandedElement1;
  isMobile = false;
  isMobile1 = false;
  columnName = [];
  columnName1 = [];
  filterValue: string;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Code", "Action"]
        this.columnsToDisplay = ['is_expand', 'code', 'action']
      } else {
        this.columnName = ["Code", "Name", "Action"]
        this.columnsToDisplay = ['code', 'name', 'action']
      }
      this.isMobile1 = res;
      if (res) {
        this.columnName1 = ["", "Item", "Action"]
        this.columnsToDisplay1 = ['is_expand', 'code', "action"]
      } else {
        this.columnName1 = ["Item", "Procedure Code", "Modifier", "Units", "Charge", "Payment", "Balance", "Action"]
        this.columnsToDisplay1 = ['item', 'procedure_code', 'modifier', 'units', 'charge', 'payment', 'balance', 'action']
      }
    })
  }

  ngOnInit() {
  }
  expandId: any;
  expandId1: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
    if (this.isMobile1) {
      this.expandId1 = element.id;
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
  { "id": 132, "code": "K50.00", "name": " Crohn disease of small intestine without complications " },
  { "id": 131, "code": "N80.1", "name": "Endometriosis of ovary" },
  { "id": 130, "code": "M76.62", "name": "Achilles tendinitis, left leg" },

];
const ELEMENT_DATA1 = [
  { "id": 1384, "item": "UQME", "procedure_code": "ML 101", "modifier": "96", "units": "1", "charge": "2200.00", "payment": "0", "balance": "2200.00"},

];