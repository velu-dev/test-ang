import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: NgxSpinnerService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req)
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => {
                this.loaderService.hide()
            })
        );
    }
}