import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { SettingsComponent } from '../vendor/components/settings/settings.component';

const routes: Routes = [{
  path: "dashboard",
  component: DashboardComponent
}, {
  path: "settings",
  component: SettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
