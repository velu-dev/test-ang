import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { ClaimListComponent } from './components/claims/claim-list/claim-list.component';
import { NewClaimentComponent } from './components/claims/claiment/new-claiment/new-claiment.component';
import { ClaimentComponent } from './components/claims/claiment/claiment.component';
import { NewClaimComponent } from './components/claims/new-claim/new-claim.component';


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
}, {
  path: "claiment",
  children: [{
    path: "",
    component: ClaimentComponent
  }, {
    path: "new",
    component: NewClaimentComponent
  }]
},{
  path: "claims",
  children: [{
    path: "",
    component: ClaimListComponent
  }, {
    path: "new",
    component: NewClaimComponent
  }]
}, {
  path: "staff",
  children: [
    {
      path: "",
      component: StaffDashboardComponent
    }, {
      path: "dashboard",
      component: StaffDashboardComponent
    }]
}, {
  path: "manager",
  children: [{
    path: "",
    component: ManagerDashboardComponent
  }, {
    path: "dashboard",
    component: ManagerDashboardComponent
  }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
