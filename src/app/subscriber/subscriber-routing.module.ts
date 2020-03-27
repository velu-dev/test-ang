import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { SubscriberSettingsComponent } from './subscriber-settings/subscriber-settings.component';
import { ManageUserComponent } from './manager/manage-user/manage-user.component';
import { ManageNewUserComponent } from './manager/manage-new-user/manage-new-user.component';
import { ClaimListComponent } from './components/claims/claim-list/claim-list.component';
import { NewClaimantComponent } from './components/claims/new-claimant/new-claimant.component';
import { NewClaimComponent } from './components/claims/new-claim/new-claim.component';
import { BillableItemComponent } from './components/claims/billable-item/billable-item.component';
import { ClaimantComponent } from './components/claims/claimant/claimant.component';
import { ExaminerDashboardComponent } from './examiner/examiner-dashboard/examiner-dashboard.component';
import { ExaminerSettingComponent } from './examiner/examiner-setting/examiner-setting.component';
import { AppointmentComponent } from './examiner/appointment/appointment.component';

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
},
{
  path: "claimant",
  component: ClaimantComponent
}, {
  path: "billable-item",
  component: BillableItemComponent
},
{
  path: "claims",
  children: [{
    path: "",
    component: ClaimListComponent
  }, {
    path: "new-claimant",
    component: NewClaimantComponent
  }, {
    path: "new-claim",
    component: NewClaimComponent
  }, {
    path: "new-billable-item",
    component: BillableItemComponent
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
}, {
  path: "examiner",
  children: [{
    path: "",
    component: ExaminerDashboardComponent
  }, {
    path: "dashboard",
    component: ExaminerDashboardComponent
  },
  {
    path: "appointment",
    component: AppointmentComponent
  }, {
    path: "settings",
    component: ExaminerSettingComponent
  }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
