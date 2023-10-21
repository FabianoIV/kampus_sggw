import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from "ngx-toastr";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private refreshTokenInProgress: boolean;
  private refreshTokenInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addTokenToRequest(request)).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      }));
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    return this.authService.currentAccountToken ?
      request.clone({ setHeaders: { Authorization: `Bearer ${this.authService.currentAccountToken.accessToken.value}` } })
      : request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.refreshTokenInProgress) {
      return this.refreshTokenInProgress$.pipe(
        filter(Boolean),
        take(1),
        switchMap(() => next.handle(this.addTokenToRequest(request)))
      );
    }

    this.updateRefreshTokenInProgress(true);

    return this.authService.refreshToken().pipe(
      switchMap(() => {
        this.updateRefreshTokenInProgress(false);

        return next.handle(this.addTokenToRequest(request));
      }),
      catchError(error => {
        if (error.error && error.error.code === 'invalid_refresh_token') {
          this.toastr.error('Wystąpiły problemy z Twoim kontem. Spróbuj zalogować się ponownie lub skontaktuj się z Administratorem Głównym.');
        }

        this.authService.logout();
        this.refreshTokenInProgress = false;
        return throwError(error);
      })
    );
  }

  private updateRefreshTokenInProgress(inProgress: boolean): void {
    this.refreshTokenInProgress = inProgress;
    this.refreshTokenInProgress$.next(!inProgress);
  }
}
