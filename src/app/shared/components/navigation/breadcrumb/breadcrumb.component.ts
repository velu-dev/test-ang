import { Component, OnInit, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

breadcrumMenu = [{menu:"Admin", path: "/admin"}, {menu: "Dashboard", path: "dashboard"}]
    constructor() { }

    ngOnInit() {
    }
}
