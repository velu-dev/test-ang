import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { ClaimListComponent } from './components/claims/claim-list/claim-list.component';
import { NewClaimentComponent } from './components/claims/claiment/new-claiment/new-claiment.component';
import { ClaimentComponent } from './components/claims/claiment/claiment.component';
import { NewClaimComponent } from './components/claims/new-claim/new-claim.component';
import { SubscriberSettingsComponent } from './subscriber-settings/subscriber-settings.component';
import { ManageUserComponent } from './manager/manage-user/manage-user.component';
import { ManageNewUserComponent } from './manager/manage-new-user/manage-new-user.component';


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
  component: SubscriberSettingsComponent
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
    }, {
      path: "settings",
      component: SubscriberSettingsComponent
    }]
}, {
  path: "manager",
  children: [{
    path: "",
    component: ManagerDashboardComponent
  }, {
    path: "dashboard",
    component: ManagerDashboardComponent
  }, {
    path: "staff",
    children: [{
      path: "",
      component: ManageUserComponent
    }, {
      path: "new",
      component: ManageNewUserComponent
    }]
  }, {
    path: "settings",
    component: SubscriberSettingsComponent
  }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
