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
  isCalenderVIew = true;
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
  @ViewChild(ExaminationCalanderViewComponent, { static: true }) examinationCalanderView: ExaminationCalanderViewComponent
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private examinerService: ExaminerService, private exportService: ExportService, public dialog: MatDialog
  ) {
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
      if (res) {
        this.columnName = ["", "Service Location"]
        this.columnsToDisplay = ['is_expand', 'location_name']
      } else {
        this.columnName = ["Location Name", "Service Location", "Claimant Name", "Examiner", "Appointment Date", "Appointment Time", "Procedure", "Interpreter Needed", "Days Until"]
        this.columnsToDisplay = ['location_name', 'location', 'claimant_name', 'examiner', 'appointment_date', 'appointment_time', "procedure", 'interperter_needed', 'days_until']
      }
    })
  }
  appointmentsData = []
  ngOnInit() {
    this.getCalenderList();
  }

  getCalenderList() {
    this.examinerService.getExaminationDetails().subscribe(res => {
      console.log(res)
      res['data'].map(data => {
        //data.appointment_scheduled_date_time = data.appointment_scheduled_date_time ? moment(data.appointment_scheduled_date_time).format("MM-DD-YYYY") : '';
        data.location_name = data.is_virtual_location ? "Virtual Service Location" : data.service_location_name
        data.location = data.street1 ? [data.street1, data.street2, data.city, data.state, data.zip_code, data.zip_code_plus_4 ? '- ' + data.zip_code_plus_4 : null].filter(Boolean).join(" ") : ''
        data.examiner = data.examiner_first_name ? [data.examiner_last_name, data.examiner_first_name, data.examiner_middle_name, data.examiner_suffix].filter(Boolean).join(" ") : ''
        data.interperter_needed = data.certified_interpreter_required ? 'Yes' : 'No';
        data.appointment_date = data.appointment_scheduled_date_time ? moment(data.appointment_scheduled_date_time).format("MM-DD-YYYY") : '';
        data.appointment_time = data.start && data.end ? moment(data.start).format("hh:mm a") + ' - ' + moment(data.end).format("hh:mm a") : '';
        if (data.appointment_scheduled_date_time) {
          var end = moment((moment()).format("MM-DD-YYYY"));
          var start = moment(moment(data.appointment_scheduled_date_time).format("MM-DD-YYYY"));
          moment.duration(start.diff(end)).asDays();
          data.days = Math.round(moment.duration(start.diff(end)).asDays())
        } else {
          data.days = null
        }
        data.days_until = data.days == 0 ? 'Today' : data.days;
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
  examinationStatus: any[] = [];
  depositionStatus: any[] = [];
  examinationData(data) {
    this.examinationStatus = data.examination;
    this.depositionStatus = data.deposition;
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
      backgroundColor: e.status_color,
      duration: e.duration,
      claimant_id: e.claimant_id,
      billable_item_id: e.billable_item_id,
      claim_id: e.claim_id,
      location: e.street1 ? [e.street1, e.street2, e.city, e.state, e.zip_code, e.zip_code_plus_4 ? '- ' + e.zip_code_plus_4 : null].filter(Boolean).join(" ") : '',
      examiner_name: e.examiner_first_name ? [e.examiner_last_name, e.examiner_first_name, e.examiner_middle_name, e.examiner_suffix].filter(Boolean).join(" ") : '',
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
        claimant_name: e.claimant_first_name ? [e.claimant_last_name, e.claimant_first_name, e.claimant_middle_name].filter(Boolean).join(" ") : '',
        description: e.description,
        email: e.claimant_email,
        exam_name: e.exam_type_name,
        exam_procedure_id: e.exam_procedure_id,
        exam_procedure_name: e.exam_procedure_name,
        exam_procedure_type: e.exam_procedure_type,
        examiner_id: e.examiner_id,
        examiner_name: e.examiner_first_name ? [e.examiner_last_name, e.examiner_first_name, e.examiner_middle_name, e.examiner_suffix].filter(Boolean).join(" ") : '',
        is_deposition: null,
        location: e.street1 ? [e.street1, e.street2, e.city, e.state, e.zip_code, e.zip_code_plus_4 ? '- ' + e.zip_code_plus_4 : null].filter(Boolean).join(" ") : '',
        phone_no_1: e.claimant_phone_no_1,
        procedure_type: "",
        status: e.status,
        status_color: e.status_color,
        supervisor_id: e.supervisor_id,
        is_virtual_location: e.is_virtual_location,
        conference_url: e.conference_url,
        conference_phone: e.conference_phone,
        service_location_name: e.service_location_name,
      }
    }
    let data = {
      event: event,
      calendar_examination_status: this.examinationStatus,
      deposition_status: this.depositionStatus
    }
    const dialogRef = this.dialog.open(EventdetailDialog, {
      width: '550px',
      data: data,

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isChange) {
          this.getCalenderList();
        }
      }
    });
  }

}