import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetarialModule } from './metarial/metarial-module';
import { Layout } from './layout/layout';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';
import { Content } from './layout/content/content';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Layout,
    Header,
    Sidebar,
    Content
  ],
  imports: [
    CommonModule,
    MetarialModule,
    RouterModule
  ],
  exports: [
    Layout
  ]
})
export class SharedModule { }
