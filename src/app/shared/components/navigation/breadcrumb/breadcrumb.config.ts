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
        submenu: []
    }, {
        path: "/admin/settings",
        title: "Settings",
        icon: "settings",
        submenu: []
    }, {
        path: "/admin/profile",
        title: "Profile",
        icon: "person",
        submenu: []
    }, {
        path: '/admin/users',
        title: 'Manage Users',
        icon: 'person_add',
        submenu: [{
            path: '/admin/users/new',
            title: 'New User',
            icon: 'dashboard',
            submenu: []
        }, {
            path: '/admin/users/*',
            title: 'Edit User',
            icon: 'dashboard',
            submenu: []
        }]
    }, {
        path: '/subscriber',
        title: 'Subscriber Account',
        icon: 'people_alt',
        submenu: [],
    }, {
        path: '/subscriber/fees',
        title: 'Fees Management',
        icon: 'credit_card',
        submenu: [],
    }, {
        path: '/subscriber/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        submenu: [],
    }
]