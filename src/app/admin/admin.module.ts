import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { UserService } from './services/user.service';
import { NewUserComponent } from './components/new-user/new-user.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    NewUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  providers: [UserService]
})
export class AdminModule { }
