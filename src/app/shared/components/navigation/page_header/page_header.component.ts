import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subscription, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-page_header',
    templateUrl: './page_header.component.html',
    styleUrls: ['./page_header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    page_title = "";
    constructor(private title: Title) {
        this.page_title = this.title.getTitle();
        console.log(this.page_title)
    }

    ngOnInit() {

    }
    openSidenav() {
    }
    ngOnDestroy() {
    }
}
