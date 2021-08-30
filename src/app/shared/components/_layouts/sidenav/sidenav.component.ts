import { Component, OnInit, ViewChild, Inject, Output, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSidenav } from '@angular/material/sidenav';
import { ROUTES } from './sdenav.config';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as globals from '../../../../globals';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './../../../services/user.service';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { HeaderComponent } from '../header/header.component';
import { IntercomService } from 'src/app/services/intercom.service';

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
  simplexam_logo = globals.simplexam_logo;
  nav_logo = globals.simplexam_logo;
  icon_logo = globals.icon_logo;
  switch_user = globals.switch_user;
  @ViewChild('drawer', { static: false }) sidenav: MatSidenav;
  @ViewChild(HeaderComponent, { static: false }) header: HeaderComponent;

  public menuItems: any;
  expanded: boolean = false;
  roleId: any;
  isTablet: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet).pipe(map(result => result.matches), shareReplay());
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());
  isDesktop: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large]).pipe(map(result => result.matches), shareReplay());
  isMobile: boolean = false;
  isTab: boolean = false;
  role: any;
  is_subscriber: any;
  isOpen: any = true;
  sameAsExaminer: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private snackBar: MatSnackBar,
    private loaderService: NgxSpinnerService,
    private userService: UserService,
    private cookieService: CookieService,
    private intercom: IntercomService,
    private cd: ChangeDetectorRef
  ) {

    this.intercom.getUserChanges().subscribe(info => {
      if (info == true) {
        this.is_subscriber = this.cookieService.get('is_subscriber');
        if (this.is_subscriber) {
          this.userService.verifyUserRole().subscribe(role => {
            this.sameAsExaminer = role.status;
          }, error => {
            console.log(error.error.status)
            this.sameAsExaminer = false;
          })
        }
      }
    })
    this.is_subscriber = this.cookieService.get('is_subscriber');
    this.screenWidth = window.innerWidth;
    this.roleId = this.cookieService.get("role_id");
    this.menuItems = ROUTES.filter(menuItem => menuItem.role_id == this.roleId);
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth < 1240) {
        this.sidenav.close();
        this.isOpen = false;
      } else {
        this.sidenav.open();
        this.isOpen = true;
      }
    };
    this.isHandset$.subscribe(res => {
      this.isMobile = res;
    })
    this.isTablet.subscribe(res => {
      this.isTab = res;
    })

    this.loaderService.hide();

  }
  progressPercentage = 0
  ngOnInit() {
    if (this.is_subscriber) {
      this.userService.verifyUserRole().subscribe(role => {
        this.sameAsExaminer = role.status;
      }, error => {
        console.log(error.error.status)
        this.sameAsExaminer = false;
      })
    }

  }
  ngAfterViewInit() {
    this.intercom.getLoaderPercentage().subscribe(number => {
      this.progressPercentage = number;
    })
  }
  navigate() {
    this.intercom.setExaminerPage(false);
    if (this.isMobile || this.isTab) {
      this.sidenav.close();
    }
  }
  isclosed(status) {
    this.isOpen = status;
  }
  openSidenav() {
    // this.sidenav.toggle();
    this.header.openSidenav();
    this.isOpen = this.sidenav.opened;
  }
  changeRole() {
    if (this.roleId == 2) {
      this.userService.changeRole().subscribe(res => {
        if (res.status) {
          console.log(res.data.role_id)
          this.cookieService.set("role_id", res.data.role_id);
          this.router.navigate(["/"]);
          setTimeout(data => {
            window.location.reload();
          }, 500)

        }
      })
    }
    if (this.roleId == 11) {
      this.cookieService.set("role_id", 2);
      this.router.navigate(["/"]);
      setTimeout(data => {
        window.location.reload();
      }, 500)
    }
  }

  mainPage() {
    this.role = this.cookieService.get('role_id')
    switch (this.role) {
      case '1':
        this.router.navigate(["/admin"]);
        break;
      case '2':
        this.router.navigate(["/subscriber"]);
        break;
      case '3':
        this.router.navigate(["/subscriber/manager"]);
        break;
      case '4':
        this.router.navigate(["/subscriber/staff"]);
        break;
      case '11':
        this.router.navigate(["/subscriber/examiner"]);
        break;
      case '12':
        this.router.navigate(["/subscriber/staff"]);
        break;
      default:
        this.router.navigate(["/"]);
        break;
    }
  }

}
