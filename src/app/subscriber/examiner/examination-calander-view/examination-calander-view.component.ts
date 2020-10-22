import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { FullCalendarComponent } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, memoize } from '@fullcalendar/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { formatDate } from '@angular/common';
import { OWL_DATE_TIME_FORMATS, DateTimeAdapter, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClaimService } from '../../service/claim.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
@Component({
  selector: 'app-examination-calander-view',
  templateUrl: './examination-calander-view.component.html',
  styleUrls: ['./examination-calander-view.component.scss']
})
export class ExaminationCalanderViewComponent implements OnInit {
  options: any = {
    // height: "parent",
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Monday - Thursday

      startTime: '06:00', // a start time (10am in this example)
      endTime: '20:00', // an end time (6pm in this example)
    },
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    editable: false,
    customButtons: {
      myCustomButton: {
        text: "Select Date",
        click: () => this.intake.open()
      },
      prev: {
        text: '<',
        click: this.calendarPrev.bind(this)
      },
      next: {
        text: '>',
        click: this.calendarNext.bind(this)
      }
    },
    header: {
      center: '',
      left: 'today prev next title',
      right: 'myCustomButton dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventLimit: true,
    views: {
      dayGridMonth: { // name of view
        // titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
        // other view-specific options here
      },
      dayGrid: {
        eventLimit: 4 // adjust to 6 only for timeGridWeek/timeGridDay
      }
    },
    plugins: [dayGridPlugin, interactionPlugin, timeGrigPlugin, bootstrapPlugin]

  }
  @ViewChild("calendar", { static: false }) calendar: FullCalendarComponent;
  @ViewChild("intake", { static: false }) intake;
  // calendarComponent: FullCalendarComponent;
  events = [];
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[];
  selectedDate = "";
  examinars = [];
  roleId: any;
  examinerId: any = 0;
  appointmentId: any;
  calendar_examination_status = [];
  deposition_status = [];
  months = [];
  calendarDef: any;
  currentMonth = moment().month();
  constructor(private cookieService: CookieService, public dialog: MatDialog, public examinarService: ExaminerService, private route: ActivatedRoute, private alertService: AlertService, private elementRef: ElementRef) {
    this.currentMonth = moment().month();
    let currentMonth = moment().month() + 1;
    if (currentMonth == 12) {
      this.months = [currentMonth - 1, currentMonth, 1];
    } else if (currentMonth == 1) {
      this.months = [currentMonth, currentMonth + 1];
    } else {
      this.months = [currentMonth - 1, currentMonth, currentMonth + 1];
    }
    ['deposition_status', 'calendar_examination_status'].map(seed => {
      this.examinarService.seedData(seed).subscribe(curres => {
        if (seed == 'deposition_status') {
          this.deposition_status = curres.data;
        }
        if (seed == 'calendar_examination_status') {
          this.calendar_examination_status = curres.data;
        }
      });
    })
    this.examinarService.getExaminerList().subscribe(res => {
      this.examinars = res.data;
      this.route.params.subscribe(param => {
        if (param.examiner_id) {
          this.examinerId = param.examiner_id;
          this.appointmentId = param.billId
          if (this.examinerId)
            this.getSingleEvent();
        } else {
          this.loadAllEvents();
        }
      })
    })
    this.roleId = this.cookieService.get("role_id");

  }
  getSingleEvent() {
    this.examinarService.getSingleEvent(this.examinerId, this.appointmentId).subscribe(res => {
      this.selectedDate = res.data.start;
      this.selectExaminer(this.examinerId, false);
      this.openEventDetailDialog({ event: res.data })
      this.dateChanged()
    }, error => {
      this.calendarEvents = [];
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  ngOnInit() {

  }
  examinername(examiner) {
    let middle_name = examiner.middle_name ? " " + examiner.middle_name : "";
    let suffix = examiner.suffix ? ", " + examiner.suffix : "";
    return examiner.first_name + " " + examiner.last_name + middle_name + suffix
  }
  ngAfterViewInit() { }
  calendarPrev(event?) {
    this.calendar.getApi().prev();
    let date = this.calendar.getApi().getDate();
    if (this.currentMonth != moment(date).month()) {
      this.currentMonth = moment(date).month();
      let currentMonth = moment(date).month() + 1;
      if (currentMonth == 12) {
        this.months = [currentMonth - 1, currentMonth, 1];
      } else if (currentMonth == 1) {
        this.months = [currentMonth, currentMonth + 1];
      } else {
        this.months = [currentMonth - 1, currentMonth, currentMonth + 1];
      }
      if (this.examinerId) {
        this.selectExaminer(this.examinerId, false);
      } else {
        this.loadAllEvents();
      }
    }
  }
  calendarNext(event?) {
    this.calendar.getApi().next();
    let date = this.calendar.getApi().getDate();
    if (this.currentMonth != moment(date).month()) {
      this.currentMonth = moment(date).month();
      let currentMonth = moment(date).month() + 1;

      if (currentMonth == 12) {
        this.months = [currentMonth - 1, currentMonth, 1];
      } else if (currentMonth == 1) {
        this.months = [currentMonth, currentMonth + 1];
      } else {
        this.months = [currentMonth - 1, currentMonth, currentMonth + 1];
      }
      if (this.examinerId) {
        this.selectExaminer(this.examinerId, false);
      } else {
        this.loadAllEvents();
      }
    }
  }
  loadAllEvents() {
    this.examinarService.getCalendarEvent(this.months).subscribe(event => {
      this.calendarEvents = event.data;
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  selectExaminer(examiner?, status?) {
    let date = this.selectedDate ? this.selectedDate : new Date();
    let currentMonth = moment(date).month() + 1;
    if (currentMonth == 12) {
      this.months = [currentMonth - 1, currentMonth, 1];
    } else if (currentMonth == 1) {
      this.months = [currentMonth, currentMonth + 1];
    } else {
      this.months = [currentMonth - 1, currentMonth, currentMonth + 1];
    }
    if (status)
      this.calendar.getApi().removeAllEvents();
    if (examiner) {
      this.examinarService.getExaminerCalendarEvent(examiner, this.months).subscribe(event => {
        if (event.data) {
          this.calendarEvents = event.data;
        }
      }, error => {
        this.calendarEvents = []
        this.alertService.openSnackBar(error.error.message, 'error');
      })
    } else {
      this.loadAllEvents();
    }
  }
  handleEventClick(e) {
    console.log(e)
    this.openEventDetailDialog(e);
  }
  handleDateClick(e) {
    // this.openAddEventDialog(e);
  }
  dateChanged() {
    this.calendar.getApi().gotoDate(new Date(this.selectedDate))
    this.calendar.getApi().changeView("timeGridDay");
  }

  openEventDetailDialog(e): void {
    let data = {
      event: e.event,
      calendar_examination_status: this.calendar_examination_status,
      deposition_status: this.deposition_status
    }
    const dialogRef = this.dialog.open(EventdetailDialog, {
      width: '550px',
      data: data,

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        if (result.isChange) {
          if (this.examinerId) {
            this.selectExaminer(this.examinerId, false);
          } else {
            this.loadAllEvents();
          }
        }
      }
    });
  }
  // openAddEventDialog(arg): void {
  //   const dialogRef = this.dialog.open(AddEventDialog, {
  //     width: '550px',
  //     data: { date: arg.date, name: "" }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }
}
// @Component({
//   selector: 'event-detail-dialog',
//   templateUrl: 'event-detail-dialog.html',
// })
// export class AddEventDialog {
//   event = { name: "", start: "", end: "", location: "" }
//   constructor(public dialogRef: MatDialogRef<EventdetailDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//   pickerOpened(a) {

//   }
// }

export const PICK_FORMATS = {
  // parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM-dd-yyyy', this.locale);;
    } else {
      return date.toDateString();
    }
  }
}
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
  selector: 'event-detail-dialog',
  templateUrl: 'event-detail-dialog.html',
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ]
})
export class EventdetailDialog {
  event = { duration: "", claimant_id: "", billable_item_id: "", claim_id: "", title: "", start: "", location: "", examiner_name: "", claimant_name: "", exam_procedure_name: "", exam_name: "", claim_number: "", status: "", phone_no_1: "", email: "", description: "", }
  isEdit = false;
  textDisable: boolean = true;
  examinationStatus = [];
  eventStatus: any;
  eventStatusID: any;
  eventNotes = "";
  statusName = "";
  eventDetail = {
    title: "", start: "", end: "", backgroundColor: "",
    extendedProps: {
      appointment_id: "",
      billable_item_id: "",
      claim_id: "",
      claim_number: "",
      claimant_id: "",
      claimant_name: "",
      description: null,
      email: null,
      exam_name: "",
      exam_procedure_id: "",
      exam_procedure_name: "",
      exam_procedure_type: "",
      examiner_id: null,
      examiner_name: "",
      is_deposition: null,
      location: "",
      phone_no_1: null,
      procedure_type: "",
      status: "",
      status_color: "",
      supervisor_id: null
    }
  }
  constructor(private cookieService: CookieService, private claimService: ClaimService, private router: Router, public dialogRef: MatDialogRef<EventdetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private examinerService: ExaminerService, private alertService: AlertService) {
    console.log(data.event)
    this.eventDetail = { title: data.event.title, start: data.event.start, end: data.event.end, backgroundColor: data.event.backgroundColor, extendedProps: data.event.extendedProps };
    dialogRef.disableClose = true;
    this.selectedEventColor = data.event.backgroundColor ? data.event.backgroundColor : "#3788d8";
    this.eventColor = data.event.backgroundColor ? data.event.backgroundColor : "#3788d8";;
    this.eventStatus = data.event.extendedProps.status;
    this.eventNotes = data.event.extendedProps.description;

    this.statusName = this.data.event.extendedProps.is_deposition ? 'deposition_status' : 'examination_status';
    console.log("dfdsff", data)
    if (this.statusName == 'deposition_status') {
      this.examinationStatus = data.deposition_status;
      this.getExaminationStatus(data.event.extendedProps)
    }
    if (this.statusName == 'examination_status') {
      this.examinationStatus = data.calendar_examination_status;
      this.getExaminationStatus(data.event.extendedProps)
    }
    this.event = data.event.extendedProps;
    this.examination_notes = data.event.extendedProps.description;
    // this.claimService.seedData(this.data.extendedProps.is_deposition ? 'deposition_status' : 'calendar_examination_status').subscribe(curres => {
    //   this.examinationStatus = curres.data;
    //   this.getExaminationStatus(data.extendedProps)
    // });
  }
  getExaminationStatus(data) {
    this.examinationStatus.map(res => {
      if (res.examination_status == data.status) {
        console.log("tes")
        this.examination_status = res.id;
        this.eventStatusID = res.id;
      }
    })
  }
  pickerOpened(p) { }
  saveEvent() {
    this.dialogRef.close(this.event)
  }
  changeDateType(date) {
    if (date) {
      let timezone = moment.tz.guess();
      return moment(date).tz(timezone).format('MM-DD-YYYY hh:mm A z')
    } else {
      return null
    }
  }
  edit() {
    this.textDisable = false;
    this.isEdit = true;
    this.examination_notes = this.eventNotes;
    this.examination_status = this.eventStatusID;
  }
  examination_notes = '';
  examination_status = null;
  selectedEventColor: any = "#3788d8";
  status = "";
  isUpdated: boolean = false;
  updateStatus() {
    let data = {
      id: this.event['appointment_id'],
      examination_status: this.examination_status,
      notes: this.examination_notes
    }
    this.examinerService.updateExaminationStatus(data).subscribe(res => {
      console.log("issue in cor", res)
      this.isUpdated = true;
      this.examinationStatus.map(exam => {
        console.log(exam)
        if (exam.id == res.data.examination_status) {
          Object.getOwnPropertyDescriptor(this.eventDetail.extendedProps.status, exam.examination_status);
          this.status = exam[this.statusName];
          this.eventStatus = exam.examination_status;
          // this.eventColor
        }
      })
      this.eventStatusID = res.data.examination_status;
      this.eventNotes = res.data.examination_notes;
      this.examination_status = res.data.examination_status;
      this.examination_notes = res.data.examination_notes;
      this.textDisable = true;
      this.isEdit = false;
      this.selectedEventColor = this.eventColor;
      this.eventDetail.backgroundColor = this.eventColor;
      this.alertService.openSnackBar(res.message, 'success');
    }, error => {
      this.alertService.openSnackBar(error.error.message, 'error');
    })
  }
  eventColor = "";
  eventcolorChange(examination) {
    this.eventColor = examination.color;
  }
  cancel() {
    this.examination_notes = this.eventNotes;
    this.examination_status = this.eventStatusID;
    this.textDisable = true;
    this.isEdit = false;
  }
  onNoClick(): void {
    console.log(this.isUpdated)
    this.eventDetail['isChange'] = this.isUpdated;
    this.dialogRef.close(this.eventDetail);
  }
  viewDetails(claim_id, billable_id, claimant_id) {
    let baseUrl = "";
    let role = this.cookieService.get('role_id')
    console.log(role)
    switch (role) {
      case '1':
        baseUrl = "/admin";
        break;
      case '2':
        baseUrl = "/subscriber/";
        break;
      case '3':
        baseUrl = "/subscriber/manager/";
        break;
      case '4':
        baseUrl = "/subscriber/staff/";
        break;
      case '11':
        baseUrl = "/subscriber/examiner/";
        break;
      default:
        baseUrl = "/admin";
        break;
    }
    this.router.navigate([baseUrl + "claimants/claimant/" + claimant_id + "/claim/" + claim_id + "/billable-item/" + billable_id]);
    // this.router.navigate([this.router.url + "/appointment-details", claim_id, billable_id]);
  }
}
