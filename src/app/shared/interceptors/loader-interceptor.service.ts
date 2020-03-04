import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    count:number = 0;
    constructor(public loaderService: NgxSpinnerService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        this.count++;
        return next.handle(req).pipe(
            finalize(() => {
                this.count--;
                if ( this.count == 0 ){ this.loaderService.hide ()}
            })
        );
    }
}