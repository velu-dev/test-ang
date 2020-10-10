import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FullCalendarComponent } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from '@fullcalendar/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { DialogData } from 'src/app/shared/components/dialogue/dialogue.component';
import { ExaminerService } from '../../service/examiner.service';
import { formatDate } from '@angular/common';
import { OWL_DATE_TIME_FORMATS, DateTimeAdapter, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-examination-calander-view',
  templateUrl: './examination-calander-view.component.html',
  styleUrls: ['./examination-calander-view.component.scss']
})
export class ExaminationCalanderViewComponent implements OnInit {
  options: any = {
    // height: "parent",
    // businessHours: {
    // days of week. an array of zero-based day of week integers (0=Sunday)
    // daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

    // startTime: '10:00', // a start time (10am in this example)
    // endTime: '18:00', // an end time (6pm in this example)
    // },
    editable: false,
    customButtons: {
      myCustomButton: {
        text: "Select Date",
        click: () => this.intake.open()
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
        eventLimit: 3 // adjust to 6 only for timeGridWeek/timeGridDay
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
  constructor(public dialog: MatDialog, public examinarService: ExaminerService) {
    this.examinarService.getCalendarEvent().subscribe(event => {
      let eventSource = [];
      event.data.map(res => {
        eventSource.push({
          title: res.title,
          start: res.start,
          end: res.end,
          extendedProps: res
        })
      });
      this.calendarEvents = eventSource;
    })
    this.examinarService.getExaminerList().subscribe(res => {
      this.examinars = res.data;
    })
  }

  ngOnInit() {
    // this.loadAllEvents();

  }
  // loadAllEvents() {
  //   let Alldata = [];
  //   this.data.map(da => {
  //     Alldata.push(da.data)
  //   })
  //   this.calendarEvents = [].concat.apply([], Alldata);
  // }
  selectExaminer(examiner?, index?) {
    //   this.calendar.getApi().removeAllEvents();
    //   if (examiner) {
    //     console.log(examiner);
    //   } else {
    //     console.log("All")
    //     this.loadAllEvents();
    //   }
    //   let event = [];
    //   this.data.map(res => {
    //     if (res.id == index) {
    //       event = res.data;
    //     }
    //   });
    //   event.map(ev => {
    //     console.log(ev)
    //     this.calendar.getApi().addEvent(ev);
    //   })
  }
  handleEventClick(e) {
    console.log(e)
    this.openEventDetailDialog(e);
  }
  handleDateClick(e) {
    // this.openAddEventDialog(e);
  }
  dateChanged() {
    console.log("fdfdsffs", new Date(this.selectedDate))
    this.calendar.getApi().gotoDate(new Date(this.selectedDate))
    this.calendar.getApi().changeView("timeGridDay")
  }

  openEventDetailDialog(e): void {
    console.log(e.event)
    const dialogRef = this.dialog.open(EventdetailDialog, {
      width: '550px',
      data: e.event.extendedProps
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        e.event.remove();
        result.start = new Date(result.start)
        result.end = new Date(result.end)
        // this.calendarEvents = this.calendarEvents.concat(result);
        this.calendar.getApi().addEvent(result)
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
  // display: {
  //   dateInput: 'input',
  //   monthYearLabel: { year: 'numeric', month: 'short' },
  //   dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  //   monthYearA11yLabel: { year: 'numeric', month: 'long' }
  // }
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
  event = { title: "", start: "", location: "", examiner_name: "", claimant_name: "", exam_procedure_name: "", exam_name: "", claim_number: "", status: "", phone_no_1: "", email: "", description: "", }
  isEdit = false;
  textDisable: boolean = true;
  constructor(private router: Router, public dialogRef: MatDialogRef<EventdetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)
    this.event = data;
  }
  onNoClick(): void {
    this.dialogRef.close();
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
  viewDetails() {
    this.router.navigate([this.router.url + "/appointment-details", 2, 7]);
  }
}
