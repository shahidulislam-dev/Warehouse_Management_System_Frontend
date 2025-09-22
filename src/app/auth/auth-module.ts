import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { AuthRoutingModule } from './auth-routing-module';

@NgModule({
  declarations: [
    Signup,
    Login
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
