import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriberRoutingModule } from './subscriber-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { ClaimentComponent } from './components/claims/claiment/claiment.component';
import { NewClaimentComponent } from './components/claims/claiment/new-claiment/new-claiment.component';
import { ClaimListComponent } from './components/claims/claim-list/claim-list.component';
import { NewClaimComponent } from './components/claims/new-claim/new-claim.component';
import { SubscriberUserService } from './service/subscriber-user.service';
import { ManagerSettingsComponent } from './manager/manager-settings/manager-settings.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    NewUserComponent,
    SettingsComponent,
    ManagerDashboardComponent,
    StaffDashboardComponent,
    ClaimentComponent,
    NewClaimentComponent,
    ClaimListComponent,
    NewClaimComponent,
    ManagerSettingsComponent
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    SharedModule
  ],
  providers: [SubscriberUserService]
})
export class SubscriberModule { }
