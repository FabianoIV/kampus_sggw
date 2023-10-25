import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { API_URL } from './tokens/api-url.token';
import { environment } from '../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { MODAL_CONFIG } from './tokens/ngb-modal-config.token';
import { GlobalErrorsHandler } from './errors/global-errors-handler.service';
import { modalConfig } from '../shared/others/modalConfig';
import { SharedModule } from '../shared/shared.module';


registerLocaleData(localePl, 'pl');

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pl' },
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: MODAL_CONFIG, useValue: modalConfig },
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorsHandler }
  ]
})
export class CoreModule {
}
