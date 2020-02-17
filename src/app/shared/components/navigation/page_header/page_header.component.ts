import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subscription, Subject } from 'rxjs';

@Component({
    selector: 'app-page_header',
    templateUrl: './page_header.component.html',
    styleUrls: ['./page_header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    breadcrumbEvent: Subject<void> = new Subject<void>();
    @Input() events: Observable<void>;
    menu: any;
    // private eventsSubscription: Subscription
    // @Input() menu: string;

    constructor() {
        // console.log(menu)
    }

    ngOnInit() {
        this.menu = this.events.subscribe((res) => {
            this.breadcrumbEvent.next(res)
        });
    }
    openSidenav() {
    }
    ngOnDestroy() {
        // this.eventsSubscription.unsubscribe();
    }
}
