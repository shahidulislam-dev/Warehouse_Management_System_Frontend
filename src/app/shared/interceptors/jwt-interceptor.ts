import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './inteceptor-provider';


export const interceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];
