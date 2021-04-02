import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClaimService } from 'src/app/subscriber/service/claim.service';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { shareReplay, map } from 'rxjs/operators';
import { IntercomService } from 'src/app/services/intercom.service';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'MM-DD-YYYY hh:mm A Z',
  fullPickerInput: 'MM-DD-YYYY hh:mm A Z',
  datePickerInput: 'MM-DD-YYYY hh:mm A Z',
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
  @Output() billableitemCount: EventEmitter<any> = new EventEmitter<any>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isMobile = false;


  constructor(private claimService: ClaimService, private router: Router, private breakpointObserver: BreakpointObserver, private intercom: IntercomService) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Exam Procedure Type"]
        this.columnsToDisplay = ['is_expand', 'procedure_type_name']
      } else {
        this.columnName = ["Exam Procedure Type", "Date of Service / Date Item Received", "Examiner", "Status"]
        this.columnsToDisplay = ['procedure_type_name', 'appointment_scheduled_date_time', 'examiner_name', "status"]
      }
    })
    this.intercom.getaaStatus().subscribe(res => {
      this.ngOnInit();
    })
  }

  ngOnInit() {
    this.claimService.getbillableItem(this.claimId).subscribe(billRes => {
      this.billableitemCount.emit(billRes.data.count)
      this.dataSource = new MatTableDataSource(billRes['data'])
    }, error => {
      this.dataSource = new MatTableDataSource([])
    })
  }

  openrouteElement(element) {
    if (this.isMobile) {
      if (this.expandId && this.expandId == element.id) {
        this.expandId = null;
      } else {
        this.expandId = element.id;
      }
    } else {
      this.router.navigate([this.router.url + '/billable-item', element.id])
    }
  }
  openrouteMobileElement(element) {
    this.router.navigate([this.router.url + '/billable-item', element.id])
  }
  navigateBillableEdit(e) {
    this.router.navigate(['/subscriber/billable-item/new-billable-item', this.claimId, this.claimantId, e.id])
  }
  expandId: any;
  openElement(element) {
  }
}