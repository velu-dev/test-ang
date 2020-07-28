export const ROUTES = [
    //Admin Menu
    {
        path: '/admin/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: []
    }, {
        path: '/admin',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: []
    }, {
        path: "/admin/settings",
        title: "Settings",
        icon: "settings",
        submenu: []
    }, {
        path: "/admin/admin-users",
        title: "Manage Admin",
        icon: "person_add",
        submenu: [{
            path: '/admin/admin-users/new',
            title: 'New User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/admin/admin-users/update',
            title: 'Edit Admin User',
            icon: 'dashboard',
            submenu: []
        }]
    },
    //  {
    //     path: "/admin/vendors",
    //     title: "Manage Vendors",
    //     icon: "settings",
    //     submenu: [{
    //         path: '/admin/vendors/new',
    //         title: 'New Vendor',
    //         icon: 'dashboard',
    //         submenu: []
    //     }]
    // },
    {
        path: "/admin/profile",
        title: "Profile",
        icon: "person",
        submenu: []
    }, {
        path: '/admin/users',
        title: 'Manage Subscribers',
        icon: 'person_add',
        submenu: [{
            path: '/admin/users/new',
            title: 'New Users',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/admin/users/update',
            title: 'Edit Subscribers',
            icon: 'dashboard',
            submenu: []
        }
        ]
    },
    //Subscriber Menu
    {
        path: '/subscriber',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/settings',
        title: 'Settings',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/users',
        title: 'Users',
        icon: 'credit_card',
        submenu: [{
            path: '/subscriber/users/new',
            title: 'New User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/users/edit',
            title: 'Edit User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/users/new-examiner',
            title: 'New User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/users/examiner',
            title: 'Edit User',
            icon: 'dashboard',
            submenu: []
        }],
    },
    {
        path: '/subscriber/claimant',
        title: 'Claimants',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/claimant/new-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/claimant/edit-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        },
        // {
        //     path: '/subscriber/claimant/edit-claimant/:id/new-claim',
        //     title: 'Claim',
        //     icon: 'dashboard',
        //     submenu: []
        // },
        {
            path: '/subscriber/claimant/edit-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/billable-item',
        title: 'Billable Items',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/billable-item/new-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/billable-item/edit-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/new-intake',
        title: 'Claimant Intake',
        icon: 'dashboard',
        submenu: []
    }, {
        path: '/subscriber/claims',
        title: 'Claims',
        icon: 'dashboard',
        submenu: [
            // {
            //     path: '/subscriber/claims/new-claim',
            //     title: 'Claim',
            //     icon: 'dashboard',
            //     submenu: []
            // },
            {
                path: '/subscriber/claims/edit-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/claims/edit-claim/:id/new-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            },],
    }, {
        path: '/subscriber/location',
        title: 'Locations',
        icon: 'map',
        submenu: [
            {
                path: '/subscriber/location/new-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/location/edit-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }],
    },
    {
        path: '/subscriber/billing',
        title: 'Manage Billing',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/appointment',
        title: 'Examinations',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/appointment/appointment-details',
            title: 'Examination',
            icon: 'dashboard',
            submenu: []
        },]
    },
    {
        path: '/subscriber/dashboard/claimant-awaiting',
        title: 'Claimants Awaiting Details',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/dashboard/claim-awaiting',
        title: 'Claims Awaiting Details',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/dashboard/billable-item-awaiting',
        title: 'Billable Items Awaiting Scheduling',
        icon: 'dashboard',
        submenu: [],
    },

    // Subscriber staff manager
    {
        path: '/subscriber/manager',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/manager/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/manager/staff',
        title: 'Users',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/manager/staff/new',
            title: 'User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/manager/staff/edit',
            title: 'User',
            icon: 'dashboard',
            submenu: []
        }],
    }, {
        path: '/subscriber/manager/billing',
        title: 'Manage Billing',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/manager/settings',
        title: 'Settings',
        icon: 'dashboard',
        submenu: []
    }, {
        path: '/subscriber/manager/claimant',
        title: 'Claimants',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/manager/claimant/new-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/manager/claimant/edit-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        },
        {
            path: '/subscriber/manager/claimant/edit-claimant/:id/new-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/manager/claimant/edit-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/manager/billable-item',
        title: 'Billable Items',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/manager/billable-item/new-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/manager/billable-item/edit-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/manager/claims',
        title: 'Claims',
        icon: 'dashboard',
        submenu: [
            {
                path: '/subscriber/manager/claims/new-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/manager/claims/edit-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }],
    }, {
        path: '/subscriber/manager/location',
        title: 'Locations',
        icon: 'map',
        submenu: [
            {
                path: '/subscriber/manager/location/new-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/manager/location/edit-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }],
    },
    {
        path: '/subscriber/manager/appointment',
        title: 'Examinations',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/manager/appointment/appointment-details',
            title: 'Examination',
            icon: 'dashboard',
            submenu: []
        },]
    },
    //Subscriber staff
    {
        path: '/subscriber/staff',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/staff/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/staff/billing',
        title: 'Manage Billing',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/subscriber/staff/settings',
        title: 'Settings',
        icon: 'dashboard',
        submenu: []
    }, {
        path: '/subscriber/staff/claimant',
        title: 'Claimants',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/staff/claimant/new-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/staff/claimant/edit-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        },
        {
            path: '/subscriber/staff/claimant/edit-claimant/:id/new-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/staff/claimant/edit-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/staff/billable-item',
        title: 'Billable Items',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/staff/billable-item/new-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/staff/billable-item/edit-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/staff/claims',
        title: 'Claims',
        icon: 'dashboard',
        submenu: [
            {
                path: '/subscriber/staff/claims/new-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/staff/claims/edit-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }],
    }, {
        path: '/subscriber/staff/location',
        title: 'Locations',
        icon: 'map',
        submenu: [
            {
                path: '/subscriber/staff/location/new-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/staff/location/edit-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }],
    },
    {
        path: '/subscriber/staff/appointment',
        title: 'Examinations',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/staff/appointment/appointment-details',
            title: 'Examination',
            icon: 'dashboard',
            submenu: []
        },]
    }
    , {
        path: '/subscriber/staff/settings',
        title: 'Settings',
        icon: 'dashboard',
        submenu: []
    },
    //examiner
    {
        path: 'subscriber/examiner',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: []
    }, {
        path: '/subscriber/examiner',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: []
    }, {
        path: '/subscriber/examiner/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: []
    },
    {
        path: '/subscriber/examiner/billing',
        title: 'Manage Billing',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/examiner/claimant',
        title: 'Claimants',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/examiner/claimant/new-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/examiner/claimant/edit-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        },
        {
            path: '/subscriber/examiner/claimant/edit-claimant/:id/new-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/examiner/claimant/edit-claim',
            title: 'Claim',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/examiner/billable-item',
        title: 'Billable Items',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/examiner/billable-item/new-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/subscriber/examiner/billable-item/edit-billable-item',
            title: 'Billable Item',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/examiner/claims',
        title: 'Claims',
        icon: 'dashboard',
        submenu: [
            {
                path: '/subscriber/examiner/claims/new-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/examiner/claims/edit-claim',
                title: 'Claim',
                icon: 'dashboard',
                submenu: []
            }],
    }, {
        path: '/subscriber/examiner/location',
        title: 'Locations',
        icon: 'map',
        submenu: [
            {
                path: '/subscriber/examiner/location/new-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/examiner/location/edit-location',
                title: 'Location',
                icon: 'dashboard',
                submenu: []
            }],
    },
    {
        path: '/subscriber/examiner/appointment',
        title: 'Examinations',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/examiner/appointment/appointment-details',
            title: 'Examination',
            icon: 'dashboard',
            submenu: []
        },]
    }
    , {
        path: '/subscriber/examiner/settings',
        title: 'Settings',
        icon: 'dashboard',
        submenu: []
    },

    // //Vendor historian Menu
    // {
    //     path: '/vendor/historian/dashboard',
    //     title: 'Dashboard',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // {
    //     path: '/vendor/historian/users',
    //     title: 'Historian users',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // {
    //     path: '/vendor/historian/users/new',
    //     title: 'New Staff',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // //Historian staff menu
    // {
    //     path: '/vendor/historian/staff/dashboard',
    //     title: 'Dashboard',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // // Summarizer menus
    // {
    //     path: '/vendor/summarizer/dashboard',
    //     title: 'Dashboard',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // {
    //     path: '/vendor/summarizer/users',
    //     title: 'Summarizer users',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // {
    //     path: '/vendor/summarizer/users/new',
    //     title: 'New Staff',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // //Summarizer staff menu
    // {
    //     path: '/vendor/summarizer/staff/dashboard',
    //     title: 'Dashboard',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // // Transcriber menus
    // {
    //     path: '/vendor/transcriber/dashboard',
    //     title: 'Dashboard',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // {
    //     path: '/vendor/transcriber/users',
    //     title: 'Transcriber users',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // {
    //     path: '/vendor/transcriber/users/new',
    //     title: 'New Staff',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
    // //Transcriber staff menu
    // {
    //     path: '/vendor/transcriber/staff/dashboard',
    //     title: 'Dashboard',
    //     icon: 'dashboard',
    //     submenu: [],
    // },
]