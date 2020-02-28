export const ROUTES = [
    {
        path: '/admin/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: []
    }, {
        path: "/admin/admin-users",
        title: "Manage Admin",
        icon: "person_add",
        submenu: [{
            path: '/admin/admin-users/new',
            title: 'New Admin User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/admin/admin-users/update',
            title: 'Edit Admin User',
            icon: 'dashboard',
            submenu: []
        }]
    }, {
        path: "/admin/settings",
        title: "Settings",
        icon: "settings",
        submenu: []
    },{
        path: "/admin/vendors",
        title: "Manage Vendors",
        icon: "settings",
        submenu: []
    }, {
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
            title: 'New Subscribers',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/admin/users/update',
            title: 'Edit Subscribers',
            icon: 'dashboard',
            submenu: []
        }
        ]
    }, {
        path: '/subscriber/users',
        title: 'User Management',
        icon: 'credit_card',
        submenu: [],
    }, {
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
        path: '/vendor/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }, {
        path: '/vendor/settings',
        title: 'Settings',
        icon: 'dashboard',
        submenu: [],
    },
]