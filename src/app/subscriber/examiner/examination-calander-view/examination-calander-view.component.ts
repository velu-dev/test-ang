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
@Component({
  selector: 'app-examination-calander-view',
  templateUrl: './examination-calander-view.component.html',
  styleUrls: ['./examination-calander-view.component.scss']
})
export class ExaminationCalanderViewComponent implements OnInit {
  options: any = {
    height: "parent",
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

      startTime: '10:00', // a start time (10am in this example)
      endTime: '18:00', // an end time (6pm in this example)
    },
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
      month: {
        eventLimit: 1
      },
      timeGrid: { eventLimit: 4 },
      timeGridFourDay: {
        type: 'timeGrid',
        duration: { days: 4 },
        buttonText: '4 day'
      }
    },
    plugins: [dayGridPlugin, interactionPlugin, timeGrigPlugin, bootstrapPlugin]

  }
  @ViewChild("calendar", { static: false }) calendar: FullCalendarComponent;
  @ViewChild("intake", { static: false }) intake;
  // calendarComponent: FullCalendarComponent;
  events: EventInput[] = [
    {
      title: "Will Smith",
      start: "2020-09-28T04:00:00.453Z",
      end: "2020-09-28T04:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Will Smith",
      start: "2020-09-28T04:00:00.453Z",
      end: "2020-09-28T04:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Anthony Hopkins",
      start: "2020-09-28T05:00:00.453Z",
      end: "2020-09-28T09:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Paul Newman",
      start: "2020-09-28T07:00:00.453Z",
      end: "2020-09-28T07:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Paul Newman",
      start: "2020-09-28T07:00:00.453Z",
      end: "2020-09-28T07:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Paul Newman",
      start: "2020-09-28T07:00:00.453Z",
      end: "2020-09-28T07:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Paul Newman",
      start: "2020-09-02T07:00:00.453Z",
      end: "2020-09-02T07:30:00.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Paul Newman",
      start: "2020-09-03T07:00:00.453Z",
      end: "2020-09-03T07:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Paul Newman",
      start: "2020-09-04T07:00:00.453Z",
      end: "2020-09-04T07:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Charles Chaplin",
      start: "2020-09-30T08:00:00.453Z",
      end: "2020-09-30T08:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Johnny Depp",
      start: "2020-09-27T09:00:00.453Z",
      end: "2020-09-27T09:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "James Cagney",
      start: "2020-09-28T10:00:00.453Z",
      end: "2020-09-28T10:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Morgan Freeman",
      start: "2020-09-29T05:00:00.453Z",
      end: "2020-09-29T05:50:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Morgan George",
      start: "2020-09-07T05:00:00.453Z",
      end: "2020-09-08T05:50:00.453Z",
      backgroundColor: "#FFC400"
    }, {
      title: "Henry Fonda",
      start: "2020-09-05T30:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Bruce Lee",
      start: "2020-09-30T05:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Steve McQueen",
      start: "2020-09-29T09:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "James Stewart",
      start: "2020-09-29T07:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Laurence Olivier",
      start: "2020-09-29T08:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Cary Grant",
      start: "2020-09-29T09:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      start: '2020-09-08',
      end: '2020-09-08',
      rendering: 'background',
      overlap: false,
      color: '#f72222'
    },
    {
      title: "Spencer Tracy",
      start: "2020-09-26T10:23:55.453Z",
      backgroundColor: "#72E396"
    }, {
      title: "Shah Rukh Khan",
      start: "2020-09-21T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Leonardo DiCaprio",
      start: "2020-09-30T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Gregory Peck",
      start: "2020-09-29T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Sidney Poitier",
      start: "2020-09-28T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Daniel Day-Lewis",
      start: "2020-09-27T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      start: '2020-09-28',
      end: '2020-09-28',
      rendering: 'background',
      overlap: false,
      color: '#f72222'
    },
    {
      title: "Humphrey Bogart",
      start: "2020-09-15T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Tom Hanks",
      start: "2020-09-16T09:23:55.453Z",
      backgroundColor: "#FF3366"
    }]
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[];
  selectedDate = "";
  examinars = [];
  constructor(public dialog: MatDialog, public examinarService: ExaminerService) {
    this.examinarService.getExaminerList().subscribe(res => {
      console.log("examinars", res.data)
      this.examinars = res.data;
    })
  }

  ngOnInit() {
    this.loadAllEvents();

  }
  loadAllEvents() {
    this.calendarEvents = [];
    // this.events = this.clients[0].events;
    // this.selectedClient = "All";

    // this.clients.map(res => {
    //   // res.events.map(event => {
    //   this.events.concat(res.events);
    //   // });
    // });
    this.calendarEvents = this.events;
  }
  selectExaminer(examiner?) {
    if (examiner) {
      console.log(examiner);
    } else {
      console.log("All")
    }
  }
  handleEventClick(e) {
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
    const dialogRef = this.dialog.open(EventdetailDialog, {
      width: '550px',
      data: { title: e.event.title, start: e.event.start, end: e.event.end }
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
  event = { title: "", start: "", end: "", location: "" }
  isEdit = false;
  constructor(public dialogRef: MatDialogRef<EventdetailDialog>,
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
}
