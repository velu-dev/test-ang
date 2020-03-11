import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable} from 'rxjs';
import Auth from '@aws-amplify/auth';
import { CookieService } from '../services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return Auth.currentSession().then(session => {
      let role = this.cookieService.get('role_id')
      if (role) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }, error => {
      this.router.navigate(['/login']);
      console.log(error)
      return false;
    })

  }

}
