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
import { EditAddressComponent } from './staff/edit-address/edit-address.component';
import { EditClaimComponent } from './components/claims/edit-claim/edit-claim.component';
import { NewBillableItemComponent } from './components/claims/new-billable-item/new-billable-item.component';
import { BillingComponent } from './components/billing/billing.component';
import { NewBillingComponent } from './components/new-billing/new-billing.component';
import { EditBillingComponent } from './components/edit-billing/edit-billing.component';

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
    path: "edit/:id",
    component: NewUserComponent
  }]
}, {
  path: "settings",
  component: SubscriberSettingsComponent
}, {
  path: "billing",
  component: BillingComponent
},
{
  path: "claimant",
  children: [{
    path: "",
    component: ClaimantComponent
  }, {
    path: "new-claimant/:id",
    component: NewClaimantComponent
  }]
}, {
  path: "billable-item",
  component: BillableItemComponent
},
{
  path: "manage-location",
  component: ManageLocationComponent
}, {
  path: "edit-claim/:id",
  component: EditClaimComponent
},
{
  path: "new-billable-item",
  component: NewBillableItemComponent
}, {
  path: "new-billable-item/:claim/:claimant",
  component: NewBillableItemComponent
}, {
  path: "new-billable-item/:claim/:claimant/:billable",
  component: NewBillableItemComponent
},
{
  path: "billing",
  children: [{
    path: "",
    component: BillingComponent,
  }, {
    path: "new",
    component: NewBillingComponent
  }, {
    path: ":id",
    component: EditBillingComponent
  }]
},
{
  path: "claims",
  children: [{
    path: "",
    component: ClaimListComponent
  }, {
    path: "new-claim",
    component: NewClaimComponent
  }, {
    path: ":id",
    component: NewClaimComponent
  }
  ]
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
      path: "billing",
      component: BillingComponent
    },
    {
      path: "claimant",
      children: [{
        path: "",
        component: ClaimantComponent
      }, {
        path: "new-claimant/:id",
        component: NewClaimantComponent
      }]
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
    }, {
      path: "edit-address/:examiner_id/:address_id",
      component: EditAddressComponent
    },]
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
    children: [{
      path: "",
      component: ClaimantComponent
    }, {
      path: "new-claimant/:id",
      component: NewClaimantComponent
    }]
  }, {
    path: "billing",
    component: BillingComponent
  }, {
    path: "billable-item",
    component: BillableItemComponent
  }, {
    path: "claims",
    children: [{
      path: "",
      component: ClaimListComponent
    }, {
      path: "new-claim",
      component: NewClaimComponent
    }, {
      path: ":id",
      component: NewClaimComponent
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
    children: [{
      path: "",
      component: ClaimantComponent
    }, {
      path: "new-claimant/:id",
      component: NewClaimantComponent
    }]
  }, {
    path: "billable-item",
    component: BillableItemComponent
  }, {
    path: "billing",
    component: BillingComponent
  }, {
    path: "claims",
    children: [{
      path: "",
      component: ClaimListComponent
    }, {
      path: "new-claim",
      component: NewClaimComponent
    }, {
      path: ":id",
      component: NewClaimComponent
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
    path: "appointment-details/:id",
    component: AppointmentDetailsComponent
  }, {
    path: "billing",
    component: BillingComponent
  }, {
    path: "claimant",
    children: [{
      path: "",
      component: ClaimantComponent
    }, {
      path: "new-claimant/:id",
      component: NewClaimantComponent
    }]
  }, {
    path: "billable-item",
    component: BillableItemComponent
  }, {
    path: "claims",
    children: [{
      path: "",
      component: ClaimListComponent
    }, {
      path: "new-claim",
      component: NewClaimComponent
    }, {
      path: ":id",
      component: NewClaimComponent
    }
    ]
  }, {
    path: "settings",
    component: ExaminerSettingComponent
  },
  {
    path: "manage-location",
    component: ManageLocationComponent
  },]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
