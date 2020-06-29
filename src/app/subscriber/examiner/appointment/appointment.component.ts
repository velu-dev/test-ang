import { Component, OnInit, ViewChild } from '@angular/core';
import * as globals from '../../../globals';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ExaminerService } from '../../service/examiner.service';
import { ExportService } from 'src/app/shared/services/export.service';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppointmentComponent implements OnInit {
  isCalenderVIew = false;
  xls = globals.xls
  completed = globals.completed
  left_voicemail = globals.left_voicemail
  columnName = []
  columnsToDisplay = [];
  dataSource: any;
  filterAll: any;
  roles = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile = false;
  expandedElement: any | null;
  disabled = false;
  filterValue;
  tabIndex;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private examinerService: ExaminerService, private exportService: ExportService
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Name", "Status"]
        this.columnsToDisplay = ['is_expand', 'claimant_name', "disabled"]
      } else {
        this.columnName = ["Name", "Claim Number", "Examiner", "Exam Type", "Location", "Date", "Status"]
        this.columnsToDisplay = ['claimant_name', 'claim_number', 'examiner', 'exam_type_code', 'location', 'appointment_scheduled_date_time', "status"]
      }
    })
  }

  ngOnInit() {
    this.examinerService.getExaminationDetails().subscribe(res => {
      console.log(res)
      res['data'].map(data => {
        data.appointment_scheduled_date_time = data.appointment_scheduled_date_time ? moment(data.appointment_scheduled_date_time).format("MM-DD-YYYY") : '';
        data.examiner_name = data.examiner_first_name + ' ' + data.examiner_middle_name + ' ' + data.examiner_last_name
      })
      this.dataSource = new MatTableDataSource(res['data']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.examiner_name && data.examiner_name.toLowerCase().includes(filter) || (data.claimant_name && data.claimant_name.toLowerCase().includes(filter)) || (data.exam_type_code && data.exam_type_code.toLowerCase().includes(filter)) || (data.location.street1 && data.location.street1.toLowerCase().includes(filter)) || (data.location.street2 && data.location.street2.toLowerCase().includes(filter)) || (data.location.city && data.location.city.toLowerCase().includes(filter)) || (data.location.state && data.location.state.toLowerCase().includes(filter)) || (data.location.zip_code && data.location.zip_code.toString().toLowerCase().includes(filter)) || (data.claim_number && data.claim_number.includes(filter) || data.appointment_scheduled_date_time && data.appointment_scheduled_date_time.includes(filter));
      };
    }, error => {
      console.log(error);
      this.dataSource = new MatTableDataSource([])
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  expandId: any;
  openElement(element) {
    console.log(element)
    //this.router.navigate(['/subscriber/examiner/appointment-details'])
    if (this.isMobile) {
      this.expandId = element.id;
      // element.isExpand = !element.isExpand;
    }
  }
  navigate(element) {
    this.router.navigate(['/subscriber/appointment/appointment-details', element.claim_id, element.bill_item_id])
  }

  exportData() {
    let data = []
    let details = this.dataSource['_data']['_value'];
    details.map(res => {
      data.push({
        "Name": res.claimant_name,
        "Claim Numbers": res.claim_number,
        "Exam Type": res.exam_type_code,
        "Location": res.location.street1 + ' ' + res.location.street2
          + ' ' + res.location.city + ' ' + res.location.state + ' ' + res.location.zip_code,
        "Date": res.appointment_scheduled_date_time ? moment(res.appointment_scheduled_date_time).format("MM-DD-YYYY") : '',
        "Status": res.state,
      })

    })
    this.exportService.exportExcel(data, "Examination" + moment().format('MM-DD-YYYYhh:mm'))

  }

}