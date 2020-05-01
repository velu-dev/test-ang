import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrapPlugin from '@fullcalendar/bootstrap';
import timeGrigPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from '@fullcalendar/core';
@Component({
  selector: 'app-examination-calander-view',
  templateUrl: './examination-calander-view.component.html',
  styleUrls: ['./examination-calander-view.component.scss']
})
export class ExaminationCalanderViewComponent implements OnInit {
  options = {};
  @ViewChild("calendar", { static: false }) calendar: FullCalendarComponent;
  @ViewChild("picker", { static: false }) picker;
  calendarComponent: FullCalendarComponent;
  events: EventInput[] = [
    {
      title: "Will Smith",
      start: "2020-05-15T04:00:00.453Z",
      end: "2020-05-15T04:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Anthony Hopkins",
      start: "2020-05-16T05:00:00.453Z",
      end: "2020-05-16T06:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Paul Newman",
      start: "2020-05-18T07:00:00.453Z",
      end: "2020-05-18T07:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Charles Chaplin",
      start: "2020-05-20T08:00:00.453Z",
      end: "2020-05-20T08:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Johnny Depp",
      start: "2020-05-01T09:00:00.453Z",
      end: "2020-05-01T09:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "James Cagney",
      start: "2020-05-03T10:00:00.453Z",
      end: "2020-05-03T10:30:00.453Z",
      backgroundColor: "#FFC400"
    },
    {
      title: "Morgan Freeman",
      start: "2020-05-04T05:00:00.453Z",
      end: "2020-05-04T05:30:00.453Z",
      backgroundColor: "#FFC400"
    }, {
      title: "Henry Fonda",
      start: "2020-05-05T04:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Bruce Lee",
      start: "2020-05-05T05:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Steve McQueen",
      start: "2020-05-05T06:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "James Stewart",
      start: "2020-05-06T07:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Laurence Olivier",
      start: "2020-05-07T08:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      title: "Cary Grant",
      start: "2020-05-08T09:23:55.453Z",
      backgroundColor: "#72E396"
    },
    {
      start: '2020-02-09',
      end: '2020-02-09',
      rendering: 'background',
      overlap: false,
      color: '#f72222'
    },
    {
      title: "Spencer Tracy",
      start: "2020-05-10T10:23:55.453Z",
      backgroundColor: "#72E396"
    }, {
      title: "Shah Rukh Khan",
      start: "2020-05-11T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Leonardo DiCaprio",
      start: "2020-05-12T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Gregory Peck",
      start: "2020-05-13T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Sidney Poitier",
      start: "2020-05-14T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Daniel Day-Lewis",
      start: "2020-05-15T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      start: '2020-02-16',
      end: '2020-02-16',
      rendering: 'background',
      overlap: false,
      color: '#f72222'
    },
    {
      title: "Humphrey Bogart",
      start: "2020-05-16T09:23:55.453Z",
      backgroundColor: "#FF3366"
    },
    {
      title: "Tom Hanks",
      start: "2020-05-16T09:23:55.453Z",
      backgroundColor: "#FF3366"
    }]
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[];
  selectedDate = "";
  constructor() { }

  ngOnInit() {
    this.loadAllEvents();
    this.options = {
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

        startTime: '10:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
      },
      editable: true,
      customButtons: {
        myCustomButton: {
          text: "Select Date",
          click: () => this.picker.open()
        }
      },
      header: {
        left: 'prev next today',
        center: 'title',
        right: 'myCustomButton dayGridMonth,timeGridWeek,timeGridDay'
      },
      views: {
        timeGridFourDay: {
          type: 'timeGrid',
          duration: { days: 4 },
          buttonText: '4 day'
        }
      },
      plugins: [dayGridPlugin, interactionPlugin, timeGrigPlugin, bootstrapPlugin]

    }
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
}
