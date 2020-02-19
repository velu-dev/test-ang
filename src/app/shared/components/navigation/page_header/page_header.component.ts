import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subscription, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';

@Component({
    selector: 'app-page_header',
    templateUrl: './page_header.component.html',
    styleUrls: ['./page_header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    page_title = "";
    menu$: Observable<any>;
    constructor(private title: Title,  private store: Store<{ breadcrumb: any }>) {
        this.menu$ = store.pipe(select('breadcrumb'));
        this.page_title = this.title.getTitle();
    }

    ngOnInit() {
        this.menu$.subscribe(res => {
            console.log("after login", res)
        })

    }
    openSidenav() {
    }
    ngOnDestroy() {
    }
}
