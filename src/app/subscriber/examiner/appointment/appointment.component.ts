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
import { ExaminationCalanderViewComponent, EventdetailDialog } from '../examination-calander-view/examination-calander-view.component';
import { MatDialog } from '@angular/material';
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
  isCalender: boolean = false;
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
  @ViewChild(ExaminationCalanderViewComponent, { static: false }) examinationCalanderView: ExaminationCalanderViewComponent
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private examinerService: ExaminerService, private exportService: ExportService, public dialog: MatDialog
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Service Location"]
        this.columnsToDisplay = ['is_expand', 'location_name']
      } else {
        this.columnName = ["Location Name", "Service Location", "Claimant Name", "Appointment Date", "Appointment Time", "Procedure", "Interpreter Needed", "Days Until"]
        this.columnsToDisplay = ['location_name', 'location', 'claimant_name', 'appointment_date', 'appointment_time', "procedure", 'interperter_needed', 'days_until']
      }
    })
  }
  appointmentsData = []
  ngOnInit() {
    this.examinerService.getExaminationDetails().subscribe(res => {
      console.log(res)
      res['data'].map(data => {
        //data.appointment_scheduled_date_time = data.appointment_scheduled_date_time ? moment(data.appointment_scheduled_date_time).format("MM-DD-YYYY") : '';
        // data.examiner_name = data.examiner_first_name + ' ' + data.examiner_middle_name + ' ' + data.examiner_last_name
      })
      this.appointmentsData = res['data'];
      this.dataSource = new MatTableDataSource(res['data']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId) => (typeof (data[sortHeaderId]) == 'string') && data[sortHeaderId].toLocaleLowerCase();
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
    if (this.isMobile)
      if (this.expandId && this.expandId == element) {
        this.expandId = null;
      } else {
        this.expandId = element;
      }
  }

  getData() {
    this.dataSource = new MatTableDataSource(this.appointmentsData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  CalenderVIew(status) {
    this.isCalenderVIew = status;
    this.dataSource = new MatTableDataSource([])
    this.getData()

  }
  extendedProps: any
  handleEventClick(e) {
    this.openEventDetailDialog(e);
  }

  openEventDetailDialog(e): void {
    let event = {
      title: e.title,
      start: e.start,
      end: e.end,
      backgroundColor: e.backgroundColor,
      duration: e.duration,
      claimant_id: e.claimant_id,
      billable_item_id: e.billable_item_id,
      claim_id: e.claim_id,
      location: e.street1 ? e.street1.concat(' ', e.street2, ' ', e.city, ' ', e.state, ' ', e.zip_code) : '',
      examiner_name: e.examiner_first_name ? e.examiner_last_name.concat(' ', e.examiner_first_name, ' ', e.examiner_middle_name) : '',
      is_virtual_location: e.is_virtual_location,
      conference_url: e.conference_url,
      conference_phone: e.conference_phone,
      service_location_name: e.service_location_name,
      extendedProps: {
        duration: e.duration,
        appointment_id: e.appointment_id,
        billable_item_id: e.billable_item_id,
        claim_id: e.claim_id,
        claim_number: e.claim_number,
        claimant_id: e.claimant_id,
        claimant_name: e.claimant_first_name ? e.claimant_last_name.concat(' ', e.claimant_first_name, ' ', e.claimant_middle_name) : '',
        description: e.description,
        email: e.claimant_email,
        exam_name: e.exam_type_name,
        exam_procedure_id: e.exam_procedure_id,
        exam_procedure_name: e.exam_procedure_name,
        exam_procedure_type: e.exam_procedure_type,
        examiner_id: e.examiner_id,
        examiner_name: e.examiner_first_name ? e.examiner_last_name.concat(' ', e.examiner_first_name, ' ', e.examiner_middle_name) : '',
        is_deposition: null,
        location: e.street1 ? e.street1.concat(' ', e.street2, ' ', e.city, ' ', e.state, ' ', e.zip_code) : '',
        phone_no_1: e.claimant_phone_no_1,
        procedure_type: "",
        status: e.status,
        status_color: e.status_color,
        supervisor_id: e.supervisor_id
      }
    }
    let data = {
      event: event,
      calendar_examination_status: [],
      deposition_status: []
    }
    const dialogRef = this.dialog.open(EventdetailDialog, {
      width: '550px',
      data: data,

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}