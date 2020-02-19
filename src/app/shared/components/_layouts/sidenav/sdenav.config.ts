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
        }, {
            path: '/admin/users',
            title: 'Manage Admins',
            icon: 'person_add',
            submenu: [{
                path: '/admin/users/new',
                title: 'New User',
                icon: 'dashboard',
                submenu: [],
                group: "Admin",
                role: 1
            }],
            group: "Admin",
            role: 1
        },
        ]

    },
    {
        group: "Subscriber",
        role_id: 1,
        menu: [{
            path: '/subscriber',
            title: 'Subscriber Account',
            icon: 'people_alt',
            submenu: [],
            group: "Admin",
            role: 1
        }, {
            path: '/subscriber/fees',
            title: 'Fees Management',
            icon: 'credit_card',
            submenu: [],
            group: "Admin",
            role: 1
        }
        ]

    },
    {
        group: "Subscriber",
        role_id: 2,
        menu: [{
            path: '/subscriber/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Subscriber",
            role: 2
        }]
    }
]