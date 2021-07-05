import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpErrorResponse }
  from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { switchMap } from "rxjs/operators";
import Auth from "@aws-amplify/auth";
import { catchError } from "rxjs/operators";
import { CookieService } from '../services/cookie.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CognitoService } from '../services/cognito.service';
import { AlertService } from '../services/alert.service';
export const InterceptorSkipHeader = "X-Skip-Interceptor";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  roleId: any;
  constructor(private cookieService: CookieService, private router: Router,
    private cognitoService: CognitoService, private alertService: AlertService) {

  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.has(InterceptorSkipHeader)) {
      const headers = req.headers.delete(InterceptorSkipHeader);
      return next.handle(req.clone({ headers })).pipe(
        catchError((error: HttpErrorResponse) => {
          let err: any = error;
          // console.log(err);
          return throwError(error);
        })
      );
    }
    this.roleId = this.cookieService.get("role_id")
    return from(Auth.currentSession())
      .pipe(
        switchMap(token => {
          const headers: { [name: string]: string | string[] } = {};
          headers["Authorization"] = "Bearer " + token['idToken'].jwtToken;
          headers["role"] = this.roleId;
          headers["x-simplexam-timezone"] = moment && moment.tz && moment.tz.guess() ? moment.tz.guess() : '';
          const newHeader = new HttpHeaders(headers);
          const reqClone = req.clone({
            headers: newHeader
          });

          return next.handle(reqClone);
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let err: any = error;
          console.log(err)
          if (err && err == 'No current user') {
            let url = location.href.split('/').pop();
            if (url != 'verification') {
              this.router.navigate(['/login']);
            }
          }

          if (err && err.status && err.status == 401 && err.error && err.error.is_logout) {
            this.alertService.openSnackBar("Logged in user role mismatch!", "error")
            this.logout();
          }

          return throwError(error);
        })
      );
  }

  logout() {
    this.cognitoService.logOut().subscribe(response => {
      this.cookieService.deleteAll();
      localStorage.clear();
      this.router.navigate(['/'])
    }, error => {
    })
  }
}

