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
        title: 'User Management',
        icon: 'credit_card',
        submenu: [{
            path: '/subscriber/users/new',
            title: 'New User',
            icon: 'dashboard',
            submenu: []
        },{
            path: '/subscriber/users/edit',
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
        },{
            path: '/subscriber/claimant/edit-claimant',
            title: 'Claimant',
            icon: 'dashboard',
            submenu: []
        }],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/billable-item',
        title: 'Manage Billable Item',
        icon: 'dashboard',
        submenu: [],
        group: "Subscriber",
        role: 2
    }, {
        path: '/subscriber/claims',
        title: 'Manage Claims',
        icon: 'dashboard',
        submenu: [
            {
                path: '/subscriber/claims/new-claim',
                title: 'New Claims',
                icon: 'dashboard',
                submenu: []
            }],
    }, {
        path: '/subscriber/manage-location',
        title: 'Manage Locations',
        icon: 'map',
        submenu: [],
    },
    {
        path: '/subscriber/new-billable-item',
        title: 'Manage Billable Item',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/billing',
        title: 'Manage Billing',
        icon: 'dashboard',
        submenu: [],
    },
    {
        path: '/subscriber/edit-claim',
        title: 'Edit Claim',
        icon: 'dashboard',
        submenu: [],
    },
    //Subscriber staff manager
    {
        path: '/subscriber/manager',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/manager/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
        }, {
            path: '/subscriber/manager/staff',
            title: 'Staff Management',
            icon: 'dashboard',
            submenu: [],
        }, {
            path: '/subscriber/manager/staff/new',
            title: 'New User',
            icon: 'dashboard',
            submenu: []
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
                path: '/subscriber/manager/new-claimant',
                title: 'Claimant',
                icon: 'dashboard',
                submenu: []
            },{
                path: '/subscriber/manager/edit-claimant',
                title: 'Claimant',
                icon: 'dashboard',
                submenu: []
            }],
            group: "Subscriber",
            role: 2
        }, {
            path: '/subscriber/manager/billable-item',
            title: 'Manage Billable Item',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 2
        }, {
            path: '/subscriber/manager/claims',
            title: 'Manage Claims',
            icon: 'dashboard',
            submenu: [
                {
                    path: '/subscriber/manager/claims/new-claim',
                    title: 'New Claims',
                    icon: 'dashboard',
                    submenu: []
                }],
        }, {
            path: '/subscriber/manager/manage-location',
            title: 'Manage Locations',
            icon: 'map',
            submenu: [],
        }],
    },
    //Subscriber staff
    {
        path: '/subscriber/staff',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [{
            path: '/subscriber/staff/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
        }, {
            path: '/subscriber/staff/manage-address',
            title: 'Add Location',
            icon: 'dashboard',
            submenu: [],
        }, {
            path: '/subscriber/staff/billing',
            title: 'Manage Billing',
            icon: 'dashboard',
            submenu: [],
        }, {
            path: '/subscriber/staff/edit-address',
            title: 'Edit Location',
            icon: 'dashboard',
            submenu: [],
        }, {
            path: '/subscriber/staff/examiner-list',
            title: 'Manage Examiner',
            icon: 'dashboard',
            submenu: [],
        },
        {
            path: '/subscriber/staff/manage-location',
            title: 'Manage Locations',
            icon: 'map',
            submenu: [],
        }, {
            path: '/subscriber/staff/claimant',
            title: 'Claimants',
            icon: 'dashboard',
            submenu: [{
                path: '/subscriber/staff/new-claimant',
                title: 'Claimant',
                icon: 'dashboard',
                submenu: []
            },{
                path: '/subscriber/staff/edit-claimant',
                title: 'Claimant',
                icon: 'dashboard',
                submenu: []
            }],
            group: "Subscriber",
            role: 2
        }, {
            path: '/subscriber/staff/billable-item',
            title: 'Manage Billable Item',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 2
        }, {
            path: '/subscriber/staff/claims',
            title: 'Manage Claims',
            icon: 'dashboard',
            submenu: [
                {
                    path: '/subscriber/staff/claims/new-claim',
                    title: 'New Claims',
                    icon: 'dashboard',
                    submenu: []
                }],
        }
            // , {
            //     path: '/subscriber/manager/settings',
            //     title: 'Settings',
            //     icon: 'dashboard',
            //     submenu: []
            // },
        ],
    },
    {
        path: 'subscriber/examiner',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [
            {
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
                path: '/subscriber/examiner/appointment',
                title: 'Manage Examination',
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
                path: '/subscriber/examiner/appointment-details',
                title: 'Examination',
                icon: 'dashboard',
                submenu: []
            },
            {
                path: '/subscriber/examiner/settings',
                title: 'Settings',
                icon: 'dashboard',
                submenu: []
            }, {
                path: '/subscriber/examiner/claimant',
                title: 'Claimants',
                icon: 'dashboard',
                submenu: [{
                    path: '/subscriber/examiner/new-claimant',
                    title: 'Claimant',
                    icon: 'dashboard',
                    submenu: []
                },{
                    path: '/subscriber/examiner/edit-claimant',
                    title: 'Claimant',
                    icon: 'dashboard',
                    submenu: []
                }],
                group: "Subscriber",
                role: 2
            }, {
                path: '/subscriber/examiner/billable-item',
                title: 'Manage Billable Item',
                icon: 'dashboard',
                submenu: [],
                group: "Subscriber",
                role: 2
            }, {
                path: '/subscriber/examiner/claims',
                title: 'Manage Claims',
                icon: 'dashboard',
                submenu: [
                    {
                        path: '/subscriber/examiner/claims/new-claim',
                        title: 'New Claims',
                        icon: 'dashboard',
                        submenu: []
                    }],
            }, {
                path: '/subscriber/examiner/manage-location',
                title: 'Manage Locations',
                icon: 'map',
                submenu: [],
            }]
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