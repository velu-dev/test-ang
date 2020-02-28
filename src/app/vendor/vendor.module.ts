import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './components/settings/settings.component';
import { UserService } from './service/user.service';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SettingsComponent,
    UserComponent,
    NewUserComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    SharedModule
  ],
  providers: [UserService]
})
export class VendorModule { }
