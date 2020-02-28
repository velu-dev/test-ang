import { Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSidenav } from '@angular/material/sidenav';
import { ROUTES } from './sdenav.config';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from 'aws-amplify';
import * as globals from '../../../../globals';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './../../../services/user.service';
import { CookieService } from 'ngx-cookie-service';

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
  screenWidth: number;
  logo_white = globals.logo_white;
  @ViewChild('drawer', { static: false }) sidenav: MatSidenav;
  public menuItems: any;
  expanded: boolean = false;
  roleId: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isMobile: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private snackBar: MatSnackBar,
    private loaderService: NgxSpinnerService,
    private userService: UserService,
    private cookieService: CookieService
  ) {
    this.loaderService.show();
    this.screenWidth = window.innerWidth;
    this.roleId = this.cookieService.get("role_id");
    this.menuItems = ROUTES.filter(menuItem => menuItem.role_id == this.roleId);
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.loaderService.hide();

  }
  ngOnInit() {

  }
  ngAfterViewInit() {
  }
  navigate() {
    if (this.isMobile) {
      this.sidenav.toggle();
    }
  }

}
