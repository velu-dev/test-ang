import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MaterialModule } from './material.module';
import { CognitoService } from './services/cognito.service';


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    MaterialModule
  ],
  providers: [
    CognitoService
  ]
})
export class SharedModule { }
