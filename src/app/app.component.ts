import { Component } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { ROUTES } from './shared/components/navigation/breadcrumb/breadcrumb.config';
import * as breadcrumbActions from "./shared/store/breadcrumb.actions";
import * as fromBreadcrumb from "./shared/store/breadcrumb.reducer";
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
Auth.configure(environment.Amplify);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  breadcrumbList: Array<any> = [];
  menu: Array<any> = [];
  name: string;
  menu$: Observable<any>;
  constructor(private _router: Router, private store: Store<{ breadcrumb: any }>) {
    this.menu$ = store.pipe(select('breadcrumb'));
  }
  ngOnInit() {
    this.listenRouting();
    ROUTES.map(menu => {
      let menuData = {};
      menuData = menu
      menuData['children'] = menu.submenu;
      this.menu.push(menuData)
    })
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  listenRouting() {
    let routerUrl: string, target: any;
    this._router.events.subscribe((router: any) => {
      routerUrl = router.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {
        target = this.menu;
        this.breadcrumbList = [];
        let routerSplit = routerUrl.split("/")
        if (!routerSplit.includes("edit-claim")) {
          localStorage.removeItem("isName")
          localStorage.removeItem("exam_type")
          localStorage.removeItem("claim_number")
          localStorage.removeItem("name")
        }
        routerSplit.shift();
        let menu_join = "";
        routerSplit.map(res => {
          menu_join = menu_join + "/" + res;
          this.menu.map(menu_name => {
            if (res == "*") {
              this.breadcrumbList.push(menu_name)
            } else {
              if (menu_name.path == menu_join) {
                this.breadcrumbList.push(menu_name)
              }
              menu_name.submenu.map(sub => {
                if (!isNaN(Number(res))) {
                  let mm = menu_join.split("/")
                  mm.shift();
                  mm.pop();
                  let menu = '/' + mm.join('/') + '/update'
                  if (menu == sub.path) {
                    this.breadcrumbList.push(sub)
                  }
                }
                if (sub.path == "new-claim") {
                  this.breadcrumbList.push(sub)
                }
                if (sub.path == menu_join) {
                  this.breadcrumbList.push(sub)
                }
              })
            }

          })
        })
        let breadcrumb = this.breadcrumbList
        if (breadcrumb.length != 0) {
          // console.log(breadcrumb)
          this.store.dispatch(new breadcrumbActions.AddBreadcrumb(breadcrumb));
        }
      }
    });
  }
}
