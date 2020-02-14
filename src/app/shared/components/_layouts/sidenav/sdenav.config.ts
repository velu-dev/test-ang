import { SideNavInterface } from './../../../interfaces/sidenav.type';


export const ROUTES: SideNavInterface[] = [
    {
        group: "Admin",
        menu: [{
            path: '/admin/dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            submenu: [],
            group: "Admin",
            role: 1
        },{
            path: '/admin/users',
            title: 'Manage User',
            icon: 'dashboard',
            submenu: [],
            group: "Admin",
            role: 1
        }]
    }, {
        group: "Subscriber",
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