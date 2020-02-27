import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    SharedModule
  ]
})
export class VendorModule { }
