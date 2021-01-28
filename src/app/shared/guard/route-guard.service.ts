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
    return this.cognitoService.session().then(session => {
      let role = this.cookieService.get('role_id')
      if (role == '4' || role == '12') {
        if(state.url.includes('staff')){
          return true;
        }else{
          this.router.navigate(['**']);
          return false;
        }
        
      }else{
        return true;
      }
    }, error => {
      this.router.navigate(['/login']);
      console.log(error)
      return false;
    })
  }
}
