import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../tokens/api-url.token';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentAccount } from '../../shared/models/account';
import { AppLocalStorage } from './app-local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MeService {
  private currentAccountSubject$: BehaviorSubject<any> = new BehaviorSubject(this.currentAccount);

  constructor(
    private http: HttpClient,
    private appLocalStorage: AppLocalStorage,
    @Inject(API_URL) private apiUrl: string
  ) {
  }

  get currentAccount$(): Observable<CurrentAccount> {
    return this.currentAccountSubject$.asObservable();
  }

  public setCurrentAccount$(value: any): void {
    this.currentAccountSubject$.next(value);
  }

  get currentAccount(): CurrentAccount | null {
    var currentAccountJson = localStorage.getItem('currentAccount');

    if (currentAccountJson != null) {
      return JSON.parse(currentAccountJson);
    }

    return null;
  }

  public getCurrentAccountData(): void {
    console.log('me');

    this.http.get<CurrentAccount>(`${this.apiUrl}/api/Account/me`)
      .subscribe(currentAccount => {
        localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
        this.currentAccountSubject$.next(currentAccount);
      });
  }

  public async getAccount(): Promise<CurrentAccount | undefined> {
    var url = `${this.apiUrl}/api/Account/me`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.appLocalStorage.accessToken}`,
    });

    var responsePromise = this.http.get<CurrentAccount>(url, { headers: headers }).toPromise();
    return responsePromise;
  }

  public changeMyPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/me/change-password`, { currentPassword, newPassword });
  }

  public setPassword(verificationToken: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/me/set-password`, { verificationToken, newPassword });
  }

  public sendResetPasswordLink(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/me/send-reset-password-link`, { email });
  }
}
