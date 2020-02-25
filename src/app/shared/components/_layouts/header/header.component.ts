import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CognitoService } from 'src/app/shared/services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as success from './../../../messages/success';
import * as error from './../../../messages/errors';
import { AlertService } from "./../../../services/alert.service"
import * as globals from './../../../../globals';
import { Auth } from 'aws-amplify';
import { UserService } from 'src/app/admin/services/user.service';
import { User } from 'src/app/admin/models/user.model';
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
  constructor(@Inject(DOCUMENT) private document: any,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private cognitoService: CognitoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.spinnerService.show();
    Auth.currentSession().then(token => {
      this.currentUserID = token['idToken']['payload']['custom:Postgres_UserID'];
      this.userService.getUser(this.currentUserID).subscribe(res => {
        this.user = res.data;
        this.spinnerService.hide();
      })
    })
  }

  ngOnInit() {
    this.elem = document.documentElement;
  }
  openSidenav() {
    this.inputSideNav.toggle();
  }
  logout() {
    this.spinnerService.show();
    this.cognitoService.logOut().subscribe(response => {
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
}
