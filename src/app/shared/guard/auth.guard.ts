import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable} from 'rxjs';
import { CookieService } from '../services/cookie.service';
import { CognitoService } from '../services/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService,private cognitoService: CognitoService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.cognitoService.session().then(session => {
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
