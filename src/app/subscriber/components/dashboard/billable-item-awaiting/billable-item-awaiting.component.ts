import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  dataSource = ELEMENT_DATA;
  columnsToDisplay = [];
  expandedElement;
  isMobile = false;
  columnName = []
  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Claimant Name", "Action"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["Claimant Name", "Date of Birth", "Social Security Number", "Date Created"]
        this.columnsToDisplay = ['claimant_name', 'date_of_birth', "ssn", "created_date"]
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

}
const ELEMENT_DATA = [
  { "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "date_of_birth": "2020-05-06", "ssn": "xxx-xx-9999", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "Mariappan", "first_name": "Rajan", "date_of_birth": "2020-05-06", "ssn": "xxx-xx-9999", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "ss1", "Selvaraj": "Sarath", "date_of_birth": "2020-05-06", "ssn": "xxx-xx-9999", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "Venkat", "first_name": "Velu", "date_of_birth": "2020-05-06", "ssn": "xxx-xx-9999", "created_date": '12-10-2020', },
  { "id": 132, "last_name": "ss1", "first_name": "ss1", "date_of_birth": "2020-05-06", "ssn": "xxx-xx-9999", "created_date": '12-10-2020', }

];