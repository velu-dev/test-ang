import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriberRoutingModule } from './subscriber-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    NewUserComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    SharedModule
  ]
})
export class SubscriberModule { }
