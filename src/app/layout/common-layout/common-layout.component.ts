import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


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
        console.log(this.role)
        if (this.routeUrl != 'admin') {
          this.router.navigate(["/admin"]);
        }
        break;
      case '2':
        if (this.routeUrl != 'subscriber') {
          this.router.navigate(["/subscriber"]);
        }
        break;
      case '5':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/dashboard"]);
        }
        break;
      case '7':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/dashboard"]);
        }
        break;
      case '9':
        if (this.routeUrl != 'vendor') {
          this.router.navigate(["/vendor/dashboard"]);
        }
        break;
      default:
        this.router.navigate(["/"]);
        break;
    }
  }

}
