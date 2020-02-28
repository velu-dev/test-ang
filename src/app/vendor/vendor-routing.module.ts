import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { SettingsComponent } from '../vendor/components/settings/settings.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [{
  path: "dashboard",
  component: DashboardComponent
}, {
  path: "users",
  children: [{
    path: "",
    component: UserComponent
  }]
}, {
  path: "settings",
  component: SettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
