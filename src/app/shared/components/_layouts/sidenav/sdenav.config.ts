import { SideNavInterface } from './../../../interfaces/sidenav.type';


export const ROUTES: SideNavInterface[] = [
    {
        group: "Admin",
        role_id: 1,
        menu: [{
            path: '/admin/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Admin",
            role: 1
        }]
    },
    {
        group: "User Management",
        role_id: 1,
        menu: [{
            path: "/admin/admin-users",
            title: "Platform Admin",
            icon: "person",
            submenu: [],
            group: "Admin",
            role: 1
        }, {
            path: '/admin/users',
            title: 'Subscriber',
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
        menu: [{
            path: '/subscriber/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 2
        }, {
            path: '/subscriber/users',
            title: 'Manage Users',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 2
        }]
    }, {
        group: "Subscriber Staff manager",
        role_id: 3,
        menu: [{
            path: '/subscriber/manager/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 3
        }, {
            path: '/subscriber/manager/staff',
            title: 'Staff List',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 3
        }]
    }, {
        group: "Subscriber Staff",
        role_id: 4,
        menu: [{
            path: '/subscriber/staff/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 4
        }]
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