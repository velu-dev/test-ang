import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistorianDashboardComponent } from './components/historian/historian-dashboard/historian-dashboard.component';
import { HistorianUserComponent } from './components/historian/historian-user/historian-user.component';
import { HistorianNewUserComponent } from './components/historian/historian-new-user/historian-new-user.component';
import { SummarizerDashboardComponent } from './components/summarizer/summarizer-dashboard/summarizer-dashboard.component';
import { SummarizerUserComponent } from './components/summarizer/summarizer-user/summarizer-user.component';
import { SummarizerNewUserComponent } from './components/summarizer/summarizer-new-user/summarizer-new-user.component';
import { TranscriberDashboardComponent } from './components/transcriber/transcriber-dashboard/transcriber-dashboard.component';
import { TranscriberUserComponent } from './components/transcriber/transcriber-user/transcriber-user.component';
import { TranscriberNewUserComponent } from './components/transcriber/transcriber-new-user/transcriber-new-user.component';
import { HistoryStaffDashboardComponent } from './components/historian-staff/history-staff-dashboard/history-staff-dashboard.component';
import { SummaryStaffDashboardComponent } from './components/summarizer-staff/summary-staff-dashboard/summary-staff-dashboard.component';
import { TranscriberStaffDashboardComponent } from './components/transcriber-staff/transcriber-staff-dashboard/transcriber-staff-dashboard.component';
import { HistorianSettingsComponent } from './components/historian/historian-settings/historian-settings.component';

const routes: Routes = [{
  path: "historian",
  children: [{
    path: "",
    component: HistorianDashboardComponent
  }, {
    path: "dashboard",
    component: HistorianDashboardComponent
  }, {
    path: "users",
    children: [{
      path: "",
      component: HistorianUserComponent
    }, {
      path: "new",
      component: HistorianNewUserComponent
    }]
  }, {
    path: "settings",
    component: HistorianSettingsComponent
  },
  {
    path: "staff",
    children: [
      {
        path: "",
        component: HistoryStaffDashboardComponent
      },
      {
        path: "dashboard",
        component: HistoryStaffDashboardComponent
      }
    ]
  }]
}, {
  path: "summarizer",
  children: [{
    path: "",
    component: SummarizerDashboardComponent
  }, {
    path: "dashboard",
    component: SummarizerDashboardComponent
  }, {
    path: "users",
    children: [{
      path: "",
      component: SummarizerUserComponent
    }, {
      path: "new",
      component: SummarizerNewUserComponent
    }]
  }, {
    path: "staff",
    children: [
      {
        path: "",
        component: SummaryStaffDashboardComponent
      },
      {
        path: "dashboard",
        component: SummaryStaffDashboardComponent
      }
    ]
  }]
},
{
  path: "transcriber",
  children: [{
    path: "",
    component: TranscriberDashboardComponent
  }, {
    path: "dashboard",
    component: TranscriberDashboardComponent
  }, {
    path: "users",
    children: [{
      path: "",
      component: TranscriberUserComponent
    }, {
      path: "new",
      component: TranscriberNewUserComponent
    }]
  }, {
    path: "staff",
    children: [
      {
        path: "",
        component: TranscriberStaffDashboardComponent
      },
      {
        path: "dashboard",
        component: TranscriberStaffDashboardComponent
      }
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
