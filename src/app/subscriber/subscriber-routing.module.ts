import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SettingsComponent } from './components/settings/settings.component';


const routes: Routes = [{
  path: "dashboard",
  component: DashboardComponent
}, {
  path: "",
  component: DashboardComponent
}, {
  path: "users",
  children: [{
    path: "",
    component: UserComponent
  }, {
    path: "new",
    component: NewUserComponent
  }, {
    path: ":id",
    component: NewUserComponent
  }]
}, {
  path: "settings",
  component: SettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
