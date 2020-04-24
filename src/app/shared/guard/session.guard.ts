import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';
import { CognitoService } from '../services/cognito.service';
@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService,
    private cognitoService: CognitoService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.cognitoService.session().then(token => {

      let role = this.cookieService.get('role_id')
      if (role) {
        console.log('session', role)
        switch (role) {
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
          // case '5':
          //   this.router.navigate(["/vendor/historian"]);
          //   break;
          // case '6':
          //   this.router.navigate(["/vendor/historian/staff"]);
          //   break;
          // case '7':
          //   this.router.navigate(["/vendor/summarizer"]);
          //   break;
          // case '8':
          //   this.router.navigate(["/vendor/summarizer/staff"]);
          //   break;
          // case '9':
          //   this.router.navigate(["/vendor/transcriber"]);
          //   break;
          // case '10':
          //   this.router.navigate(["/vendor/transcriber/staff"]);
          //   break;
          case '11':
            this.router.navigate(["/subscriber/examiner"]);
            break;
          default:
            this.cookieService.deleteAll()
            return true;
        }
      } else {
        this.cookieService.deleteAll()
        return true;
      }

    }, error => {
      console.log(error);
      this.cookieService.deleteAll()
      return true;
    })


  }

}
