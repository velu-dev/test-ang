import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRoutingModule } from './vendor-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './service/user.service';
import { HistorianDashboardComponent } from './components/historian/historian-dashboard/historian-dashboard.component';
import { HistorianNewUserComponent } from './components/historian/historian-new-user/historian-new-user.component';
import { HistorianSettingsComponent } from './components/historian/historian-settings/historian-settings.component';
import { HistorianUserComponent } from './components/historian/historian-user/historian-user.component';
import { SummarizerDashboardComponent } from './components/summarizer/summarizer-dashboard/summarizer-dashboard.component';
import { SummarizerNewUserComponent } from './components/summarizer/summarizer-new-user/summarizer-new-user.component';
import { SummarizerSettingsComponent } from './components/summarizer/summarizer-settings/summarizer-settings.component';
import { SummarizerUserComponent } from './components/summarizer/summarizer-user/summarizer-user.component';
import { TranscriberDashboardComponent } from './components/transcriber/transcriber-dashboard/transcriber-dashboard.component';
import { TranscriberNewUserComponent } from './components/transcriber/transcriber-new-user/transcriber-new-user.component';
import { TranscriberSettingsComponent } from './components/transcriber/transcriber-settings/transcriber-settings.component';
import { TranscriberUserComponent } from './components/transcriber/transcriber-user/transcriber-user.component';
import { HistoryStaffDashboardComponent } from './components/historian-staff/history-staff-dashboard/history-staff-dashboard.component';
import { SummaryStaffDashboardComponent } from './components/summarizer-staff/summary-staff-dashboard/summary-staff-dashboard.component';
import { TranscriberStaffDashboardComponent } from './components/transcriber-staff/transcriber-staff-dashboard/transcriber-staff-dashboard.component';
import { VendorSettingsComponent } from './components/vendor-settings/vendor-settings.component';


@NgModule({
  declarations: [
    HistorianDashboardComponent,
    HistorianNewUserComponent,
    HistorianSettingsComponent,
    HistorianUserComponent,
    SummarizerDashboardComponent,
    SummarizerNewUserComponent,
    SummarizerSettingsComponent,
    SummarizerUserComponent,
    TranscriberDashboardComponent,
    TranscriberNewUserComponent,
    TranscriberSettingsComponent,
    TranscriberUserComponent,
    HistoryStaffDashboardComponent,
    SummaryStaffDashboardComponent,
    TranscriberStaffDashboardComponent,
    VendorSettingsComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    SharedModule
  ],
  providers: [UserService]
})
export class VendorModule { }
