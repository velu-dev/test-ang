import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
export class UpcommingBillableItemComponent implements OnInit { isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
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
      this.columnName = ["", "Claimant", "Action"]
      this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
    } else {
      this.columnName = ["Claimant","Procedure Type", "Examiner", "Date of service", "Service Location"]
      this.columnsToDisplay = ['claimant_name','claim_number', "examiner","procedure_type", "created_date"]
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
{ "id": 132, "last_name": "Mariyappan", "first_name": "Venkatesan", "claim_number": "123-xyz 352", "ex_lastname": "Jorge","ex_firstname": "Sanchez","ex_suffix": "M.D.",  "procedure_type": "Examination", "created_date": '12-10-2020', },

];
