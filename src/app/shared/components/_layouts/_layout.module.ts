import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material.module';
import { TitleBarComponent } from '../navigation/title_bar/title_bar.component';
import { BreadcrumbComponent } from '../navigation/breadcrumb/breadcrumb.component';

@NgModule({
    exports: [
        RouterModule,
        CommonModule,
        HeaderComponent,
        SidenavComponent,
        FooterComponent,
        TitleBarComponent,
        BreadcrumbComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        MaterialModule,
    ],
    declarations: [
        HeaderComponent,
        SidenavComponent,
        FooterComponent,
        TitleBarComponent,
        BreadcrumbComponent
    ],
    providers: [
    ]
})
export class _LayoutModule { }