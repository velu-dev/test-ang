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
            icon: "person_add",
            submenu: [],
            group: "Admin",
            role: 1
        }, {
            path: '/admin/users',
            title: 'Subscriber',
            icon: 'person_add',
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
        }, {
            path: '/admin/vendors',
            title: 'Vendor',
            icon: 'person_add',
            submenu: [],
            group: "Admin",
            role: 1
        }
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
    },
    {
        group: "Vendor",
        role_id: 5,
        menu: [{
            path: '/vendor/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 5
        }, {
            path: '/vendor/users',
            title: 'Manage Users',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 5
        }]
    }
]