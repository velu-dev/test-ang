import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { CommonLayoutComponent } from './layout/common-layout/common-layout.component';


const routes: Routes = [
  {
    path: "",
    component: FullLayoutComponent,
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  }, {
    path: "subscriber",
    component: CommonLayoutComponent,
    loadChildren: () => import('./subscriber/subscriber.module').then(m => m.SubscriberModule)
  }, {
    path: "admin",
    component: CommonLayoutComponent,
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }, {
    path: "vendor",
    component: CommonLayoutComponent,
    loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule)
  }, {
    path: "**",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
