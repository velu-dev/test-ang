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
import { ClaimantAwaitingComponent } from './components/dashboard/claimant-awaiting/claimant-awaiting.component';
import { ClaimAwaitingComponent } from './components/dashboard/claim-awaiting/claim-awaiting.component';
import { BillableItemAwaitingComponent } from './components/dashboard/billable-item-awaiting/billable-item-awaiting.component';
import { UpcommingBillableItemComponent } from './components/dashboard/upcomming-billable-item/upcomming-billable-item.component';
import { UnfinishedReportComponent } from './components/dashboard/unfinished-report/unfinished-report.component';
import { BillingCollectionComponent } from './components/dashboard/billing-collection/billing-collection.component';

const routes: Routes = [{
  path: "",
  children: [{
    path: "dashboard",
    component: DashboardComponent
  }, {
    path: "claimant-awaiting",
    component: ClaimantAwaitingComponent
  }, {
    path: "claim-awaiting",
    component: ClaimAwaitingComponent
  }, {
    path: "billable-item-awaiting",
    component: BillableItemAwaitingComponent
  }, {
    path: "upcomming-billable-item",
    component: UpcommingBillableItemComponent
  }, {
    path: "unfinished-reports",
    component: UnfinishedReportComponent
  }, {
    path: "billing-collection",
    component: BillingCollectionComponent
  }]
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
  path: "appointment",
  children: [{
    path: "",
    component: AppointmentComponent
  }, {
    path: "appointment-details/:id/:billId",
    component: AppointmentDetailsComponent
  }]
},
{
  path: "claimant",
  children: [{
    path: "",
    component: ClaimantComponent
  }, {
    path: "new-claimant",
    component: NewClaimantComponent
  }, {
    path: "edit-claimant/:id",
    component: NewClaimantComponent,
  }, {
    path: "edit-claimant/:claimant_id/new-claim",
    component: NewClaimComponent,
  }, {
    path: "edit-claim/:id",
    component: NewClaimComponent
  }, {
    path: ":id/new-claim",
    component: NewClaimComponent
  }]
}, {
  path: "billable-item",
  children: [{
    path: "",
    component: BillableItemComponent
  }, {
    path: "new-billable-item/:claim/:claimant",
    component: NewBillableItemComponent
  }, {
    path: "edit-billable-item/:claim/:claimant/:billable",
    component: NewBillableItemComponent
  }]

},
{
  path: "location",
  children: [{
    path: "",
    component: ManageLocationComponent
  }, {
    path: "edit-location/:examiner_id/:address_id",
    component: EditAddressComponent
  }, {
    path: "new-location",
    component: ExaminerManageAddressComponent
  },]

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
  }, {
    path: "edit-claim/:id",
    component: EditClaimComponent
  }
  ]
}, {
  path: "settings",
  component: SubscriberSettingsComponent
},
{
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
      path: "appointment",
      children: [{
        path: "",
        component: AppointmentComponent
      }, {
        path: "appointment-details/:id/:billId",
        component: AppointmentDetailsComponent
      }]
    },
    {
      path: "claimant",
      children: [{
        path: "",
        component: ClaimantComponent
      }, {
        path: "new-claimant",
        component: NewClaimantComponent
      }, {
        path: "edit-claimant/:id",
        component: NewClaimantComponent,
      }, {
        path: "edit-claimant/:claimant_id/new-claim",
        component: NewClaimComponent,
      }, {
        path: "edit-claim/:id",
        component: NewClaimComponent
      }, {
        path: ":id/new-claim",
        component: NewClaimComponent
      }]
    }, {
      path: "billable-item",
      children: [{
        path: "",
        component: BillableItemComponent
      }, {
        path: "new-billable-item/:claim/:claimant",
        component: NewBillableItemComponent
      }, {
        path: "edit-billable-item/:claim/:claimant/:billable",
        component: NewBillableItemComponent
      }]

    },
    {
      path: "location",
      children: [{
        path: "",
        component: ManageLocationComponent
      }, {
        path: "edit-location/:examiner_id/:address_id",
        component: EditAddressComponent
      }, {
        path: "new-location",
        component: ExaminerManageAddressComponent
      },]

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
      }, {
        path: "edit-claim/:id",
        component: EditClaimComponent
      }
      ]
    }, {
      path: "settings",
      component: SubscriberSettingsComponent
    },
    //  {
    //   path: "edit-address/:examiner_id/:address_id",
    //   component: EditAddressComponent
    // },
  ]
}, {
  path: "manager",
  children: [{
    path: "",
    component: ManagerDashboardComponent
  }, {
    path: "dashboard",
    component: ManagerDashboardComponent
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
    path: "appointment",
    children: [{
      path: "",
      component: AppointmentComponent
    }, {
      path: "appointment-details/:id/:billId",
      component: AppointmentDetailsComponent
    }]
  },
  {
    path: "claimant",
    children: [{
      path: "",
      component: ClaimantComponent
    }, {
      path: "new-claimant",
      component: NewClaimantComponent
    }, {
      path: "edit-claimant/:id",
      component: NewClaimantComponent,
    }, {
      path: "edit-claimant/:claimant_id/new-claim",
      component: NewClaimComponent,
    }, {
      path: "edit-claim/:id",
      component: NewClaimComponent
    }, {
      path: ":id/new-claim",
      component: NewClaimComponent
    }]
  }, {
    path: "billable-item",
    children: [{
      path: "",
      component: BillableItemComponent
    }, {
      path: "new-billable-item/:claim/:claimant",
      component: NewBillableItemComponent
    }, {
      path: "edit-billable-item/:claim/:claimant/:billable",
      component: NewBillableItemComponent
    }]

  },
  {
    path: "location",
    children: [{
      path: "",
      component: ManageLocationComponent
    }, {
      path: "edit-location/:examiner_id/:address_id",
      component: EditAddressComponent
    }, {
      path: "new-location",
      component: ExaminerManageAddressComponent
    },]

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
    }, {
      path: "edit-claim/:id",
      component: EditClaimComponent
    }
    ]
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
    path: "appointment",
    children: [{
      path: "",
      component: AppointmentComponent
    }, {
      path: "appointment-details/:id/:billId",
      component: AppointmentDetailsComponent
    }]
  },
  {
    path: "claimant",
    children: [{
      path: "",
      component: ClaimantComponent
    }, {
      path: "new-claimant",
      component: NewClaimantComponent
    }, {
      path: "edit-claimant/:id",
      component: NewClaimantComponent,
    }, {
      path: "edit-claimant/:claimant_id/new-claim",
      component: NewClaimComponent,
    }, {
      path: "edit-claim/:id",
      component: NewClaimComponent
    }, {
      path: ":id/new-claim",
      component: NewClaimComponent
    }]
  }, {
    path: "billable-item",
    children: [{
      path: "",
      component: BillableItemComponent
    }, {
      path: "new-billable-item/:claim/:claimant",
      component: NewBillableItemComponent
    }, {
      path: "edit-billable-item/:claim/:claimant/:billable",
      component: NewBillableItemComponent
    }]

  },
  {
    path: "location",
    children: [{
      path: "",
      component: ManageLocationComponent
    }, {
      path: "edit-location/:examiner_id/:address_id",
      component: EditAddressComponent
    }, {
      path: "new-location",
      component: ExaminerManageAddressComponent
    },]

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
    }, {
      path: "edit-claim/:id",
      component: EditClaimComponent
    }
    ]
  }, {
    path: "settings",
    component: ExaminerSettingComponent
  },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
