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
  clients = [
    {
      name: "Robert De Niro",
      events: [
        {
          start: '2020-02-03',
          end: '2020-02-03',
          rendering: 'background',
          overlap: false,
          color: '#f72222'
        },
        {
          title: "Will Smith",
          start: "2019-11-15T04:00:00.453Z",
          end: "2019-11-15T04:30:00.453Z",
          backgroundColor: "#c3c4b1"
        },
        {
          title: "Anthony Hopkins",
          start: "2019-11-15T05:00:00.453Z",
          end: "2019-11-15T06:30:00.453Z",
          backgroundColor: "#c3c4b1"
        },
        {
          title: "Paul Newman",
          start: "2019-11-15T07:00:00.453Z",
          end: "2019-11-15T07:30:00.453Z",
          backgroundColor: "#c3c4b1"
        },
        {
          title: "Charles Chaplin",
          start: "2019-11-15T08:00:00.453Z",
          end: "2019-11-15T08:30:00.453Z",
          backgroundColor: "#c3c4b1"
        },
        {
          title: "Johnny Depp",
          start: "2019-11-15T09:00:00.453Z",
          end: "2019-11-15T09:30:00.453Z",
          backgroundColor: "#c3c4b1"
        },
        {
          title: "James Cagney",
          start: "2019-11-15T10:00:00.453Z",
          end: "2019-11-15T10:30:00.453Z",
          backgroundColor: "#c3c4b1"
        },
        {
          title: "Morgan Freeman",
          start: "2019-11-15T11:00:00.453Z",
          end: "2019-11-15T11:30:00.453Z",
          backgroundColor: "#c3c4b1"
        }
      ],
      availability: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

        startTime: '12:00', // a start time (10am in this example)
        endTime: '15:00', // an end time (6pm in this example)
      }
    },
    {
      name: "Marlon Brando",
      events: [
        {
          title: "Henry Fonda",
          start: "2019-11-01T04:23:55.453Z",
          backgroundColor: "#9bc4bb"
        },
        {
          title: "Bruce Lee",
          start: "2019-11-02T05:23:55.453Z",
          backgroundColor: "#9bc4bb"
        },
        {
          title: "Steve McQueen",
          start: "2019-11-03T06:23:55.453Z",
          backgroundColor: "#9bc4bb"
        },
        {
          title: "James Stewart",
          start: "2019-11-04T07:23:55.453Z",
          backgroundColor: "#9bc4bb"
        },
        {
          title: "Laurence Olivier",
          start: "2019-11-05T08:23:55.453Z",
          backgroundColor: "#9bc4bb"
        },
        {
          title: "Cary Grant",
          start: "2019-11-06T09:23:55.453Z",
          backgroundColor: "#9bc4bb"
        },
        {
          start: '2020-02-18',
          end: '2020-02-18',
          rendering: 'background',
          overlap: false,
          color: '#f72222'
        },
        {
          title: "Spencer Tracy",
          start: "2019-11-07T10:23:55.453Z",
          backgroundColor: "#9bc4bb"
        }
      ],
      availability: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [1, 2, 5], // Monday - Thursday

        startTime: '9:00', // a start time (10am in this example)
        endTime: '17:00', // an end time (6pm in this example)
      }
    },

    {
      name: " Clark Gable",
      events: [
        {
          title: "Shah Rukh Khan",
          start: "2019-11-13T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        },
        {
          title: "Leonardo DiCaprio",
          start: "2019-11-14T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        },
        {
          title: "Gregory Peck",
          start: "2019-11-15T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        },
        {
          title: "Sidney Poitier",
          start: "2019-11-16T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        },
        {
          title: "Daniel Day-Lewis",
          start: "2019-11-17T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        },
        {
          start: '2020-02-13',
          end: '2020-02-13',
          rendering: 'background',
          overlap: false,
          color: '#f72222'
        },
        {
          title: "Humphrey Bogart",
          start: "2019-11-18T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        },
        {
          title: "Tom Hanks",
          start: "2019-11-19T09:23:55.453Z",
          backgroundColor: "#dbd18f"
        }
      ],
      availability: {
        daysOfWeek: [1, 4, 5], // Monday - Thursday
        startTime: '10:00', // a start time (10am in this example)
        endTime: '16:00', // an end time (6pm in this example)
      }
    }
  ];
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[];
  selectedDate = "";
  constructor() { }

  ngOnInit() {
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
        right: 'prev next today',
        left: 'title',
        center: 'myCustomButton dayGridMonth,timeGridWeek,timeGridDay'
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

}
