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
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
