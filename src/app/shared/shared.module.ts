import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AlertComponent } from './components/alert/alert.component';
import { MaterialModule } from './material.module';
import { CognitoService } from './services/cognito.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertService } from './services/alert.service';
import { StoreModule } from '@ngrx/store';
import { breadcrumbreducer } from './store/breadcrumb.reducer';
import { headerreducer } from './store/header.reducer';
import { ExportService } from './services/export.service';
import { ErrorComponent } from './components/error/error.component';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { UserService } from './services/user.service';
import { CookieService } from './services/cookie.service';
import { DialogueComponent } from './components/dialogue/dialogue.component';
import { NodataComponent } from './components/nodata/nodata.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { FilterPipe } from './pipes/filter.pipe';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OwlDateTimeIntl } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time.module';
//import { OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { TextMaskModule } from 'angular2-text-mask';
import { FileTypePipe } from './pipes/file-type.pipe';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AlertDialogueComponent } from './components/alert-dialogue/alert-dialogue.component';

export const MY_MOMENT_FORMATS = {
  parseInput: 'MM-DD-YYYY HH:mm A z',
  fullPickerInput: 'MM-DD-YYYY HH:mm A z',
  datePickerInput: 'MM-DD-YYYY',
  timePickerInput: 'HH:mm:ss',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
  declarations: [
    NotFoundComponent,
    AlertComponent,
    ErrorComponent,
    DialogueComponent,
    AlertDialogueComponent,
    NodataComponent,
    EllipsisPipe,
    FilterPipe,
    FileTypePipe,
    AlertDialogComponent
  ],
  entryComponents: [
    AlertComponent,
    DialogueComponent,
    AlertDialogueComponent,
    NodataComponent,
    AlertDialogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedRoutingModule,
    StoreModule.forFeature("breadcrumb", breadcrumbreducer),
    StoreModule.forFeature("header", headerreducer),
    NgxSkeletonLoaderModule,
    LoggerModule.forRoot({ serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF }),
    NgxMaskModule.forRoot(),
    OwlDateTimeModule, OwlNativeDateTimeModule, OwlMomentDateTimeModule,
    TextMaskModule,
    BreadcrumbModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RecaptchaModule,
    RecaptchaV3Module,
    RecaptchaFormsModule,
    NotFoundComponent,
    AlertComponent,
    ErrorComponent,
    DialogueComponent,
    AlertDialogueComponent,
    NodataComponent,
    NgxSkeletonLoaderModule,
    EllipsisPipe,
    NgxMaskModule,
    LoggerModule,
    FilterPipe,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    TextMaskModule,
    FileTypePipe,
    AlertDialogComponent,
    BreadcrumbModule
  ],
  providers: [
    CognitoService,
    AlertService,
    ExportService,
    UserService,
    CookieService,
    //{ provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: {  } },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }, {
      provide: MatSnackBarRef,
      useValue: {}
    }, {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {} // Add any data you wish to test if it is passed/used correctly
    },
    // { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcKp9oUAAAAAPA16aG4vWRMkKCIkTMr8xKLKiu5' },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6Lfz6doUAAAAANgvOxZA8lZmFEK0vm0v1lWkveLq',
      } as RecaptchaSettings,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    BreadcrumbService,
    DatePipe
  ]
})
export class SharedModule { }
