import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard/manager-dashboard.component';
import { SubscriberSettingsComponent } from './subscriber-settings/subscriber-settings.component';
import { ManageUserComponent } from './manager/manage-user/manage-user.component';
import { ManageNewUserComponent } from './manager/manage-new-user/manage-new-user.component';
import { ClaimListComponent } from './components/claims/claim-list/claim-list.component';
import { NewClaimantComponent } from './components/claims/new-claimant/new-claimant.component';
import { NewClaimComponent } from './components/claims/new-claim/new-claim.component';
import { BillableItemComponent } from './components/claims/billable-item/billable-item.component';
import { ClaimantComponent } from './components/claims/claimant/claimant.component';
import { ExaminerDashboardComponent } from './examiner/examiner-dashboard/examiner-dashboard.component';
import { ExaminerSettingComponent } from './examiner/examiner-setting/examiner-setting.component';
import { AppointmentComponent } from './examiner/appointment/appointment.component';
import { ExaminerManageAddressComponent } from './staff/examiner-manage-address/examiner-manage-address.component';
import { ExaminerListComponent } from './staff/examiner-list/examiner-list.component';
import { AppointmentDetailsComponent } from './examiner/appointment-details/appointment-details.component';
import { ManageLocationComponent } from './staff/manage-location/manage-location.component';

const routes: Routes = [{
  path: "dashboard",
  component: DashboardComponent
}, {
  path: "",
  component: DashboardComponent
}, {
  path: "users",
  children: [{
    path: "",
    component: UserComponent
  }, {
    path: "new",
    component: NewUserComponent
  }, {
    path: ":id",
    component: NewUserComponent
  }]
}, {
  path: "settings",
  component: SubscriberSettingsComponent
},
{
  path: "claimant",
  component: ClaimantComponent
}, {
  path: "billable-item",
  component: BillableItemComponent
},
{
  path: "claims",
  children: [{
    path: "",
    component: ClaimListComponent
  }, {
    path: "new-claimant",
    component: NewClaimantComponent
  }, {
    path: "new-claim",
    component: NewClaimComponent
  }, {
    path: ":id",
    component: NewClaimComponent
  }, {
    path: "new-billable-item",
    component: BillableItemComponent
  }]
}, {
  path: "staff",
  children: [
    {
      path: "",
      component: StaffDashboardComponent
    }, {
      path: "dashboard",
      component: StaffDashboardComponent
    },
    {
      path: "manage-address",
      component: ExaminerManageAddressComponent
    },
    {
      path: "claimant",
      component: ClaimantComponent
    }, {
      path: "billable-item",
      component: BillableItemComponent
    },
    {
      path: "claims",
      children: [{
        path: "",
        component: ClaimListComponent
      }, {
        path: "new-claimant",
        component: NewClaimantComponent
      }, {
        path: "new-claim",
        component: NewClaimComponent
      }, {
        path: ":id",
        component: NewClaimComponent
      }]
    },
    {
      path: "manage-location",
      component: ManageLocationComponent
    },
    {
      path: "examiner-list",
      component: ExaminerListComponent
    }, {
      path: "settings",
      component: SubscriberSettingsComponent
    }]
}, {
  path: "manager",
  children: [{
    path: "",
    component: ManagerDashboardComponent
  }, {
    path: "dashboard",
    component: ManagerDashboardComponent
  }, {
    path: "claimant",
    component: ClaimantComponent
  }, {
    path: "billable-item",
    component: BillableItemComponent
  }, {
    path: "claims",
    children: [{
      path: "",
      component: ClaimListComponent
    }, {
      path: "new-claimant",
      component: NewClaimantComponent
    }, {
      path: "new-claim",
      component: NewClaimComponent
    }, {
      path: ":id",
      component: NewClaimComponent
    }, {
      path: "new-billable-item",
      component: BillableItemComponent
    }]
  }, {
    path: "manage-location",
    component: ManageLocationComponent
  },
  {
    path: "examiner-list",
    component: ExaminerListComponent
  }, {
    path: "staff",
    children: [{
      path: "",
      component: ManageUserComponent
    }, {
      path: "new",
      component: ManageNewUserComponent
    }]
  }, {
    path: "claimant",
    component: ClaimantComponent
  }, {
    path: "billable-item",
    component: BillableItemComponent
  }, {
    path: "claims",
    children: [{
      path: "",
      component: ClaimListComponent
    }, {
      path: "new-claimant",
      component: NewClaimantComponent
    }, {
      path: "new-claim",
      component: NewClaimComponent
    }, {
      path: ":id",
      component: NewClaimComponent
    }, {
      path: "new-billable-item",
      component: BillableItemComponent
    }]
  }, {
    path: "settings",
    component: SubscriberSettingsComponent
  }]
}, {
  path: "examiner",
  children: [{
    path: "",
    component: ExaminerDashboardComponent
  }, {
    path: "dashboard",
    component: ExaminerDashboardComponent
  }, {
    path: "appointment",
    component: AppointmentComponent
  }, {
    path: "appointment-details",
    component: AppointmentDetailsComponent
  }, {
    path: "claimant",
    component: ClaimantComponent
  }, {
    path: "billable-item",
    component: BillableItemComponent
  }, {
    path: "claims",
    children: [{
      path: "",
      component: ClaimListComponent
    }, {
      path: "new-claimant",
      component: NewClaimantComponent
    }, {
      path: "new-claim",
      component: NewClaimComponent
    }, {
      path: ":id",
      component: NewClaimComponent
    }, {
      path: "new-billable-item",
      component: BillableItemComponent
    }]
  }, {
    path: "settings",
    component: ExaminerSettingComponent
  }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
