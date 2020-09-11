import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { ServiceRequestDetailsComponent } from './components/service-request-details/service-request-details.component';


const routes: Routes = [{
  path: "dashboard",
  component: DashboardComponent
}, {
  path: "admin-users",
  children: [{
    path: "",
    component: AdminUserComponent,
    data: { breadcrumb: "Users" }
  },
  {
    path: "new",
    component: NewUserComponent,
    data: { breadcrumb: "New" }
  },
  {
    path: ":id",
    component: NewUserComponent,
    data: { breadcrumb: "User" }
  }]
}, {
  path: "users",
  children: [{
    path: "",
    component: UserComponent,
    data: { breadcrumb: "Users" }
  },
  {
    path: "new",
    component: NewUserComponent,
    data: { breadcrumb: "New" }
  },
  {
    path: ":id",
    component: NewUserComponent,
    data: { breadcrumb: "User" }
  }
  ]
}, {
  path: "vendors",
  children: [{
    path: "",
    component: VendorsComponent,
    data: { breadcrumb: "Vendors" }
  }, {
    path: "new",
    component: NewUserComponent,
    data: { breadcrumb: "New" }
  }]
}, {
  path: "profile",
  component: ProfileComponent
}, {
  path: "settings",
  component: SettingsComponent
},
{
  path: "service-request",
  children: [
    {
      path: "",
      component: ServiceRequestComponent,
      data: { breadcrumb: "Service Requests" }
    },
    {
      path: ":id",
      component: ServiceRequestDetailsComponent,
      data: { breadcrumb: "Service Request" }
    },
  ]
},
{
  path: "",
  component: DashboardComponent
}, {
  path: "**",
  component: NotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
