import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: 'root' })
export class NotLoggedInGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) {
      return true;
    }

    this.toastr.info('Musisz się wylogować, żeby mieć dostęp do stron logowania i ustawiania hasła.');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
