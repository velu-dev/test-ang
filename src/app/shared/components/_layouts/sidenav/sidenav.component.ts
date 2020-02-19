import { Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSidenav } from '@angular/material/sidenav';
import { ROUTES } from './sdenav.config';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CognitoService } from './../../../services/cognito.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../alert/alert.component';
import * as success from 'src/app/shared/messages/success';
import { Auth } from 'aws-amplify';
import * as globals from '../../../../globals';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidenavComponent implements OnInit {
  logo_white = globals.logo_white;
  @ViewChild('drawer', { static: false }) sidenav: MatSidenav;
  public menuItems: any;
  elem;
  expandedMenu = "";
  expanded: boolean = false;
  roleId: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private cognitoService: CognitoService,
    @Inject(DOCUMENT) private document: any,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {
    Auth.currentSession().then(token => {
      this.roleId = token['idToken']['payload']['custom:isPlatformAdmin']
      this.menuItems = ROUTES.filter(menuItem => menuItem.role_id == this.roleId);
    })

  }
  ngOnInit() {
    this.elem = document.documentElement;
  }
  clickMenu(menu) {
    this.expanded = this.expandedMenu == menu ? false : false;
    this.expandedMenu = menu;
  }
  navigate(menu) {
    this.router.navigate([menu.path])
  }
  logout() {
    this.spinnerService.show();
    this.cognitoService.logOut().subscribe(response => {
      this.openSnackBar(success.logoutSuccess)
      this.spinnerService.hide();
      this.cookieService.deleteAll();
      this.router.navigate(['/'])
    }, error => {
      this.openSnackBar(error.message)
      this.spinnerService.hide()
    })
  }
  openSnackBar(message) {
    this.snackBar.openFromComponent(AlertComponent, {
      duration: 5 * 100,
      data: message,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });
  }

  isFullScreen = false;
  fullScreen() {
    this.isFullScreen = !this.isFullScreen;
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
