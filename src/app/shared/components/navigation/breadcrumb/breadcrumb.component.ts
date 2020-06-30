import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ROUTES } from '../../_layouts/sidenav/sdenav.config';
import { Observable, Subscription, ObservedValueOf } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as breadcrumbActions from "./../../../store/breadcrumb.actions";
import * as frombreadcrumb from "./../../../store/breadcrumb.reducer";
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/shared/services/cookie.service';
@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    menu$: Observable<any>;
    roleId: any;
    role: any;
    routeUrl: string;
    isname: string = 'false';
    name: string = "";
    constructor(private router: Router, private store: Store<{ breadcrumb: any }>, private cookieService: CookieService) {
        this.menu$ = store.pipe(select('breadcrumb'));
        // this.menu$.subscribe(res => {
        //     this.isname = localStorage.getItem("isName")
        //     this.name = localStorage.getItem("name")
        // })
    }

    ngOnInit() {

        this.store.dispatch(new breadcrumbActions.ListBreadcrumb());
    }
    breadCrumb(menu, index) {
        if(menu.submenu.length != 0){ 
        this.router.navigate([menu.path])
        }
        this.store.dispatch(new breadcrumbActions.RemoveBreadcrumb({ index: index }));
    }
    breadCrumbMain() {
        // this.router.navigate(['/'])
        this.role = this.cookieService.get('role_id')
        this.routeUrl = this.router.url.split('/')[1]

        switch (this.role) {
            case '1':
                this.router.navigate(["/admin"]);
                break;
            case '2':
                this.router.navigate(["/subscriber"]);
                break;
            case '3':
                this.router.navigate(["/subscriber/manager"]);
                break;
            case '4':
                this.router.navigate(["/subscriber/staff"]);
                break;
            // case '5':
            //     this.router.navigate(["/vendor/historian"]);
            //     break;
            // case '6':
            //     this.router.navigate(["/vendor/historian/staff"]);
            //     break;
            // case '7':
            //     this.router.navigate(["/vendor/summarizer"]);
            //     break;
            // case '8':
            //     this.router.navigate(["/vendor/summarizer/staff"]);
            //     break;
            // case '9':
            //     this.router.navigate(["/vendor/transcriber"]);
            //     break;
            // case '10':
            //     this.router.navigate(["/vendor/transcriber/staff"]);
            //     break;
            case '11':
                this.router.navigate(["/subscriber/examiner"]);
                break;
            default:
                this.router.navigate(["/"]);
                break;
        }
        this.store.dispatch(new breadcrumbActions.ResetBreadcrumb());
    }

}

