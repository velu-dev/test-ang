import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { UserService } from './services/user.service';
import { NewUserComponent } from './components/new-user/new-user.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { ServiceRequestDetailsComponent, ServiceDialog } from './components/service-request-details/service-request-details.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    NewUserComponent,
    AdminUserComponent,
    ProfileComponent,
    SettingsComponent,
    VendorsComponent,
    ServiceRequestComponent,
    ServiceRequestDetailsComponent,
    ServiceDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    
  ],
  entryComponents: [
    ServiceDialog
  ],
  providers: [UserService]
})
export class AdminModule { }
