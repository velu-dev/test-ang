import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpErrorResponse }
  from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { Auth } from "aws-amplify";
import { catchError } from "rxjs/operators";
import { CookieService } from '../services/cookie.service';
export const InterceptorSkipHeader = "X-Skip-Interceptor";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  roleId: any;
  constructor(private cookieService: CookieService) {

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
          headers["role_id"] = this.roleId;
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
          // console.log(err.status);
          return throwError(error);
        })
      );
  }
}
