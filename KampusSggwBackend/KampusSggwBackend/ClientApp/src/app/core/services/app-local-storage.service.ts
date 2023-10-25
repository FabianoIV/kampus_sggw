import { Injectable } from "@angular/core";
import { CurrentAccount } from "../../shared/models/account";

@Injectable({
  providedIn: 'root',
})
export class AppLocalStorage {
  // local storage keys
  private accessTokenKey: string = 'accessToken';
  private refreshTokenKey: string = 'refreshToken';
  private currentAccountKey: string = 'account';

  // getters and setters
  get accessToken(): string {
    let val = localStorage.getItem(this.accessTokenKey);
    return val == null ? '' : val;
  }

  set accessToken(value: string) {
    localStorage.setItem(this.accessTokenKey, value);
  }

  public removeAccessToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

  get refreshToken(): string {
    let val = localStorage.getItem(this.refreshTokenKey);
    return val == null ? '' : val;
  }

  set refreshToken(value: string) {
    localStorage.setItem(this.refreshTokenKey, value);
  }

  public removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenKey);
  }

  get currentAccount(): CurrentAccount | null {
    let val = localStorage.getItem(this.currentAccountKey);

    if (val == null) {
      return null;
    }

    return JSON.parse(val);
  }

  set currentAccount(value: CurrentAccount | null) {
    localStorage.setItem(this.currentAccountKey, JSON.stringify(value));
  }

  public removeCurrentAccount(): void {
    localStorage.removeItem(this.currentAccountKey);
  }
}
