import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { CommonLayoutComponent } from './layout/common-layout/common-layout.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SessionGuard } from './shared/guard/session.guard';
import { TermsOfServiceComponent } from './shared/components/_layouts/terms-of-service/terms-of-service.component';


const routes: Routes = [
  {
    path: "",
    component: FullLayoutComponent,
    canActivate: [SessionGuard],
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  }, {
    path: "subscriber",
    component: CommonLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./subscriber/subscriber.module').then(m => m.SubscriberModule),
    data: { breadcrumb: "Dashboard" }
  }, {
    path: "admin",
    component: CommonLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { breadcrumb: "Dashboard" }
  },
  //  {
  //   path: "vendor",
  //   component: CommonLayoutComponent, 
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule)
  // }, 
  {
    path: "terms-of-service",
    component: TermsOfServiceComponent
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
