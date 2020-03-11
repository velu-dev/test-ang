import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';
import Auth from '@aws-amplify/auth';
@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return Auth.currentSession().then(session => {
        let role = this.cookieService.get('role_id')
        if (role) {
        switch (role) {
            case '1':
                this.router.navigate(["/admin"]);
            case '2':
                this.router.navigate(["/subscriber"]);
                break;
            case '3':
                this.router.navigate(["/subscriber/manager"]);
                break;
            case '4':
                this.router.navigate(["/subscriber/staff"]);
                break;
            case '5':
                this.router.navigate(["/vendor/historian"]);
                break;
            case '6':
                this.router.navigate(["/vendor/historian/staff"]);
                break;
            case '7':
                this.router.navigate(["/vendor/summarizer"]);
                break;
            case '8':
                this.router.navigate(["/vendor/summarizer/staff"]);
                break;
            case '9':
                this.router.navigate(["/vendor/transcriber"]);
                break;
            case '10':
                this.router.navigate(["/vendor/transcriber/staff"]);
                break;
            default:
                this.router.navigate(["/"]);
                break;
        }
          return false;
        } else {
          return true;
        }
      }, error => {
        return true;
      })
  }
  
}
