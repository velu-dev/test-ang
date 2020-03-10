import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberRoutingModule } from './subscriber-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { SubscriberUserService } from './service/subscriber-user.service';
import { SubscriberSettingsComponent } from './subscriber-settings/subscriber-settings.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    NewUserComponent,
    SubscriberSettingsComponent,
    ManagerDashboardComponent,
    StaffDashboardComponent,
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    SharedModule
  ],
  providers: [SubscriberUserService]
})
export class SubscriberModule { }
