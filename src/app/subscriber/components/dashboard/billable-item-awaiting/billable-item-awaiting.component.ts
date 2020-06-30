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
        this.columnName = ["Claimant Name", "Examiner", "Date of Birth", "Date of Injury", "Claim Number"]
        this.columnsToDisplay = ['claimant_name', 'examiner', 'date_of_birth', "date_of_injury", "claim_number"]
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
const ELEMENT_DATA = [{ "id": 109, "last_name": "atta", "first_name": "Velusamy", "date_of_birth": "2020-04-08", "gender": null, "ex_first_name": "sarathexaminer", "ex_middle_name": "ss", "ex_last_name": "examiners", "claim_number": "131313", "date_of_injury": "2020-05-22" }, { "id": 10, "last_name": "new", "first_name": "sarath", "date_of_birth": "2020-03-31", "gender": "M", "ex_first_name": "sarath", "ex_middle_name": "ss", "ex_last_name": "selva", "claim_number": "123456788", "date_of_injury": "2020-05-20" }, { "id": 10, "last_name": "new", "first_name": "sarath", "date_of_birth": "2020-03-31", "gender": "M", "ex_first_name": "sarathexaminer", "ex_middle_name": "ss", "ex_last_name": "examiners", "claim_number": "123456788", "date_of_injury": "2020-05-20" }, { "id": 190, "last_name": "ff4", "first_name": "ff4", "date_of_birth": "2020-05-11", "gender": null, "ex_first_name": "sarath", "ex_middle_name": "ss", "ex_last_name": "selva", "claim_number": null, "date_of_injury": null }, { "id": 132, "last_name": "ss1", "first_name": "ss1", "date_of_birth": "2020-05-06", "gender": null, "ex_first_name": null, "ex_middle_name": null, "ex_last_name": null, "claim_number": null, "date_of_injury": null }];