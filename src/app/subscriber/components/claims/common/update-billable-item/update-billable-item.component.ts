import { Component, OnInit, Input } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { shareReplay, map } from 'rxjs/operators';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'L LT',
  fullPickerInput: 'L LT',
  datePickerInput: 'L',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-update-billable-item',
  templateUrl: './update-billable-item.component.html',
  styleUrls: ['./update-billable-item.component.scss'],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class UpdateBillableItemComponent implements OnInit {

  dataSource: any;
  columnName = []
  columnsToDisplay = [];
  expandedElement: any;
  // displayedColumns: string[] = ['billable_item', 'd_o_s', 'examiner', 'status'];
  // dataSource: any;
  @Input('state') states;
  @Input('claim_id') claimId;
  @Input('claimant_id') claimantId;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isMobile = false;


  constructor(private claimService: ClaimService, private router: Router, private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Exam Type", "Status"]
        this.columnsToDisplay = ['is_expand', 'procedure_type_name', "status"]
      } else {
        this.columnName = ["Exam Type", "Date of Service / Date Item Received", "Examiner", "Status"]
        this.columnsToDisplay = ['procedure_type_name', 'appointment_scheduled_date_time', 'examiner_name', "status"]
      }
    })
  }

  ngOnInit() {
    this.claimService.getbillableItem(this.claimId).subscribe(billRes => {
      console.log("billRes", billRes)
      this.dataSource = new MatTableDataSource(billRes['data'])
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

  openrouteElement(e) {
    this.router.navigate([this.router.url + '/billable-item', e.id])
  }
  navigateBillableEdit(e) {
    this.router.navigate(['/subscriber/billable-item/new-billable-item', this.claimId, this.claimantId, e.id])
  }

  expandId: any;
  openElement(element) {
    if (this.isMobile) {
      this.expandId = element.id;
    }
  }
}