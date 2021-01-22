import { Component, OnInit, ViewChild, Input, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as success from './../../../messages/success';
import * as error from './../../../messages/errors';
import { AlertService } from "./../../../services/alert.service"
import * as globals from './../../../../globals';
import { User } from 'src/app/admin/models/user.model';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, finalize, map, startWith } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as headerActions from "./../../../../shared/store/header.actions";
import * as breadcrumbActions from "./../../../../shared/store/breadcrumb.actions";
import { UserService } from 'src/app/shared/services/user.service';
import { IntercomService } from 'src/app/services/intercom.service';
import { FormControl } from '@angular/forms';

export interface Claimant {
  examiner: string;
  name: string;
  exam_type: string;
  claim_number: string;
  dos: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  claimantCtrl = new FormControl();
  filteredClaimants: any;
  @Output() isClosed: EventEmitter<any> = new EventEmitter<any>();
  claimants: Claimant[] = [
    // {
    //   name: 'Albert Gomez',
    //   examiner: 'Lincoln Yee MD',
    //   exam_type: 'Examination',
    //   claim_number: '2018376761',
    //   dos: '06/13/2020',
    // },
    // {
    //   name: 'Venkatesan Mariyappan',
    //   examiner: 'Martin Sutter',
    //   exam_type: 'Deposition',
    //   claim_number: 'wc-44859883',
    //   dos: '06/13/2020',
    // },
    // {
    //   name: 'Sarath Selvaraj SS',
    //   examiner: 'Lincoln Yee MD',
    //   exam_type: 'Examination',
    //   claim_number: '4567435778',
    //   dos: '06/13/2020',
    // },
    // {
    //   name: 'Rajan Mariappan',
    //   examiner: 'Lincoln Yee MD',
    //   exam_type: 'Examination',
    //   claim_number: '2018376761',
    //   dos: '06/13/2020',
    // }
  ];
  // notifications = [
  //   { name: "Name here", message: "Message content here", date: new Date() },
  //   { name: "Name here", message: "Message content here", date: new Date() },
  //   { name: "Name here", message: "Message content here", date: new Date() },
  //   { name: "Name here", message: "Message content here", date: new Date() },
  //   { name: "Name here", message: "Message content here", date: new Date() },
  //   { name: "Name here", message: "Message content here", date: new Date() },
  //   { name: "Name here", message: "Message content here", date: new Date() }
  // ]
  nav_logo = globals.nav_logo
  profile = globals.profile
  notification_user = globals.notification_user
  // @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;
  @Input() inputSideNav: MatSidenav;
  @Input() isOpened: boolean;
  elem;
  folders = [];
  currentUserID = "";
  user: User;
  isOpen: any;
  isSearch: boolean = false;
  isLoading: boolean = false;
  user$: Observable<any>;
  toggleClass = 'fullscreen';
  role: string;
  filteredClaimant: any;
  constructor(@Inject(DOCUMENT) private document: any,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private cognitoService: CognitoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService,
    private store: Store<{ header: any }>,
    private intercom: IntercomService
  ) {

    this.intercom.getUser().subscribe(info => {
      if (info == true) {
        this.userService.getProfile().subscribe(res => {
          this.user = res.data;
          this.user['signature'] = '';
          this.cookieService.set('user', JSON.stringify(this.user));
        })
      }
    })

    this.spinnerService.show();
    this.isLoading = true;
    this.cognitoService.session().then(token => {
      this.currentUserID = token['idToken']['payload']['custom:Postgres_UserID'];
      this.userService.getProfile().subscribe(res => {
        this.user = res.data;
        this.role = this.getRole(this.user.role_id)
        // this.store.dispatch(new headerActions.HeaderAdd(this.user));
        this.user.role_id = this.cookieService.get('role_id') ? this.cookieService.get('role_id') : res.data.role_id;
        this.user['signature'] = '';
        this.cookieService.set('user', JSON.stringify(this.user));
        this.isLoading = false;
        this.spinnerService.hide();
      })
    })

    // this.filteredClaimants = this.claimantCtrl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(claimant => claimant ? this._filterClaimants(claimant) : this.claimants.slice())
    //   );

    this.claimantCtrl.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(res => {
        if (!res || (res && res.length < 2 && res != '*')) {
          this.filteredClaimants = []
          return;
        }
        if (res.trim()) {
          this.userService.searchClaimant({ "claimant_search_text": res.trim() }).subscribe(search => {
            this.filteredClaimants = search.data ? search.data : [];
          }, error => {
            console.log(error);
            this.filteredClaimants = []
          })

        }
      });
    window.onresize = () => {
      this.ngOnInit();
      this.isOpen = this.inputSideNav.opened;
      this.isClosed.emit(this.isOpen);
      this.isSearch = false;
    };

  }
  private _filterClaimants(value: string): Claimant[] {
    const filterValue = value.toLowerCase();

    return this.claimants.filter(claimant => claimant.name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
    // this.user$ = this.store.pipe(select('header'));
    this.elem = document.documentElement;
    this.isOpen = this.inputSideNav.opened;

  }

  openSidenav() {
    this.inputSideNav.toggle();
    this.isOpen = this.inputSideNav.opened;
    this.isClosed.emit(this.isOpen)
    // this.inputSideNav.toggle().then(res => {
    //   console.table(res)
    // })
  }
  @HostListener('document:fullscreenchange', [])
  @HostListener('document:webkitfullscreenchange', [])
  @HostListener('document:mozfullscreenchange', [])
  @HostListener('document:MSFullscreenChange', [])
  fullscreenmode() {

    if (this.toggleClass == 'fullscreen_exit') {
      this.toggleClass = 'fullscreen';
    }
    else {
      this.toggleClass = 'fullscreen_exit';
    }
    console.log(this.toggleClass)
  }
  logout() {
    this.spinnerService.show();
    this.cognitoService.logOut().subscribe(response => {
      // this.store.dispatch(new breadcrumbActions.ResetBreadcrumb());
      this.alertService.openSnackBar(success.logoutSuccess, "success")
      this.spinnerService.hide();
      this.cookieService.deleteAll();
      this.router.navigate(['/'])
    }, error => {
      this.alertService.openSnackBar(error.logoutSuccess, "error")
      this.spinnerService.hide()
    })
  }

  isFullScreen = false;
  fullScreen() {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  gotoSettings() {

    let role = this.cookieService.get('role_id')
    console.log(role)
    switch (role) {
      case '1':
        this.router.navigate(["/admin/settings"]);
        break;
      case '2':
        this.router.navigate(["/subscriber/settings"]);
        break;
      case '3':
        this.router.navigate(["/subscriber/settings"]);
        break;
      case '4':
        this.router.navigate(["/subscriber/settings"]);
        break;
      case '11':
        this.router.navigate(["/subscriber/examiner/settings"]);
        break;
      case '12':
        this.router.navigate(["/subscriber/settings"]);
        break;
      default:
        this.router.navigate(["/settings"]);
        break;
    }
  }

  getRole(role) {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'Subscriber';
      case 3:
        return 'Staff Manager';
      case 4:
        return 'Staff';
      case 11:
        return 'Examiner';
      case 12:
        return 'Staff Biller';
      default:
        return 'User';
    }
  }

  searchClick(source) {
    this.claimantCtrl.reset();
    let data = source._source;
    let baseUrl = "";
    let role = this.cookieService.get('role_id')
    switch (role) {
      case '1':
        baseUrl = "/admin";
        break;
      case '2':
        baseUrl = "/subscriber/";
        break;
      case '3':
        baseUrl = "/subscriber/manager/";
        break;
      case '4':
        baseUrl = "/subscriber/staff/";
        break;
      case '11':
        baseUrl = "/subscriber/examiner/";
        break;
      case '12':
        baseUrl = "/subscriber/staff/";
        break;
      default:
        baseUrl = "/";
        break;
    }
    if (data.billable_item_id) {
      this.router.navigate([baseUrl + "claimants/claimant/" + data.claimant_id + "/claim/" + data.claim_id + "/billable-item/" + data.billable_item_id]);
      return;
    }

    if (data.claim_id) {
      this.router.navigate([baseUrl + "claimants/claimant/" + data.claimant_id + "/claim/" + data.claim_id]);
      return;
    }

    if (data.claimant_id) {
      this.router.navigate([baseUrl + "claimants/claimant/" + data.claimant_id]);
      return;
    }

  }


}
