import { Component } from '@angular/core';
import { MeService } from '../core/services/me.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(
    public router: Router,
    public meService: MeService,
    public authService: AuthService,
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public collapse() {
    this.isExpanded = false;
  }

  public toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public logOut(): void {
    this.authService.logout();
    const currentUrl = this.router.url;
    this.router.navigate([currentUrl]);
  }
}
