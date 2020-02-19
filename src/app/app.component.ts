import { Component } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { ROUTES } from './shared/components/_layouts/sidenav/sdenav.config';
import * as breadcrumbActions from "./shared/store/breadcrumb.actions";
import * as fromBreadcrumb from "./shared/store/breadcrumb.reducer";
import { Store } from '@ngrx/store';
Amplify.configure(environment.Amplify);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  breadcrumbList: Array<any> = [];
  menu: Array<any> = [];
  name: string;

  constructor(private _router: Router, private store: Store<{ count: number }>) {

  }
  ngOnInit() {
    this.listenRouting();
    ROUTES.map(res => {
      res.menu.map(menu => {
        let menuData = {};
        menuData = menu
        menuData['children'] = menu.submenu;
        this.menu.push(menuData)
      })
    })
  }
  listenRouting() {
    let routerUrl: string, target: any;
    this._router.events.subscribe((router: any) => {
      routerUrl = router.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {
        target = this.menu;
        this.breadcrumbList = [];
        let routerSplit = routerUrl.split("/")
        routerSplit.shift();
        let menu_join = "";
        routerSplit.map(res => {
          console.log(res, "fvbdsgdhs")
          menu_join = menu_join + "/" + res;
          this.menu.map(menu_name => {
            if(res == "*"){
              this.breadcrumbList.push(menu_name)
            } else {
              if (menu_name.path == menu_join) {
                this.breadcrumbList.push(menu_name)
              }
              menu_name.submenu.map(sub => {
                if (sub.path == menu_join) {
                  this.breadcrumbList.push(sub)
                }
              })
            }
       
          })
        })
        let breadcrumb= this.breadcrumbList
        this.store.dispatch(new breadcrumbActions.AddBreadcrumb(breadcrumb));
      }
    });
  }
}
