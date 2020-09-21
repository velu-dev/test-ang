import { Component } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { ROUTES } from './shared/components/navigation/breadcrumb/breadcrumb.config';
import * as breadcrumbActions from "./shared/store/breadcrumb.actions";
import * as fromBreadcrumb from "./shared/store/breadcrumb.reducer";
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IntercomService } from './services/intercom.service';
import { CookieService } from './shared/services/cookie.service';
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
  constructor(private _router: Router, private store: Store<{ breadcrumb: any }>,
    private breadcrumbService: BreadcrumbService,
    private intercom: IntercomService,
    private cookieService: CookieService) {
    this.intercom.getClaimant().subscribe(name => {
      this.breadcrumbService.set("@Claimant", name)
    })

    this.intercom.getClaimNumber().subscribe(number => {
      if (!number) {
        this.breadcrumbService.set("@Claim", "Claim")
      } else {
        this.breadcrumbService.set("@Claim", number)
      }
    })

    //this.menu$ = store.pipe(select('breadcrumb'));
    //this.breadcrumbService.set("subscriber/appointment/appointment-details/:claim_id/:bill_id", "sarath22")

  }
  ngOnInit() {
   // this.listenRouting();
    // ROUTES.map(menu => {
    //   let menuData = {};
    //   menuData = menu
    //   menuData['children'] = menu.submenu;
    //   this.menu.push(menuData)
    // })

   let claimant =  this.cookieService.get('claimDeatis');
  
   if(claimant && claimant != 'null'){
    this.breadcrumbService.set("@Claimant", claimant)
   }

   let claimNumber =  this.cookieService.get('claimNumber');
   console.log(claimNumber)
   if(claimNumber && claimNumber != 'null'){
    this.breadcrumbService.set("@Claim", claimNumber)
   }else{
    this.breadcrumbService.set("@Claim", 'Claim')
   }
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  // listenRouting() {
  //   let routerUrl: string, target: any;
  //   this._router.events.subscribe((router: any) => {
  //     routerUrl = router.urlAfterRedirects;
  //     if (routerUrl && typeof routerUrl === 'string') {
  //       target = this.menu;
  //       this.breadcrumbList = [];
  //       let routerSplit = routerUrl.split("/")
  //       if (!routerSplit.includes("edit-claim")) {
  //         localStorage.removeItem("isName")
  //         localStorage.removeItem("exam_type")
  //         localStorage.removeItem("claim_number")
  //         localStorage.removeItem("name")
  //       }
  //       routerSplit.shift();
  //       let menu_join = "";
  //       routerSplit.map(res => {
  //         menu_join = menu_join + "/" + res;
  //         this.menu.map(menu_name => {
  //           if (res == "*") {
  //             this.breadcrumbList.push(menu_name)
  //           } else {
  //             if (menu_name.path == menu_join) {
  //               this.breadcrumbList.push(menu_name)
  //             }
  //             menu_name.submenu.map(sub => {
  //               if (!isNaN(Number(res))) {
  //                 let mm = menu_join.split("/")
  //                 mm.shift();
  //                 mm.pop();
  //                 let menu = '/' + mm.join('/') + '/update'
  //                 if (menu == sub.path) {
  //                   this.breadcrumbList.push(sub)
  //                 }
  //               }
  //               if (sub.path == "new-claim") {
  //                 this.breadcrumbList.push(sub)
  //               }
  //               if (sub.path == menu_join) {
  //                 this.breadcrumbList.push(sub)
  //               }
  //             })
  //           }

  //         })
  //       })
  //       let breadcrumb = this.breadcrumbList
  //       if (breadcrumb.length != 0) {
  //         // console.log(breadcrumb)
  //         this.store.dispatch(new breadcrumbActions.AddBreadcrumb(breadcrumb));
  //       }
  //     }
  //   });
  // }
}
