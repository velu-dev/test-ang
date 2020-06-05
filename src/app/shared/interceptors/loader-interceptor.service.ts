import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    constructor(public loaderService: NgxSpinnerService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => {
                this.totalRequests--;
                if (this.totalRequests === 0) {
                    this.loaderService.hide();
                }
            })
        );
    }
}