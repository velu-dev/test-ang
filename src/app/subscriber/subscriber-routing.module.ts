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
import { ManageLocationComponent } from './components/manage-location/manage-location.component';
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
import { NewExaminerUserComponent } from './components/new-examiner-user/new-examiner-user.component';
import { ExistingServiceLocationsComponent } from './components/existing-service-locations/existing-service-locations.component';
import { AddEditServiceLocationComponent } from './components/add-edit-service-location/add-edit-service-location.component';
import { BillingCorrespondanceComponent } from './examiner/appointment-details/correspondance/correspondance.component';
import { ExaminationComponent } from './examiner/appointment-details/examination/examination.component';
import { HistoryComponent } from './examiner/appointment-details/history/history.component';
import { RecordsComponent } from './examiner/appointment-details/records/records.component';
import { ReportComponent } from './examiner/appointment-details/report/report.component';
import { BilllableBillingComponent } from './examiner/appointment-details/billing/billing.component';

const routes: Routes = [{
  path: "dashboard",
  children: [{
    path: "",
    component: DashboardComponent,
    data: { breadcrumb: { skip: true } }
  }]
}, {
  path: "new-examiner",
  children: [
    {
      path: "",
      component: NewExaminerUserComponent,
      data: { breadcrumb: "New Examiner" }
    }, {
      path: "add-location/:status/:examiner",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "New" }
    }
  ]
}, {
  path: "new",
  component: NewUserComponent,
  data: { breadcrumb: "New Staff / Staff Manager" }
},
{
  path: "claimant-awaiting",
  children: [
    {
      path: "",
      component: ClaimantAwaitingComponent,
      data: { breadcrumb: "Claimants Awaiting Details" }
    },
    {
      path: "claimants",
      children: [
        {
          path: "",
          component: ClaimantComponent,
          data: { breadcrumb: { skip: true } }
        },
        {
          path: "new-claimant",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claimant" }
        },
        {
          path: "claimant/:claimant_id",
          children: [{
            path: "",
            component: NewClaimantComponent,
            data: { breadcrumb: { alias: '@Claimant' } }
          },
          {
            path: "claim/:claim_id",
            children: [{
              path: "",
              component: EditClaimComponent,
              //data: { breadcrumb: "Claim" },
              data: { breadcrumb: { alias: '@Claim' } }
            }, {
              path: "new-billable-item",
              component: NewBillableItemComponent,
              data: { breadcrumb: "New Billable Item" },
            }, {
              path: "billable-item/:billId",
              children: [{
                path: "",
                component: AppointmentDetailsComponent,
                data: { breadcrumb: { alias: '@Billable Item' } },
              }, {
                path: "correspondence",
                component: BillingCorrespondanceComponent,
                data: { breadcrumb: "Correspondence" },
              }, {
                path: "examination",
                component: ExaminationComponent,
                data: { breadcrumb: "Examination" },
              }, {
                path: "history",
                component: HistoryComponent,
                data: { breadcrumb: "History" },
              }, {
                path: "history/:examiner",
                component: HistoryComponent,
                data: { breadcrumb: "History" }
              }, {
                path: "records",
                component: RecordsComponent,
                data: { breadcrumb: "Records" },
              }, {
                path: "reports",
                component: ReportComponent,
                data: { breadcrumb: "Report" }
              }, {
                path: "billing",
                component: BilllableBillingComponent,
                data: { breadcrumb: { alias: '@Bill' } }
              }, {
                path: "billing/:billingId",
                component: BilllableBillingComponent,
                data: { breadcrumb: { alias: '@Bill' } }
              }]
            }]
          }, {
            path: "new-claim",
            component: NewClaimComponent,
            data: { breadcrumb: "New Claim" }
          }]
        },
        {
          path: "edit-claim/:id",
          component: NewClaimComponent,
          data: { breadcrumb: "Edit" }
        }, {
          path: ":id/new-claim",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claim" }
        }]
    }
  ]
},
{
  path: "claim-awaiting",
  children: [
    {
      path: "",
      component: ClaimAwaitingComponent,
      data: { breadcrumb: "Claims Awaiting Details" }
    }, {
      path: "edit-claim/:claim_id",
      children: [{
        path: "",
        component: EditClaimComponent,
        //data: { breadcrumb: "Claim" },
        data: { breadcrumb: { alias: '@Claim' } }
      }, {
        path: "new-billable-item",
        component: NewBillableItemComponent,
        data: { breadcrumb: "New Billable Item" },
      }, {
        path: "billable-item/:billId",
        children: [{
          path: "",
          component: AppointmentDetailsComponent,
          data: { breadcrumb: { alias: '@Billable Item' } },
        }, {
          path: "correspondence",
          component: BillingCorrespondanceComponent,
          data: { breadcrumb: "Correspondence" }
        }, {
          path: "examination",
          component: ExaminationComponent,
          data: { breadcrumb: "Examination" }
        }, {
          path: "history",
          component: HistoryComponent,
          data: { breadcrumb: "History" }
        }, {
          path: "history/:examiner",
          component: HistoryComponent,
          data: { breadcrumb: "History" }
        }, {
          path: "records",
          component: RecordsComponent,
          data: { breadcrumb: "Records" }
        }, {
          path: "reports",
          component: ReportComponent,
          data: { breadcrumb: "Report" }
        }, {
          path: "billing",
          component: BilllableBillingComponent,
          data: { breadcrumb: { alias: '@Bill' } }
        }, {
          path: "billing/:billingId",
          component: BilllableBillingComponent,
          data: { breadcrumb: { alias: '@Bill' } }
        }]
      }]
    }
  ]
}, {
  path: "billable-item-awaiting",
  children: [{
    path: "",
    component: BillableItemAwaitingComponent,
    data: { breadcrumb: "Billable Items Awaiting Scheduling" },
  },
  {
    path: "billable-item/edit-billable-item/:claim_id/:claimant_id/:billable",
    component: NewBillableItemComponent,
    data: { breadcrumb: "Edit Billable Item" },
  }
  ]
}, {
  path: "upcomming-billable-item",
  component: UpcommingBillableItemComponent,
  data: { breadcrumb: "Upcoming Appointments" }
}, {
  path: "unfinished-reports",
  component: UnfinishedReportComponent,
  data: { breadcrumb: "Unfinished Reports" }
}, {
  path: "billing-collection",
  component: BillingCollectionComponent,
  data: { breadcrumb: "Billing and Collections" }
},
{
  path: "",
  component: DashboardComponent
},
{
  path: "users",
  children: [{
    path: "",
    component: UserComponent,
    data: { breadcrumb: "Users" }
  }, {
    path: "new",
    component: NewUserComponent,
    data: { breadcrumb: "New Staff / Staff Manager" }
  }, {
    path: "edit/:id",
    component: NewUserComponent,
    data: { breadcrumb: "Staff / Staff Manager" }
  }, {
    path: "new-examiner",
    children: [
      {
        path: "",
        component: NewExaminerUserComponent,
        data: { breadcrumb: "New Examiner" }
      }, {
        path: "add-location/:status/:examiner",
        component: AddEditServiceLocationComponent,
        data: { breadcrumb: "New" }
      }
    ]
  }, {
    path: "examiner/:id",
    children: [{
      path: "",
      component: NewExaminerUserComponent,
      data: { breadcrumb: "Examiner" }
    }, {
      path: "edit-location/:location_id/:status",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "Edit" }
    },
    {
      path: "add-location/:status/:examiner",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "New" }
    }]
  },
  {
    path: "examiner/:id/:status",
    children: [{
      path: "",
      component: NewExaminerUserComponent,
      data: { breadcrumb: "Examiner" }
    }, {
      path: "edit-location/:location_id/:status",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "Edit" }
    }, {
      path: "edit-location/:id/:status/:location_id",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "Edit" }
    },
    {
      path: "add-location/:status/:examiner",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "New" }
    }]
  }]
},
{
  path: "appointment",
  children: [{
    path: "",
    component: AppointmentComponent,
    data: { breadcrumb: "Calendar" }
  }, {
    path: "appointment-details/:claim_id/:billId",
    children: [{
      path: "",
      component: AppointmentDetailsComponent,
      data: { breadcrumb: "Examination Details" }
    }, {
      path: "correspondence",
      component: BillingCorrespondanceComponent,
      data: { breadcrumb: "Correspondence" }
    }, {
      path: "examination",
      component: ExaminationComponent,
      data: { breadcrumb: "Examination" }
    }, {
      path: "history",
      component: HistoryComponent,
      data: { breadcrumb: "History" }
    }, {
      path: "history/:examiner",
      component: HistoryComponent,
      data: { breadcrumb: "History" }
    }, {
      path: "records",
      component: RecordsComponent,
      data: { breadcrumb: "Records" }
    }, {
      path: "reports",
      component: ReportComponent,
      data: { breadcrumb: "Report" }
    }, {
      path: "billing",
      component: BilllableBillingComponent,
      data: { breadcrumb: { alias: '@Bill' } }
    }, {
      path: "billing/:billingId",
      component: BilllableBillingComponent,
      data: { breadcrumb: { alias: '@Bill' } }
    }]
  }]
},
{
  path: "claimants",
  children: [
    {
      path: "",
      component: ClaimantComponent,
      data: { breadcrumb: "Claimants" },
    },
    {
      path: "new-claimant",
      component: NewClaimComponent,
      data: { breadcrumb: "New Claimant" }
    },
    {
      path: "claimant/:claimant_id",
      children: [{
        path: "",
        component: NewClaimantComponent,
        data: { breadcrumb: { alias: '@Claimant' } }
      },
      {
        path: "claim/:claim_id",
        children: [{
          path: "",
          component: EditClaimComponent,
          //data: { breadcrumb: "Claim" },
          data: { breadcrumb: { alias: '@Claim' } }
        }, {
          path: "new-billable-item",
          component: NewBillableItemComponent,
          data: { breadcrumb: "New Billable Item" },
        }, {
          path: "billable-item/:billId",
          children: [{
            path: "",
            component: AppointmentDetailsComponent,
            data: { breadcrumb: { alias: '@Billable Item' } },
          }, {
            path: "correspondence",
            component: BillingCorrespondanceComponent,
            data: { breadcrumb: "Correspondence" }
          }, {
            path: "examination",
            component: ExaminationComponent,
            data: { breadcrumb: "Examination" }
          }, {
            path: "history",
            component: HistoryComponent,
            data: { breadcrumb: "History" }
          }, {
            path: "history/:examiner",
            component: HistoryComponent,
            data: { breadcrumb: "History" }
          }, {
            path: "records",
            component: RecordsComponent,
            data: { breadcrumb: "Records" }
          }, {
            path: "reports",
            component: ReportComponent,
            data: { breadcrumb: "Report" }
          }, {
            path: "billing",
            component: BilllableBillingComponent,
            data: { breadcrumb: { alias: '@Bill' } }
          }, {
            path: "billing/:billingId",
            component: BilllableBillingComponent,
            data: { breadcrumb: { alias: '@Bill' } }
          }]
        }]
      }, {
        path: "new-claim",
        component: NewClaimComponent,
        data: { breadcrumb: "New Claim" }
      }]
    },
    {
      path: "edit-claim/:id",
      component: NewClaimComponent,
      data: { breadcrumb: "Edit" }
    }, {
      path: ":id/new-claim",
      component: NewClaimComponent,
      data: { breadcrumb: "New Claim" }
    }]
},
{
  path: "billable-item",
  children: [{
    path: "",
    component: BillableItemComponent,
    data: { breadcrumb: "Bills" }
  }, {
    path: "new-billable-item/:claim_id/:claimant_id",
    component: NewBillableItemComponent,
    data: { breadcrumb: "New Billable Item" }
  }, {
    path: "edit-billable-item/:claim_id/:claimant_id/:billable",
    component: NewBillableItemComponent,
    data: { breadcrumb: "Edit" }
  }]

},
{
  path: "location",
  children: [{
    path: "",
    component: ManageLocationComponent,
    data: { breadcrumb: "Service Locations" }
  },
  // {
  //   path: "edit-location/:examiner_id/:address_id",
  //   component: EditAddressComponent
  // }, 
  {
    path: "new-location",
    component: ExaminerManageAddressComponent,
    data: { breadcrumb: "New" }
  }, {
    path: "existing-location/:id",
    component: ExistingServiceLocationsComponent,
    data: { breadcrumb: "Service Location" }
  },
  {
    path: "add-location",
    component: AddEditServiceLocationComponent,
    data: { breadcrumb: "New" }
  },
  {
    path: "add-location/:status/:id",
    component: AddEditServiceLocationComponent,
    data: { breadcrumb: "New" }
  },
  {
    path: "edit-location/:location_id",
    component: AddEditServiceLocationComponent,
    data: { breadcrumb: "Service Location" }
  },
  {
    path: "edit-location/:location_id/:status/:id",
    component: AddEditServiceLocationComponent,
    data: { breadcrumb: "Service Location" }
  }]

},
{
  path: "billing",
  children: [{
    path: "",
    component: BillingComponent,
    data: { breadcrumb: "Bills" }
  }, {
    path: "new",
    component: NewBillingComponent,
    data: { breadcrumb: "New Bill" }
  }, {
    path: ":claim_id/:billId/edit-billing/:billingId",
    component: BilllableBillingComponent,
    data: { breadcrumb: { alias: '@Bill' } }
  }]
},
{
  path: "new-intake",
  component: NewClaimComponent,
  data: { breadcrumb: "New Intake" }
},
{
  path: "claims",
  children: [{
    path: "",
    component: ClaimListComponent,
    data: { breadcrumb: "Claims" }
  }, {
    path: "new-claim",
    component: NewClaimComponent,
    data: { breadcrumb: "New Claim" }
  }, {
    path: ":id",
    component: NewClaimComponent,
    data: { breadcrumb: "Claim" }
  }, {
    path: "edit-claim/:claim_id",
    component: EditClaimComponent,
    data: { breadcrumb: "Edit Claim" }
  },
  {
    path: "edit-claim/:claimant_id/new-claim",
    component: NewClaimComponent,
    data: { breadcrumb: "New Claim" }
  },
  ]
}, {
  path: "settings",
  component: SubscriberSettingsComponent,
  data: { breadcrumb: "Settings" }
},
{
  path: "staff",
  children: [
    {
      path: "",
      component: StaffDashboardComponent,
      data: { breadcrumb: { skip: true } }
    }, {
      path: "new-intake",
      component: NewClaimComponent,
      data: { breadcrumb: "New Intake" }
    }, {
      path: "dashboard",
      component: StaffDashboardComponent,
      data: { breadcrumb: { skip: true } }
    }, {
      path: "claimant-awaiting",
      children: [
        {
          path: "",
          component: ClaimantAwaitingComponent,
          data: { breadcrumb: "Claimants Awaiting Details" }
        },
        {
          path: "claimants",
          children: [
            {
              path: "",
              component: ClaimantComponent,
              data: { breadcrumb: { skip: true } }
            },
            {
              path: "new-claimant",
              component: NewClaimComponent,
              data: { breadcrumb: "New Claimant" }
            },
            {
              path: "claimant/:claimant_id",
              children: [{
                path: "",
                component: NewClaimantComponent,
                data: { breadcrumb: { alias: '@Claimant' } }
              },
              {
                path: "claim/:claim_id",
                children: [{
                  path: "",
                  component: EditClaimComponent,
                  //data: { breadcrumb: "Claim" },
                  data: { breadcrumb: { alias: '@Claim' } }
                }, {
                  path: "new-billable-item",
                  component: NewBillableItemComponent,
                  data: { breadcrumb: "New Billable Item" },
                }, {
                  path: "billable-item/:billId",
                  children: [{
                    path: "",
                    component: AppointmentDetailsComponent,
                    data: { breadcrumb: { alias: '@Billable Item' } },
                  }, {
                    path: "correspondence",
                    component: BillingCorrespondanceComponent,
                    data: { breadcrumb: "Correspondence" }
                  }, {
                    path: "examination",
                    component: ExaminationComponent,
                    data: { breadcrumb: "Examination" }
                  }, {
                    path: "history",
                    component: HistoryComponent,
                    data: { breadcrumb: "History" }
                  }, {
                    path: "history/:examiner",
                    component: HistoryComponent,
                    data: { breadcrumb: "History" }
                  }, {
                    path: "records",
                    component: RecordsComponent,
                    data: { breadcrumb: "Records" }
                  }, {
                    path: "reports",
                    component: ReportComponent,
                    data: { breadcrumb: "Report" }
                  }, {
                    path: "billing",
                    component: BilllableBillingComponent,
                    data: { breadcrumb: { alias: '@Bill' } }
                  }, {
                    path: "billing/:billingId",
                    component: BilllableBillingComponent,
                    data: { breadcrumb: { alias: '@Bill' } }
                  }]
                }]
              }, {
                path: "new-claim",
                component: NewClaimComponent,
                data: { breadcrumb: "New Claim" }
              }]
            },
            {
              path: "edit-claim/:id",
              component: NewClaimComponent,
              data: { breadcrumb: "Edit" }
            }, {
              path: ":id/new-claim",
              component: NewClaimComponent,
              data: { breadcrumb: "New Claim" }
            }]
        }
      ]
    },
    {
      path: "claim-awaiting",
      children: [
        {
          path: "",
          component: ClaimAwaitingComponent,
          data: { breadcrumb: "Claims Awaiting Details" }
        }, {
          path: "edit-claim/:claim_id",
          children: [{
            path: "",
            component: EditClaimComponent,
            //data: { breadcrumb: "Claim" },
            data: { breadcrumb: { alias: '@Claim' } }
          }, {
            path: "new-billable-item",
            component: NewBillableItemComponent,
            data: { breadcrumb: "New Billable Item" },
          }, {
            path: "billable-item/:billId",
            children: [{
              path: "",
              component: AppointmentDetailsComponent,
              data: { breadcrumb: { alias: '@Billable Item' } },
            }, {
              path: "correspondence",
              component: BillingCorrespondanceComponent,
              data: { breadcrumb: "Correspondence" }
            }, {
              path: "examination",
              component: ExaminationComponent,
              data: { breadcrumb: "Examination" }
            }, {
              path: "history",
              component: HistoryComponent,
              data: { breadcrumb: "History" }
            }, {
              path: "history/:examiner",
              component: HistoryComponent,
              data: { breadcrumb: "History" }
            }, {
              path: "records",
              component: RecordsComponent,
              data: { breadcrumb: "Records" }
            }, {
              path: "reports",
              component: ReportComponent,
              data: { breadcrumb: "Report" }
            }, {
              path: "billing",
              component: BilllableBillingComponent,
              data: { breadcrumb: { alias: '@Bill' } }
            }, {
              path: "billing/:billingId",
              component: BilllableBillingComponent,
              data: { breadcrumb: { alias: '@Bill' } }
            }]
          }]
        }
      ]
    }, {
      path: "billable-item-awaiting",
      children: [{
        path: "",
        component: BillableItemAwaitingComponent,
        data: { breadcrumb: "Billable Items Awaiting Scheduling" },
      },
      {
        path: "billable-item/edit-billable-item/:claim_id/:claimant_id/:billable",
        component: NewBillableItemComponent,
        data: { breadcrumb: "Edit Billable Item" },
      }
      ]
    }, {
      path: "upcomming-billable-item",
      component: UpcommingBillableItemComponent,
      data: { breadcrumb: "Upcoming Appointments" }
    }, {
      path: "unfinished-reports",
      component: UnfinishedReportComponent,
      data: { breadcrumb: "Unfinished Reports" }
    }, {
      path: "billing-collection",
      component: BillingCollectionComponent,
      data: { breadcrumb: "Billing and Collections" }
    },
    {
      path: "appointment",
      children: [{
        path: "",
        component: AppointmentComponent,
        data: { breadcrumb: "Calendar" }
      }, {
        path: "appointment-details/:claim_id/:billId",
        children: [{
          path: "",
          component: AppointmentDetailsComponent,
          data: { breadcrumb: "Examination Details" }
        }, {
          path: "correspondence",
          component: BillingCorrespondanceComponent,
          data: { breadcrumb: "Correspondence" }
        }, {
          path: "examination",
          component: ExaminationComponent,
          data: { breadcrumb: "Examination" }
        }, {
          path: "history",
          component: HistoryComponent,
          data: { breadcrumb: "History" }
        }, {
          path: "history/:examiner",
          component: HistoryComponent,
          data: { breadcrumb: "History" }
        }, {
          path: "records",
          component: RecordsComponent,
          data: { breadcrumb: "Records" }
        }, {
          path: "reports",
          component: ReportComponent,
          data: { breadcrumb: "Report" }
        }, {
          path: "billing",
          component: BilllableBillingComponent,
          data: { breadcrumb: { alias: '@Bill' } }
        }, {
          path: "billing/:billingId",
          component: BilllableBillingComponent,
          data: { breadcrumb: { alias: '@Bill' } }
        }]
      }]
    },
    {
      path: "claimants",
      children: [
        {
          path: "",
          component: ClaimantComponent,
          data: { breadcrumb: "Claimants" },
        },
        {
          path: "new-claimant",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claimant" }
        },
        {
          path: "claimant/:claimant_id",
          children: [{
            path: "",
            component: NewClaimantComponent,
            data: { breadcrumb: { alias: '@Claimant' } }
          },
          {
            path: "claim/:claim_id",
            children: [{
              path: "",
              component: EditClaimComponent,
              //data: { breadcrumb: "Claim" },
              data: { breadcrumb: { alias: '@Claim' } }
            }, {
              path: "new-billable-item",
              component: NewBillableItemComponent,
              data: { breadcrumb: "New Billable Item" },
            }, {
              path: "billable-item/:billId",
              children: [{
                path: "",
                component: AppointmentDetailsComponent,
                data: { breadcrumb: { alias: '@Billable Item' } },
              }, {
                path: "correspondence",
                component: BillingCorrespondanceComponent,
                data: { breadcrumb: "Correspondence" }
              }, {
                path: "examination",
                component: ExaminationComponent,
                data: { breadcrumb: "Examination" }
              }, {
                path: "history",
                component: HistoryComponent,
                data: { breadcrumb: "History" }
              }, {
                path: "history/:examiner",
                component: HistoryComponent,
                data: { breadcrumb: "History" }
              }, {
                path: "records",
                component: RecordsComponent,
                data: { breadcrumb: "Records" }
              }, {
                path: "reports",
                component: ReportComponent,
                data: { breadcrumb: "Report" }
              }, {
                path: "billing",
                component: BilllableBillingComponent,
                data: { breadcrumb: { alias: '@Bill' } }
              }, {
                path: "billing/:billingId",
                component: BilllableBillingComponent,
                data: { breadcrumb: { alias: '@Bill' } }
              }]
            }]
          }, {
            path: "new-claim",
            component: NewClaimComponent,
            data: { breadcrumb: "New Claim" }
          }]
        },
        {
          path: "edit-claim/:id",
          component: NewClaimComponent,
          data: { breadcrumb: "Edit" }
        }, {
          path: ":id/new-claim",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claim" }
        }]
    }, {
      path: "billable-item",
      children: [{
        path: "",
        component: BillableItemComponent
      }, {
        path: "new-billable-item/:claim_id/:claimant_id",
        component: NewBillableItemComponent
      }, {
        path: "edit-billable-item/:claim_id/:claimant_id/:billable",
        component: NewBillableItemComponent
      }]

    },
    {
      path: "location",
      children: [{
        path: "",
        component: ManageLocationComponent,
        data: { breadcrumb: "Service Locations" }
      }, {
        path: "new-location",
        component: ExaminerManageAddressComponent,
        data: { breadcrumb: "New" }
      },
      {
        path: "add-location",
        component: AddEditServiceLocationComponent,
        data: { breadcrumb: "New" }
      },
      {
        path: "edit-location/:location_id",
        component: AddEditServiceLocationComponent,
        data: { breadcrumb: "Service Location" }
      }]

    },
    {
      path: "billing",
      children: [{
        path: "",
        component: BillingComponent,
        data: { breadcrumb: "Bills" }
      }, {
        path: "new",
        component: NewBillingComponent,
        data: { breadcrumb: "New Bill" }
      }, {
        path: ":claim_id/:billId/edit-billing/:billingId",
        component: BilllableBillingComponent,
        data: { breadcrumb: { alias: '@Bill' } }
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
      component: SubscriberSettingsComponent,
      data: { breadcrumb: "Settings" }
    },
  ]
},
{
  path: "manager",
  children: [
    {
      path: "new-intake",
      component: NewClaimComponent,
      data: { breadcrumb: "New Intake" }
    },
    {
      path: "new-examiner",
      children: [
        {
          path: "",
          component: NewExaminerUserComponent,
          data: { breadcrumb: "New Examiner" }
        }, {
          path: "add-location/:status/:examiner",
          component: AddEditServiceLocationComponent,
          data: { breadcrumb: "New" }
        }
      ]
    },
    {
      path: "new-staff",
      component: NewUserComponent,
      data: { breadcrumb: "New Staff" }
    },
    {
      path: "",
      component: ManagerDashboardComponent,
      data: { breadcrumb: { skip: true } }
    },
    {
      path: "claimant-awaiting",
      children: [
        {
          path: "",
          component: ClaimantAwaitingComponent,
          data: { breadcrumb: "Claimants Awaiting Details" }
        },
        {
          path: "claimants",
          children: [
            {
              path: "",
              component: ClaimantComponent,
              data: { breadcrumb: { skip: true } }
            },
            {
              path: "new-claimant",
              component: NewClaimComponent,
              data: { breadcrumb: "New Claimant" }
            },
            {
              path: "claimant/:claimant_id",
              children: [{
                path: "",
                component: NewClaimantComponent,
                data: { breadcrumb: { alias: '@Claimant' } }
              },
              {
                path: "claim/:claim_id",
                children: [{
                  path: "",
                  component: EditClaimComponent,
                  //data: { breadcrumb: "Claim" },
                  data: { breadcrumb: { alias: '@Claim' } }
                }, {
                  path: "new-billable-item",
                  component: NewBillableItemComponent,
                  data: { breadcrumb: "New Billable Item" },
                }, {
                  path: "billable-item/:billId",
                  children: [{
                    path: "",
                    component: AppointmentDetailsComponent,
                    data: { breadcrumb: { alias: '@Billable Item' } },
                  }, {
                    path: "correspondence",
                    component: BillingCorrespondanceComponent,
                    data: { breadcrumb: "Correspondence" }
                  }, {
                    path: "examination",
                    component: ExaminationComponent,
                    data: { breadcrumb: "Examination" }
                  }, {
                    path: "history",
                    component: HistoryComponent,
                    data: { breadcrumb: "History" }
                  }, {
                    path: "history/:examiner",
                    component: HistoryComponent,
                    data: { breadcrumb: "History" }
                  }, {
                    path: "records",
                    component: RecordsComponent,
                    data: { breadcrumb: "Records" }
                  }, {
                    path: "reports",
                    component: ReportComponent,
                    data: { breadcrumb: "Report" }
                  }, {
                    path: "billing",
                    component: BilllableBillingComponent,
                    data: { breadcrumb: { alias: '@Bill' } }
                  }, {
                    path: "billing/:billingId",
                    component: BilllableBillingComponent,
                    data: { breadcrumb: { alias: '@Bill' } }
                  }]
                }]
              }, {
                path: "new-claim",
                component: NewClaimComponent,
                data: { breadcrumb: "New Claim" }
              }]
            },
            {
              path: "edit-claim/:id",
              component: NewClaimComponent,
              data: { breadcrumb: "Edit" }
            }, {
              path: ":id/new-claim",
              component: NewClaimComponent,
              data: { breadcrumb: "New Claim" }
            }]
        }
      ]
    },
    {
      path: "claim-awaiting",
      children: [
        {
          path: "",
          component: ClaimAwaitingComponent,
          data: { breadcrumb: "Claims Awaiting Details" }
        }, {
          path: "edit-claim/:claim_id",
          children: [{
            path: "",
            component: EditClaimComponent,
            //data: { breadcrumb: "Claim" },
            data: { breadcrumb: { alias: '@Claim' } }
          }, {
            path: "new-billable-item",
            component: NewBillableItemComponent,
            data: { breadcrumb: "New Billable Item" },
          }, {
            path: "billable-item/:billId",
            children: [{
              path: "",
              component: AppointmentDetailsComponent,
              data: { breadcrumb: { alias: '@Billable Item' } },
            }, {
              path: "correspondence",
              component: BillingCorrespondanceComponent,
              data: { breadcrumb: "Correspondence" }
            }, {
              path: "examination",
              component: ExaminationComponent,
              data: { breadcrumb: "Examination" }
            }, {
              path: "history",
              component: HistoryComponent,
              data: { breadcrumb: "History" }
            }, {
              path: "history/:examiner",
              component: HistoryComponent,
              data: { breadcrumb: "History" }
            }, {
              path: "records",
              component: RecordsComponent,
              data: { breadcrumb: "Records" }
            }, {
              path: "reports",
              component: ReportComponent,
              data: { breadcrumb: "Report" }
            }, {
              path: "billing",
              component: BilllableBillingComponent,
              data: { breadcrumb: { alias: '@Bill' } }
            }, {
              path: "billing/:billingId",
              component: BilllableBillingComponent,
              data: { breadcrumb: { alias: '@Bill' } }
            }]
          }]
        }
      ]
    },
    {
      path: "billable-item-awaiting",
      children: [{
        path: "",
        component: BillableItemAwaitingComponent,
        data: { breadcrumb: "Billable Items Awaiting Scheduling" },
      },
      {
        path: "billable-item/edit-billable-item/:claim_id/:claimant_id/:billable",
        component: NewBillableItemComponent,
        data: { breadcrumb: "Edit Billable Item" },
      }
      ]
    },
    {
      path: "upcomming-billable-item",
      component: UpcommingBillableItemComponent,
      data: { breadcrumb: "Upcoming Appointments" }
    },
    {
      path: "unfinished-reports",
      component: UnfinishedReportComponent,
      data: { breadcrumb: "Unfinished Reports" }
    },
    {
      path: "billing-collection",
      component: BillingCollectionComponent,
      data: { breadcrumb: "Billing and Collections" }
    },
    {
      path: "dashboard",
      component: ManagerDashboardComponent,
      data: { breadcrumb: { skip: true } }
    },
    {
      path: "users",
      children: [{
        path: "",
        component: UserComponent,
        data: { breadcrumb: "Users" }
      }, {
        path: "new",
        component: ManageNewUserComponent,
        data: { breadcrumb: "New Staff" }
      }, {
        path: "edit/:id",
        component: NewExaminerUserComponent,
        data: { breadcrumb: "Edit" }
      }, {
        path: "new-examiner",
        children: [
          {
            path: "",
            component: NewExaminerUserComponent,
            data: { breadcrumb: "New Examiner" }
          }, {
            path: "add-location/:status/:examiner",
            component: AddEditServiceLocationComponent,
            data: { breadcrumb: "New" }
          }
        ]
      }, {
        path: "examiner/:id",
        children: [{
          path: "",
          component: NewExaminerUserComponent,
          data: { breadcrumb: "Examiner" }
        }, {
          path: "edit-location/:location_id/:status",
          component: AddEditServiceLocationComponent,
          data: { breadcrumb: "Edit" }
        },
        {
          path: "add-location/:status/:examiner",
          component: AddEditServiceLocationComponent,
          data: { breadcrumb: "New" }
        }]
      }]
    },
    {
      path: "appointment",
      children: [{
        path: "",
        component: AppointmentComponent,
        data: { breadcrumb: "Calendar" }
      }, {
        path: "appointment-details/:claim_id/:billId",
        children: [{
          path: "",
          component: AppointmentDetailsComponent,
          data: { breadcrumb: "Examination Details" }
        }, {
          path: "correspondence",
          component: BillingCorrespondanceComponent,
          data: { breadcrumb: "Correspondence" }
        }, {
          path: "examination",
          component: ExaminationComponent,
          data: { breadcrumb: "Examination" }
        }, {
          path: "history",
          component: HistoryComponent,
          data: { breadcrumb: "History" }
        }, {
          path: "history/:examiner",
          component: HistoryComponent,
          data: { breadcrumb: "History" }
        }, {
          path: "records",
          component: RecordsComponent,
          data: { breadcrumb: "Records" }
        }, {
          path: "reports",
          component: ReportComponent,
          data: { breadcrumb: "Report" }
        }, {
          path: "billing",
          component: BilllableBillingComponent,
          data: { breadcrumb: { alias: '@Bill' } }
        }, {
          path: "billing/:billingId",
          component: BilllableBillingComponent,
          data: { breadcrumb: { alias: '@Bill' } }
        }]
      }]
    },
    {
      path: "claimants",
      children: [
        {
          path: "",
          component: ClaimantComponent,
          data: { breadcrumb: "Claimants" },
        },
        {
          path: "new-claimant",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claimant" }
        },
        {
          path: "claimant/:claimant_id",
          children: [{
            path: "",
            component: NewClaimantComponent,
            data: { breadcrumb: { alias: '@Claimant' } }
          },
          {
            path: "claim/:claim_id",
            children: [{
              path: "",
              component: EditClaimComponent,
              //data: { breadcrumb: "Claim" },
              data: { breadcrumb: { alias: '@Claim' } }
            }, {
              path: "new-billable-item",
              component: NewBillableItemComponent,
              data: { breadcrumb: "New Billable Item" },
            }, {
              path: "billable-item/:billId",
              children: [{
                path: "",
                component: AppointmentDetailsComponent,
                data: { breadcrumb: { alias: '@Billable Item' } },
              }, {
                path: "correspondence",
                component: BillingCorrespondanceComponent,
                data: { breadcrumb: "Correspondence" }
              }, {
                path: "examination",
                component: ExaminationComponent,
                data: { breadcrumb: "Examination" }
              }, {
                path: "history",
                component: HistoryComponent,
                data: { breadcrumb: "History" }
              }, {
                path: "history/:examiner",
                component: HistoryComponent,
                data: { breadcrumb: "History" }
              }, {
                path: "records",
                component: RecordsComponent,
                data: { breadcrumb: "Records" }
              }, {
                path: "reports",
                component: ReportComponent,
                data: { breadcrumb: "Report" }
              }, {
                path: "billing",
                component: BilllableBillingComponent,
                data: { breadcrumb: { alias: '@Bill' } }
              }, {
                path: "billing/:billingId",
                component: BilllableBillingComponent,
                data: { breadcrumb: { alias: '@Bill' } }
              }]
            }]
          }, {
            path: "new-claim",
            component: NewClaimComponent,
            data: { breadcrumb: "New Claim" }
          }]
        },
        {
          path: "edit-claim/:id",
          component: NewClaimComponent,
          data: { breadcrumb: "Edit" }
        }, {
          path: ":id/new-claim",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claim" }
        }]
    },
    {
      path: "billable-item",
      children: [{
        path: "",
        component: BillableItemComponent
      }, {
        path: "new-billable-item/:claim_id/:claimant_id",
        component: NewBillableItemComponent
      }, {
        path: "edit-billable-item/:claim_id/:claimant_id/:billable",
        component: NewBillableItemComponent
      }]

    },
    {
      path: "location",
      children: [{
        path: "",
        component: ManageLocationComponent,
        data: { breadcrumb: "Service Locations" }
      }, {
        path: "new-location",
        component: ExaminerManageAddressComponent,
        data: { breadcrumb: "New" }
      },
      {
        path: "add-location",
        component: AddEditServiceLocationComponent,
        data: { breadcrumb: "New" }
      },
      {
        path: "edit-location/:location_id",
        component: AddEditServiceLocationComponent,
        data: { breadcrumb: "Service Location" }
      }]

    },
    {
      path: "billing",
      children: [{
        path: "",
        component: BillingComponent,
        data: { breadcrumb: "Bills" }
      }, {
        path: "new",
        component: NewBillingComponent,
        data: { breadcrumb: "New Bill" }
      }, {
        path: ":claim_id/:billId/edit-billing/:billingId",
        component: BilllableBillingComponent,
        data: { breadcrumb: "Edit" }
      }]
    },
    {
      path: "settings",
      component: SubscriberSettingsComponent,
      data: { breadcrumb: "Settings" }
    }]
},
{
  path: "examiner",
  children: [{
    path: "",
    component: ExaminerDashboardComponent,
    data: { breadcrumb: { skip: true } }
  }, {
    path: "dashboard",
    component: ExaminerDashboardComponent,
    data: { breadcrumb: { skip: true } }
  },
  {
    path: "claimant-awaiting",
    children: [
      {
        path: "",
        component: ClaimantAwaitingComponent,
        data: { breadcrumb: "Claimants Awaiting Details" }
      },
      {
        path: "claimants",
        children: [
          {
            path: "",
            component: ClaimantComponent,
            data: { breadcrumb: { skip: true } }
          },
          {
            path: "new-claimant",
            component: NewClaimComponent,
            data: { breadcrumb: "New Claimant" }
          },
          {
            path: "claimant/:claimant_id",
            children: [{
              path: "",
              component: NewClaimantComponent,
              data: { breadcrumb: { alias: '@Claimant' } }
            },
            {
              path: "claim/:claim_id",
              children: [{
                path: "",
                component: EditClaimComponent,
                //data: { breadcrumb: "Claim" },
                data: { breadcrumb: { alias: '@Claim' } }
              }, {
                path: "new-billable-item",
                component: NewBillableItemComponent,
                data: { breadcrumb: "New Billable Item" },
              }, {
                path: "billable-item/:billId",
                children: [{
                  path: "",
                  component: AppointmentDetailsComponent,
                  data: { breadcrumb: { alias: '@Billable Item' } },
                }, {
                  path: "correspondence",
                  component: BillingCorrespondanceComponent,
                  data: { breadcrumb: "Correspondence" }
                }, {
                  path: "examination",
                  component: ExaminationComponent,
                  data: { breadcrumb: "Examination" }
                }, {
                  path: "history",
                  component: HistoryComponent,
                  data: { breadcrumb: "History" }
                }, {
                  path: "history/:examiner",
                  component: HistoryComponent,
                  data: { breadcrumb: "History" }
                }, {
                  path: "records",
                  component: RecordsComponent,
                  data: { breadcrumb: "Records" }
                }, {
                  path: "reports",
                  component: ReportComponent,
                  data: { breadcrumb: "Report" }
                }, {
                  path: "billing",
                  component: BilllableBillingComponent,
                  data: { breadcrumb: { alias: '@Bill' } }
                }, {
                  path: "billing/:billingId",
                  component: BilllableBillingComponent,
                  data: { breadcrumb: { alias: '@Bill' } }
                }]
              }]
            }, {
              path: "new-claim",
              component: NewClaimComponent,
              data: { breadcrumb: "New Claim" }
            }]
          },
          {
            path: "edit-claim/:id",
            component: NewClaimComponent,
            data: { breadcrumb: "Edit" }
          }, {
            path: ":id/new-claim",
            component: NewClaimComponent,
            data: { breadcrumb: "New Claim" }
          }]
      }
    ]
  },
  {
    path: "upcomming-billable-item",
    component: UpcommingBillableItemComponent,
    data: { breadcrumb: "Upcoming Appointments" }
  },
  {
    path: "claim-awaiting",
    children: [
      {
        path: "",
        component: ClaimAwaitingComponent,
        data: { breadcrumb: "Claims Awaiting Details" }
      }, {
        path: "edit-claim/:claim_id",
        children: [{
          path: "",
          component: EditClaimComponent,
          //data: { breadcrumb: "Claim" },
          data: { breadcrumb: { alias: '@Claim' } }
        }, {
          path: "new-billable-item",
          component: NewBillableItemComponent,
          data: { breadcrumb: "New Billable Item" },
        }, {
          path: "billable-item/:billId",
          children: [{
            path: "",
            component: AppointmentDetailsComponent,
            data: { breadcrumb: { alias: '@Billable Item' } },
          }, {
            path: "correspondence",
            component: BillingCorrespondanceComponent,
            data: { breadcrumb: "Correspondence" }
          }, {
            path: "examination",
            component: ExaminationComponent,
            data: { breadcrumb: "Examination" }
          }, {
            path: "history",
            component: HistoryComponent,
            data: { breadcrumb: "History" }
          }, {
            path: "history/:examiner",
            component: HistoryComponent,
            data: { breadcrumb: "History" }
          }, {
            path: "records",
            component: RecordsComponent,
            data: { breadcrumb: "Records" }
          }, {
            path: "reports",
            component: ReportComponent,
            data: { breadcrumb: "Report" }
          }, {
            path: "billing",
            component: BilllableBillingComponent,
            data: { breadcrumb: { alias: '@Bill' } }
          }, {
            path: "billing/:billingId",
            component: BilllableBillingComponent,
            data: { breadcrumb: { alias: '@Bill' } }
          }]
        }]
      }
    ]
  },
  {
    path: "unfinished-reports",
    component: UnfinishedReportComponent,
    data: { breadcrumb: "Unfinished Reports" }
  },
  {
    path: "billing-collection",
    component: BillingCollectionComponent,
    data: { breadcrumb: "Billing and Collections" }
  },
  {
    path: "billable-item-awaiting",
    children: [{
      path: "",
      component: BillableItemAwaitingComponent,
      data: { breadcrumb: "Billable Items Awaiting Scheduling" },
    },
    {
      path: "billable-item/edit-billable-item/:claim_id/:claimant_id/:billable",
      component: NewBillableItemComponent,
      data: { breadcrumb: "Edit Billable Item" },
    }
    ]
  },
  {
    path: "appointment",
    children: [{
      path: "",
      component: AppointmentComponent,
      data: { breadcrumb: "Calendar" }
    }, {
      path: "appointment-details/:claim_id/:billId",
      children: [{
        path: "",
        component: AppointmentDetailsComponent,
        data: { breadcrumb: "Examination Details" }
      }, {
        path: "correspondence",
        component: BillingCorrespondanceComponent,
        data: { breadcrumb: "Correspondence" }
      }, {
        path: "examination",
        component: ExaminationComponent,
        data: { breadcrumb: "Examination" }
      }, {
        path: "history",
        component: HistoryComponent,
        data: { breadcrumb: "History" }
      }, {
        path: "history/:examiner",
        component: HistoryComponent,
        data: { breadcrumb: "History" }
      }, {
        path: "records",
        component: RecordsComponent,
        data: { breadcrumb: "Records" }
      }, {
        path: "reports",
        component: ReportComponent,
        data: { breadcrumb: "Report" }
      }, {
        path: "billing",
        component: BilllableBillingComponent,
        data: { breadcrumb: { alias: '@Bill' } }
      }, {
        path: "billing/:billingId",
        component: BilllableBillingComponent,
        data: { breadcrumb: { alias: '@Bill' } }
      }]
    }]
  },
  {
    path: "claimants",
    children: [
      {
        path: "",
        component: ClaimantComponent,
        data: { breadcrumb: "Claimants" },
      },
      {
        path: "new-claimant",
        component: NewClaimComponent,
        data: { breadcrumb: "New Claimant" }
      },
      {
        path: "claimant/:claimant_id",
        children: [{
          path: "",
          component: NewClaimantComponent,
          data: { breadcrumb: { alias: '@Claimant' } }
        },
        {
          path: "claim/:claim_id",
          children: [{
            path: "",
            component: EditClaimComponent,
            //data: { breadcrumb: "Claim" },
            data: { breadcrumb: { alias: '@Claim' } }
          }, {
            path: "new-billable-item",
            component: NewBillableItemComponent,
            data: { breadcrumb: "New Billable Item" },
          }, {
            path: "billable-item/:billId",
            children: [{
              path: "",
              component: AppointmentDetailsComponent,
              data: { breadcrumb: { alias: '@Billable Item' } },
            }, {
              path: "correspondence",
              component: BillingCorrespondanceComponent,
              data: { breadcrumb: "Correspondence" }
            }, {
              path: "examination",
              component: ExaminationComponent,
              data: { breadcrumb: "Examination" }
            }, {
              path: "history",
              component: HistoryComponent,
              data: { breadcrumb: "History" }
            }, {
              path: "history/:examiner",
              component: HistoryComponent,
              data: { breadcrumb: "History" }
            }, {
              path: "records",
              component: RecordsComponent,
              data: { breadcrumb: "Records" }
            }, {
              path: "reports",
              component: ReportComponent,
              data: { breadcrumb: "Report" }
            }, {
              path: "billing",
              component: BilllableBillingComponent,
              data: { breadcrumb: { alias: '@Bill' } }
            }, {
              path: "billing/:billingId",
              component: BilllableBillingComponent,
              data: { breadcrumb: { alias: '@Bill' } }
            }]
          }]
        }, {
          path: "new-claim",
          component: NewClaimComponent,
          data: { breadcrumb: "New Claim" }
        }]
      },
      {
        path: "edit-claim/:id",
        component: NewClaimComponent,
        data: { breadcrumb: "Edit" }
      }, {
        path: ":id/new-claim",
        component: NewClaimComponent,
        data: { breadcrumb: "New Claim" }
      }]
  }, {
    path: "billable-item",
    children: [{
      path: "",
      component: BillableItemComponent,
      data: { breadcrumb: "Bills" }
    }, {
      path: "new-billable-item/:claim_id/:claimant_id",
      component: NewBillableItemComponent,
      data: { breadcrumb: "New Bill" }
    }, {
      path: "edit-billable-item/:claim_id/:claimant_id/:billable",
      component: NewBillableItemComponent,
      data: { breadcrumb: "New Bill" }
    }]

  },
  {
    path: "location",
    children: [{
      path: "",
      component: ManageLocationComponent,
      data: { breadcrumb: "Service Locations" }
    },
    // {
    //   path: "edit-location/:examiner_id/:address_id",
    //   component: EditAddressComponent
    // }, 
    {
      path: "new-location",
      component: ExaminerManageAddressComponent,
      data: { breadcrumb: "New" }
    }, {
      path: "existing-location/:id",
      component: ExistingServiceLocationsComponent,
      data: { breadcrumb: "Edit" }
    },
    {
      path: "add-location",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "New" }
    },
    {
      path: "add-location/:status/:id",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "New" }
    },
    {
      path: "edit-location/:location_id",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "Service Location" }
    },
    {
      path: "edit-location/:location_id/:status/:id",
      component: AddEditServiceLocationComponent,
      data: { breadcrumb: "Service Location" }
    }]
  },
  {
    path: "billing",
    children: [{
      path: "",
      component: BillingComponent,
      data: { breadcrumb: "Bills" }
    }, {
      path: "new",
      component: NewBillingComponent,
      data: { breadcrumb: "New Bill" }
    }, {
      path: ":claim_id/:billId/edit-billing/:billingId",
      component: BilllableBillingComponent,
      data: { breadcrumb: "Edit" }
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
    component: ExaminerSettingComponent,
    data: { breadcrumb: "Settings" }
  },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
