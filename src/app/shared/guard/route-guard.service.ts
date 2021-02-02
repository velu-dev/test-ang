import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CognitoService } from '../services/cognito.service';
import { CookieService } from '../services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private router: Router, private cookieService: CookieService, private cognitoService: CognitoService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getRoleDetails(state)
  }

  getRoleDetails(state) {
    let role = this.cookieService.get('role_id');
    if (role == '2') {

      if (state.url.includes('staff') || state.url.includes('manager') || state.url.split('/').includes('examiner')) {
        //this.router.navigate(['**']);
        return false;
      } else {
        return true;
      }
    } else if (role == '3') {
      if (state.url.includes('manager')) {
        return true;
      } else {
        this.router.navigate(['**']);
        return false;
      }

    } else if (role == '4' || role == '12') {
      if (state.url.includes('staff')) {
        return true;
      } else {
        this.router.navigate(['**']);
        return false;
      }

    } else if (role == '11') {
      if (state.url.includes('examiner')) {
        return true;
      } else {
        this.router.navigate(['**']);
        return false;
      }
    } else {
      return true;
    }
  }
}
