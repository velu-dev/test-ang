import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/shared/services/cookie.service';


@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss']
})
export class CommonLayoutComponent implements OnInit {

  // fillerNav = [1,2,3,4,5,6]
  role: any;
  routeUrl: string;
  constructor(private cookieService: CookieService, private router: Router) { }

  ngOnInit() {
    this.role = this.cookieService.get('role_id')
    this.routeUrl = this.router.url.split('/')[1]
    switch (this.role) {
      case '1':
        if (this.routeUrl != 'admin') {
          this.router.navigate(["/admin"]);
        }
        break;
      case '2':
        if (this.routeUrl != 'subscriber') {
          this.router.navigate(["/subscriber"]);
        }
        break;
      case '3':
        if (this.routeUrl != 'subscriber') {
          this.router.navigate(["/subscriber/manager"]);
        }
        break;
      case '4':
        if (this.routeUrl != 'subscriber') {
          this.router.navigate(["/subscriber/staff"]);
        }
        break;
      case '5':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/historian"]);
        }
        break;
      case '6':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/historian/staff"]);
        }
        break;
      case '7':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/summarizer"]);
        }
        break;
      case '8':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/summarizer/staff"]);
        }
        break;
      case '9':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/transcriber/dashboard"]);
        }
        break;
      case '10':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/transcriber/staff"]);
        }
        break;
      default:
        this.router.navigate(["/"]);
        break;
    }
  }

}
