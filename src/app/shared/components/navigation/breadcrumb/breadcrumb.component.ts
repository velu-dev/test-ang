import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ROUTES } from '../../_layouts/sidenav/sdenav.config';
import { Observable, Subscription, ObservedValueOf } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as breadcrumbActions from "./../../../store/breadcrumb.actions";
import * as frombreadcrumb from "./../../../store/breadcrumb.reducer";
import { async } from '@angular/core/testing';
@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    menu$: Observable<any>;
    roleId: any;
    constructor(private store: Store<{ breadcrumb: any }>) {
        this.menu$ = store.pipe(select('breadcrumb'));
        console.log("breadcrumb", this.menu$)
    }

    ngOnInit() {
        this.store.dispatch(new breadcrumbActions.ListBreadcrumb());

    }
    breadCrumb(menu, index) {
        let menu_data: any;
        // this.menu$.subscribe(res => {
        //     menu_data = res.menu
        //     console.log(menu_data, index)
        //     menu_data.pop()
        //     console.log(menu_data)
            this.store.dispatch(new breadcrumbActions.RemoveBreadcrumb({index: index}));
        // })
        // console.log((), menu, index)
        // 
        // 
    }

    menuChange(menuChange) {

    }
    breadCrumbMain() {
        this.store.dispatch(new breadcrumbActions.ResetBreadcrumb());
    }

}

