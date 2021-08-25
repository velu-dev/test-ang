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
import { ClaimService } from './subscriber/service/claim.service';
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
    private cookieService: CookieService, private claimService: ClaimService) {
      window.addEventListener('storage', (event) => {
        if (event.storageArea == localStorage) {
          const token = localStorage.getItem('SYb+KUjt03Mkgz22hYyCXR3hloq2jrRXu6ozoRJPos8=');
          if(token == undefined) { // you can update this as per your key
              // DO LOGOUT FROM THIS TAB AS WELL
              if(this._router.url !== '/terms-of-service') {
                this._router.navigate(['/']); // If you are using router
              }
              // OR
              // window.location.href = '<home page URL>';
          }
          if(event.key === 'SYb+KUjt03Mkgz22hYyCXR3hloq2jrRXu6ozoRJPos8=' && _router.url === '/') {
            this._router.navigate(['/subscriber']);
          }
        }
      }, false);
    // this.claimService.seedData('state').subscribe(res => {
    //   this.cookieService.set("states", res.data);
    // })
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

    this.intercom.getBillableItem().subscribe(bill => {
      if (!bill) {
        this.breadcrumbService.set("@Billable Item", "Billable Item")
      } else {
        this.breadcrumbService.set("@Billable Item", bill)
      }
    })

    this.intercom.getBillNo().subscribe(billno => {
      if (!billno) {
        this.breadcrumbService.set("@Bill", "Bill")
      } else {
        this.breadcrumbService.set("@Bill", billno)
      }
    })

    document.addEventListener("wheel", function(event){
      const activeElement: any = document.activeElement;
      if(activeElement.type === "number"){
        activeElement.blur();
      }
    });

  }
  ngOnInit() {
    let claimant = this.cookieService.get('claimDetails');

    if (claimant && claimant != 'null') {
      this.breadcrumbService.set("@Claimant", claimant)
    }

    let claimNumber = this.cookieService.get('claimNumber');
    if (claimNumber && claimNumber != 'null') {
      this.breadcrumbService.set("@Claim", claimNumber)
    } else {
      this.breadcrumbService.set("@Claim", 'Claim')
    }

    let bill = this.cookieService.get('billableItem');
    if (!bill || bill == 'null') {
      this.breadcrumbService.set("@Billable Item", "Billable Item")
    } else {
      this.breadcrumbService.set("@Billable Item", bill)
    }

    let billno = this.cookieService.get('billNo');
    if (!billno || billno == 'null') {
      this.breadcrumbService.set("@Bill", "Bill")
    } else {
      this.breadcrumbService.set("@Bill", billno)
    }

  }

  onActivate(event) {
    window.scroll(0, 0);
  }

}

export class StateController {
  states = [];
  constructor(private claimService: ClaimService) {
    // this.claimService.seedData('state').subscribe(res => {
    //   this.states = res.data;
    // })
  }

  get getState() {
    return this.states;
  }
}