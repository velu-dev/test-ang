import { SideNavInterface } from './../../../interfaces/sidenav.type';


export const ROUTES: SideNavInterface[] = [
    // {
    //     group: "Admin",
    //     role_id: 1,
    //     menu: [{
    //         path: '/admin/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Admin",
    //         role: 1
    //     }]
    // },
    {
        group: "Platform",
        role_id: 1,
        menu: [{
            path: "/admin/admin-users",
            title: "Admins",
            icon: "person",
            submenu: [],
            group: "Admin",
            role: 1
        }, {
            path: '/admin/users',
            title: 'Subscribers',
            icon: 'people_alt',
            submenu: [{
                path: '/admin/users/new',
                title: 'New User',
                icon: 'dashboard',
                submenu: [],
                group: "Admin",
                role: 1
            }, {
                path: '/admin/users/*',
                title: 'Edit User',
                icon: 'dashboard',
                submenu: [],
                group: "Admin",
                role: 1
            }],
            group: "Admin",
            role: 1
        },
            //  {
            //     path: '/admin/vendors',
            //     title: 'Vendor',
            //     icon: 'person_add',
            //     submenu: [],
            //     group: "Admin",
            //     role: 1
            // }
        ]

    }, {
        group: "Subscriber",
        role_id: 2,
        menu: [
            //     {
            //     path: '/subscriber/dashboard',
            //     title: 'Dashboard',
            //     icon: 'dashboard',
            //     submenu: [],
            //     group: "Subscriber",
            //     role: 2
            // },
            {
                path: '/subscriber/users',
                title: 'Manage Users',
                icon: 'supervised_user_circle',
                submenu: [],
                group: "Subscriber",
                role: 2
            }, {
                path: '/subscriber/examiner/appointment',
                title: 'Examination',
                icon: 'dashboard',
                submenu: [],
                group: "Subscriber",
                role: 2
            },
            {
                path: '/subscriber/claimant',
                title: 'Claimants',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 2
            },
            {
                path: '/subscriber/claims',
                title: 'Claims',
                icon: 'speaker_notes',
                submenu: [],
                group: "Subscriber",
                role: 2
            },
            {
                path: '/subscriber/billable-item',
                title: 'Billable Items',
                icon: 'post_add',
                submenu: [],
                group: "Subscriber",
                role: 2
            }, {
                path: '/subscriber/manage-location',
                title: 'Location',
                icon: 'map',
                submenu: [],
                group: "Subscriber",
                role: 2
            }, {
                path: '/subscriber/billing',
                title: 'Billing',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 2
            }]
    }, {
        group: "Subscriber Staff Manager",
        role_id: 3,
        menu: [
            //     {
            //     path: '/subscriber/manager/dashboard',
            //     title: 'Dashboard',
            //     icon: 'dashboard',
            //     submenu: [],
            //     group: "Subscriber",
            //     role: 3
            // }, 
            {
                path: '/subscriber/manager/staff',
                title: 'Manage Staff',
                icon: 'dashboard',
                submenu: [],
                group: "Subscriber",
                role: 3
            }, {
                path: '/subscriber/manager/examiner-list',
                title: 'Manage Examiner',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 3
            }, {
                path: '/subscriber/examiner/appointment',
                title: 'Examination',
                icon: 'dashboard',
                submenu: [],
                group: "Subscriber",
                role: 3
            },
            {
                path: '/subscriber/manager/claimant',
                title: 'Claimants',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 3
            },
            {
                path: '/subscriber/manager/claims',
                title: 'Claims',
                icon: 'speaker_notes',
                submenu: [],
                group: "Subscriber",
                role: 3
            },
            {
                path: '/subscriber/manager/billable-item',
                title: 'Billable Items',
                icon: 'post_add',
                submenu: [],
                group: "Subscriber",
                role: 3
            }, {
                path: '/subscriber/manager/manage-location',
                title: 'Location',
                icon: 'map',
                submenu: [],
                group: "Subscriber",
                role: 3
            }, {
                path: '/subscriber/manager/billing',
                title: 'Billing',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 3
            }]
    }, {
        group: "Subscriber Staff",
        role_id: 4,
        menu: [
            //     {
            //     path: '/subscriber/staff/dashboard',
            //     title: 'Dashboard',
            //     icon: 'dashboard',
            //     submenu: [],
            //     group: "Subscriber",
            //     role: 4
            // }, 
            {
                path: '/subscriber/staff/examiner-list',
                title: 'Manage Examiner',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 4
            }, {
                path: '/subscriber/examiner/appointment',
                title: 'Examination',
                icon: 'dashboard',
                submenu: [],
                group: "Subscriber",
                role: 4
            }, {
                path: '/subscriber/staff/claimant',
                title: 'Claimants',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 4
            },
            {
                path: '/subscriber/staff/claims',
                title: 'Claims',
                icon: 'speaker_notes',
                submenu: [],
                group: "Subscriber",
                role: 4
            },
            {
                path: '/subscriber/staff/billable-item',
                title: 'Billable Items',
                icon: 'post_add',
                submenu: [],
                group: "Subscriber",
                role: 4
            },
            {
                path: '/subscriber/staff/manage-location',
                title: 'Location',
                icon: 'map',
                submenu: [],
                group: "Subscriber",
                role: 4
            }, {
                path: '/subscriber/examiner/billing',
                title: 'Billing',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 4
            },]
    },
    {
        group: "Examiner",
        role_id: 11,
        menu: [
            //     {
            //     path: '/subscriber/examiner/',
            //     title: 'Dashboard',
            //     icon: 'dashboard',
            //     submenu: [],
            //     group: "Subscriber",
            //     role: 11
            // },
            {
                path: '/subscriber/examiner/appointment',
                title: 'Examination',
                icon: 'dashboard',
                submenu: [],
                group: "Subscriber",
                role: 11
            }, {
                path: '/subscriber/examiner/claimant',
                title: 'Claimants',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 11
            },
            {
                path: '/subscriber/examiner/claims',
                title: 'Claims',
                icon: 'speaker_notes',
                submenu: [],
                group: "Subscriber",
                role: 11
            },
            {
                path: '/subscriber/examiner/billable-item',
                title: 'Billable Items',
                icon: 'post_add',
                submenu: [],
                group: "Subscriber",
                role: 11
            }, {
                path: '/subscriber/examiner/manage-location',
                title: 'Location',
                icon: 'map',
                submenu: [],
                group: "Subscriber",
                role: 11
            }, {
                path: '/subscriber/examiner/billing',
                title: 'Billing',
                icon: 'people',
                submenu: [],
                group: "Subscriber",
                role: 11
            },]
    },
    // {
    //     group: "Vendor Historian",
    //     role_id: 5,
    //     menu: [{
    //         path: '/vendor/historian/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 5
    //     }, {
    //         path: '/vendor/historian/users',
    //         title: 'Manage Users',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 5
    //     }]
    // },
    // {
    //     group: "Vendor Historian Staff",
    //     role_id: 6,
    //     menu: [{
    //         path: '/vendor/historian/staff/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 6
    //     }]
    // },
    // {
    //     group: "Vendor Summarizer",
    //     role_id: 7,
    //     menu: [{
    //         path: '/vendor/summarizer/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 7
    //     }, {
    //         path: '/vendor/summarizer/users',
    //         title: 'Manage Users',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 7
    //     }]
    // }, {
    //     group: "Vendor Summarizer Staff",
    //     role_id: 8,
    //     menu: [{
    //         path: '/vendor/summarizer/staff/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 8
    //     }]
    // }, {
    //     group: "Vendor Transcriber",
    //     role_id: 9,
    //     menu: [{
    //         path: '/vendor/transcriber/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 9
    //     }, {
    //         path: '/vendor/transcriber/users',
    //         title: 'Manage Users',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 9
    //     }]
    // },
    // {
    //     group: "Vendor Transcriber Staff",
    //     role_id: 10,
    //     menu: [{
    //         path: '/vendor/transcriber/staff/dashboard',
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         submenu: [],
    //         group: "Vendor",
    //         role: 6
    //     }]
    // },
]