import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ROUTES } from '../../_layouts/sidenav/sdenav.config';
import { Observable, Subscription, ObservedValueOf } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as breadcrumbActions from "./../../../store/breadcrumb.actions";
import * as frombreadcrumb from "./../../../store/breadcrumb.reducer";
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    menu$: Observable<any>;
    roleId: any;
    constructor(private router: Router, private store: Store<{ breadcrumb: any }>) {
        this.menu$ = store.pipe(select('breadcrumb'));
    }

    ngOnInit() {
        this.store.dispatch(new breadcrumbActions.ListBreadcrumb());
    }
    breadCrumb(menu, index) {
        this.router.navigate([menu.path])
        this.store.dispatch(new breadcrumbActions.RemoveBreadcrumb({ index: index }));
    }
    breadCrumbMain() {
        this.router.navigate(['/'])
        this.store.dispatch(new breadcrumbActions.ResetBreadcrumb());
    }

}

