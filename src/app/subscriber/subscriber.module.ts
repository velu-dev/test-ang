import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberRoutingModule } from './subscriber-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { ClaimListComponent } from './components/claims/claim-list/claim-list.component';
import { NewClaimantComponent } from './components/claims/new-claimant/new-claimant.component';
import { SubscriberUserService } from './service/subscriber-user.service';
import { SubscriberSettingsComponent } from './subscriber-settings/subscriber-settings.component';
import { ManageUserComponent } from './manager/manage-user/manage-user.component';
import { ManageNewUserComponent } from './manager/manage-new-user/manage-new-user.component';
import { AppointmentComponent } from './examinor/appointment/appointment.component';
import { ClaimService } from './service/claim.service';
import { NewClaimComponent } from './components/claims/new-claim/new-claim.component';
import { BillableItemComponent } from './components/claims/billable-item/billable-item.component';
import { ClaimantComponent } from './components/claims/claimant/claimant.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    NewUserComponent,
    SubscriberSettingsComponent,
    ManagerDashboardComponent,
    StaffDashboardComponent,
    ManageUserComponent,
    ManageNewUserComponent,
    AppointmentComponent,
    ClaimListComponent,
    ClaimListComponent,
    NewClaimantComponent,
    ManageUserComponent,
    ManageNewUserComponent,
    NewClaimComponent,
    BillableItemComponent,
    ClaimantComponent,
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    SharedModule
  ],
  providers: [SubscriberUserService, ClaimService]
})
export class SubscriberModule { }
