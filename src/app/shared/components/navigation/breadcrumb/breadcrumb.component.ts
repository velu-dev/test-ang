import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ROUTES } from '../../_layouts/sidenav/sdenav.config';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    @Input() menus: Observable<void>;
    private eventsSubscription: Subscription;

    menuHeader = [];
    appitemsTravel;
    roleId: any;
    breadcrumMenu = [{ menu: "Admin", path: "/admin" }, { menu: "Dashboard", path: "dashboard" }]
    constructor() { }

    ngOnInit() {
        this.menus.subscribe((res) => {
            if (res['submenu'].length != 0) {
                let data = this.menuHeader.find(menu => menu.title === res['title']);
                console.log(data)
                if (data == undefined) {
                    this.appitemsTravel = res;
                    this.menuHeader.push(res);
                }
            }

        });
        Auth.currentSession().then(token => {
            this.roleId = token['idToken']['payload']['custom:isPlatformAdmin']
            this.appitemsTravel = ROUTES.filter(menuItem => menuItem.role_id == this.roleId);
        })
    }
    breadCrumb(menu, index) {
        console.log('sub breadCrumb');
        this.menuHeader.splice(index + 1, this.menuHeader.length - 1);
        if (menu[index] && menu[index].items && menu[index].items.length) {
            this.appitemsTravel = menu[index].items;
        }
    }

    menuChange(menuChange) {

        if (menuChange.items) {

            this.appitemsTravel = menuChange.items;
            this.menuHeader.push({ label: menuChange.label, icon: 'keyboard_arrow_right', items: menuChange.items });
            // this.menuHeader.push(menuChange);

            console.log('hasMultiMenuLabel');
        }
    }
    breadCrumbMain() {
        this.appitemsTravel = ROUTES.filter(menuItem => menuItem.role_id == this.roleId);;
        this.menuHeader = [];
    }

}
