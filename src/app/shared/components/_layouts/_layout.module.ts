import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material.module';
import { PageHeaderComponent } from '../navigation/page_header/page_header.component';
import { BreadcrumbComponent } from '../navigation/breadcrumb/breadcrumb.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

@NgModule({
    exports: [
        RouterModule,
        CommonModule,
        HeaderComponent,
        SidenavComponent,
        FooterComponent,
        PageHeaderComponent,
        BreadcrumbComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        MaterialModule,
        NgxSpinnerModule
    ],
    declarations: [
        HeaderComponent,
        SidenavComponent,
        FooterComponent,
        PageHeaderComponent,
        BreadcrumbComponent,
        TermsOfServiceComponent
    ],
    providers: [
    ]
})
export class _LayoutModule { }