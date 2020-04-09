import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
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
import Auth from '@aws-amplify/auth';
import { UserService } from 'src/app/admin/services/user.service';
import { User } from 'src/app/admin/models/user.model';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as headerActions from "./../../../../shared/store/header.actions";
import * as breadcrumbActions from "./../../../../shared/store/breadcrumb.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  notifications = [
    { name: "Name here", message: "Message content here", date: new Date() },
    { name: "Name here", message: "Message content here", date: new Date() },
    { name: "Name here", message: "Message content here", date: new Date() },
    { name: "Name here", message: "Message content here", date: new Date() },
    { name: "Name here", message: "Message content here", date: new Date() },
    { name: "Name here", message: "Message content here", date: new Date() },
    { name: "Name here", message: "Message content here", date: new Date() }
  ]
  profile = globals.profile
  notification_user = globals.notification_user
  // @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;
  @Input() inputSideNav: MatSidenav;
  elem;
  folders = [];
  currentUserID = "";
  user: User;
  isOpen: any
  isLoading: boolean = false;
  user$: Observable<any>;
  constructor(@Inject(DOCUMENT) private document: any,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private cognitoService: CognitoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService,
    private store: Store<{ header: any }>
  ) {
    this.spinnerService.show();
    this.isLoading = true;
    Auth.currentSession().then(token => {
      this.currentUserID = token['idToken']['payload']['custom:Postgres_UserID'];
      this.userService.getUser(this.currentUserID).subscribe(res => {
        this.user = res.data;
        this.store.dispatch(new headerActions.HeaderAdd(this.user));
        this.cookieService.set('user', JSON.stringify(this.user));
        this.isLoading = false;
        this.spinnerService.hide();
      })
    })
  }

  ngOnInit() {
    this.user$ = this.store.pipe(select('header'));
    this.elem = document.documentElement;
    this.isOpen = this.inputSideNav.opened;
  }

  openSidenav() {
    this.inputSideNav.toggle();
    this.isOpen = this.inputSideNav.opened;
    // this.inputSideNav.toggle().then(res => {
    //   console.table(res)
    // })
  }
  logout() {
    this.spinnerService.show();
    this.cognitoService.logOut().subscribe(response => {
      this.alertService.openSnackBar(success.logoutSuccess, "success")
      this.spinnerService.hide();
      this.cookieService.deleteAll();
      this.router.navigate(['/'])
      this.store.dispatch(new breadcrumbActions.ResetBreadcrumb());
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
      default:
        this.router.navigate(["/settings"]);
        break;
    }
  }
}
