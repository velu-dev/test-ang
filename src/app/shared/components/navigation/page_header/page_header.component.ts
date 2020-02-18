import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subscription, Subject } from 'rxjs';

@Component({
    selector: 'app-page_header',
    templateUrl: './page_header.component.html',
    styleUrls: ['./page_header.component.scss']
})
export class PageHeaderComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {

    }
    openSidenav() {
    }
    ngOnDestroy() {
    }
}
