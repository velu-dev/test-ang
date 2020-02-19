import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';


const routes: Routes = [{
  path: "dashboard",
  component: DashboardComponent
}, {
  path: "admin-users",
  children: [{
    path: "",
    component: AdminUserComponent
  }

  ]
}, {
  path: "users",
  children: [{
    path: "",
    component: UserComponent
  },
  {
    path: "new",
    component: NewUserComponent
  },
  {
    path: ":id",
    component: NewUserComponent
  }
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
