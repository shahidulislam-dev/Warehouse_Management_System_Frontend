import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { MetarialModule } from './shared/metarial/metarial-module';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth-module';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MetarialModule,
    ReactiveFormsModule,
    CommonModule,
    AuthModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }
