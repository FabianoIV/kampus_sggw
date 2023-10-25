import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MeService } from './me.service';
import { API_URL } from '../tokens/api-url.token';
import { tap } from 'rxjs/operators';
import { CurrentAccount, CurrentAccountToken, LoginResult } from '../../shared/models/account';
import { AppLocalStorage } from './app-local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentAccountTokenSubject$: BehaviorSubject<any> = new BehaviorSubject(this.currentAccountToken);

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private meService: MeService,
    private appLocalStorage: AppLocalStorage,
  ) { }

  get currentAccountToken$(): Observable<CurrentAccountToken> {
    return this.currentAccountTokenSubject$.asObservable();
  }

  get currentAccountToken(): CurrentAccountToken | null {
    var currentAccountTokenJson = localStorage.getItem('currentAccountToken');

    if (currentAccountTokenJson != null) {
      return JSON.parse(currentAccountTokenJson);
    }

    return null;
  }

  private updateCurrentAccountToken(currentAccountToken: CurrentAccountToken): void {
    localStorage.setItem('currentAccountToken', JSON.stringify(currentAccountToken));

    this.currentAccountTokenSubject$.next(currentAccountToken);
    this.meService.getCurrentAccountData();
  }

  public get accessToken(): string | null {
    return this.appLocalStorage.accessToken;
  }

  public get refreshToken(): string | null {
    return this.appLocalStorage.refreshToken;
  }

  public isLoggedIn(): boolean {
    return this.appLocalStorage.currentAccount != null;
  }

  public saveTokensInLocalStorage(tokens: CurrentAccountToken): void {
    this.appLocalStorage.accessToken = tokens.accessToken;
    this.appLocalStorage.refreshToken = tokens.refreshToken;
  }

  public saveAccountInLocalStorage(account: CurrentAccount): void {
    this.appLocalStorage.currentAccount = account;
  }

  public login(email: string | null, password: string | null, deviceToken: string = ''): Observable<CurrentAccountToken> {
    return this.http.post<CurrentAccountToken>(`${this.apiUrl}/api/Tokens/login`, { email, password, deviceToken })
      .pipe(
        tap(currentAccountToken => {
          this.updateCurrentAccountToken(currentAccountToken);
        })
      );
  }

  public async getTokensAsync(email: string | null, password: string | null, deviceToken: string = ''): Promise<LoginResult> {
    const url = `${this.apiUrl}/api/Tokens/login`;
    const body = { email, password, deviceToken };

    let result: LoginResult;

    try {
      var response = await this.http.post<CurrentAccountToken>(url, body).toPromise();

      result = {
        accessToken: response?.accessToken,
        refreshToken: response?.refreshToken,
        hasError: false,
      }
    }
    catch (e) {
      result = {
        hasError: true,
        errorMessage: (e as HttpErrorResponse).error,
      }
    }

    return result;
  }

  public logout(): void {
    this.appLocalStorage.removeAccessToken();
    this.appLocalStorage.removeRefreshToken();
    this.appLocalStorage.removeCurrentAccount();
  }
}
