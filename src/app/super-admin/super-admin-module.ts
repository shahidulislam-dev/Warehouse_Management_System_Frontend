import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing-module';
import { MetarialModule } from "../shared/metarial/metarial-module";
import { SharedModule } from '../shared/shared-module';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    MetarialModule,
    MatButtonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
]
})
export class SuperAdminModule { }
