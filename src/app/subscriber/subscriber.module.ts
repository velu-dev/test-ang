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
import { SubscriberSettingsComponent, SignPopupComponent } from './subscriber-settings/subscriber-settings.component';
import { ManageUserComponent } from './manager/manage-user/manage-user.component';
import { ManageNewUserComponent } from './manager/manage-new-user/manage-new-user.component';
import { AppointmentComponent } from './examiner/appointment/appointment.component';
import { ClaimService } from './service/claim.service';
import { NewClaimComponent, InjuryDialog } from './components/claims/new-claim/new-claim.component';
import { BillableItemComponent } from './components/claims/billable-item/billable-item.component';
import { ClaimantComponent } from './components/claims/claimant/claimant.component';
import { ExaminerDashboardComponent } from './examiner/examiner-dashboard/examiner-dashboard.component';
import { ExaminerSettingComponent } from './examiner/examiner-setting/examiner-setting.component';
import { ExaminerManageAddressComponent } from './staff/examiner-manage-address/examiner-manage-address.component';
import { ExaminerListComponent } from './staff/examiner-list/examiner-list.component';
import { ExaminerService } from './service/examiner.service';
import { AppointmentDetailsComponent, ClaimantPopupComponent, ClaimPopupComponent, BillableitemPopupComponent } from './examiner/appointment-details/appointment-details.component';
import { ManageLocationComponent } from './components/manage-location/manage-location.component';
import { EditAddressComponent } from './staff/edit-address/edit-address.component';
import { ExaminationCalanderViewComponent, EventdetailDialog, } from './examiner/examination-calander-view/examination-calander-view.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EditClaimComponent } from './components/claims/edit-claim/edit-claim.component';
import { ClaimComponent } from './components/claims/common/claim/claim.component';
import { InjuryComponent, InjuryPopup } from './components/claims/common/injury/injury.component';
import { ClaimAdminComponent } from './components/claims/common/claim-admin/claim-admin.component';
import { EmployerComponent } from './components/claims/common/employer/employer.component';
import { ApplicationAttorneyComponent } from './components/claims/common/application-attorney/application-attorney.component';
import { DefenseAttorneyComponent } from './components/claims/common/defense-attorney/defense-attorney.component';
import { DeoComponent } from './components/claims/common/deo/deo.component';
import { CorrespondanceComponent } from './components/claims/common/correspondance/correspondance.component';
import { ClaimantDetailsComponent } from './components/claims/common/claimant-details/claimant-details.component';
import { UpdateBillableItemComponent } from './components/claims/common/update-billable-item/update-billable-item.component';
import { NewBillableItemComponent } from './components/claims/new-billable-item/new-billable-item.component';
import { BillingComponent } from './components/billing/billing.component';
import { NewBillingComponent, BillilgDialog } from './components/new-billing/new-billing.component';
import { EditBillingComponent } from './components/edit-billing/edit-billing.component';
import { DialogueComponent } from '../shared/components/dialogue/dialogue.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ClaimantAwaitingComponent } from './components/dashboard/claimant-awaiting/claimant-awaiting.component';
import { ClaimAwaitingComponent } from './components/dashboard/claim-awaiting/claim-awaiting.component';
import { BillableItemAwaitingComponent } from './components/dashboard/billable-item-awaiting/billable-item-awaiting.component';
import { UpcommingBillableItemComponent } from './components/dashboard/upcomming-billable-item/upcomming-billable-item.component';
import { UnfinishedReportComponent } from './components/dashboard/unfinished-report/unfinished-report.component';
import { BillingCollectionComponent } from './components/dashboard/billing-collection/billing-collection.component';
import { SubscriberService } from './service/subscriber.service';
import { NewExaminerUserComponent, LicenseDialog } from './components/new-examiner-user/new-examiner-user.component';
import { ExistingServiceLocationsComponent } from './components/existing-service-locations/existing-service-locations.component';
import { AddEditServiceLocationComponent } from './components/add-edit-service-location/add-edit-service-location.component';
import { HistoryComponent } from './examiner/appointment-details/history/history.component';
import { RecordsComponent } from './examiner/appointment-details/records/records.component';
import { ExaminationComponent } from './examiner/appointment-details/examination/examination.component';
import { ReportComponent } from './examiner/appointment-details/report/report.component';
import { BillingCorrespondanceComponent } from './examiner/appointment-details/correspondance/correspondance.component';
import { BilllableBillingComponent } from './examiner/appointment-details/billing/billing.component';
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
    ExaminerDashboardComponent,
    ExaminerSettingComponent,
    ExaminerManageAddressComponent,
    ExaminerListComponent,
    AppointmentDetailsComponent,
    ManageLocationComponent,
    ClaimantPopupComponent,
    ClaimPopupComponent,
    BillableitemPopupComponent,
    EditAddressComponent,
    ExaminationCalanderViewComponent,
    EditClaimComponent,
    ClaimComponent,
    InjuryComponent,
    ClaimAdminComponent,
    EmployerComponent,
    ApplicationAttorneyComponent,
    DefenseAttorneyComponent,
    DeoComponent,
    CorrespondanceComponent,
    ClaimantDetailsComponent,
    UpdateBillableItemComponent,
    InjuryPopup,
    InjuryDialog,
    NewBillableItemComponent,
    BillingComponent,
    NewBillingComponent,
    EditBillingComponent,
    BillilgDialog,
    SignPopupComponent,
    EventdetailDialog,
    ClaimantAwaitingComponent,
    ClaimAwaitingComponent,
    BillableItemAwaitingComponent,
    UpcommingBillableItemComponent,
    UnfinishedReportComponent,
    BillingCollectionComponent,
    NewExaminerUserComponent,
    LicenseDialog,
    ExistingServiceLocationsComponent,
    AddEditServiceLocationComponent,
    BillingCorrespondanceComponent,
    HistoryComponent,
    RecordsComponent,
    ExaminationComponent,
    ReportComponent,
    BilllableBillingComponent
  ],
  entryComponents: [
    ClaimantPopupComponent,
    ClaimPopupComponent,
    BillableitemPopupComponent,
    InjuryPopup,
    InjuryDialog,
    BillilgDialog,
    SignPopupComponent,
    EventdetailDialog,
    LicenseDialog

  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    SharedModule,
    FullCalendarModule,
    ImageCropperModule
  ],
  providers: [SubscriberUserService, ClaimService, ExaminerService, SubscriberService]
})
export class SubscriberModule { }
