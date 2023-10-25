import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service';
import { CommonValidators } from '../../../shared/validators/common-validators';
import { MODAL_CONFIG } from '../../../core/tokens/ngb-modal-config.token';
import { MeService } from '../../../core/services/me.service';
import { CurrentAccountToken } from '../../../shared/models/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email = new FormControl('');
  public password = new FormControl('');

  public loginLoading: boolean = false;

  constructor(
    private toastrService: ToastrService,
    private authService: AuthService,
    private meService: MeService,
    private router: Router,
    @Inject(MODAL_CONFIG) private modalConfig: NgbModalOptions,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    //this.email.addValidators([CommonValidators.notEmptyString(this.email)]);
  }

  public forgotYourPassword(): void {
    // TODO:
    // this.modalService.open(ResetPasswordEmailFormComponent, this.modalConfig);
  }

  public async signIn(event?: any): Promise<void> {
    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    // Fixing lastpass error
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.loginLoading = true;

    var loginResult = await this.authService.getTokensAsync(this.email.value, this.password.value);

    if (loginResult.hasError) {
      if (loginResult.errorMessage === 'Invalid credentials') {
        this.toastrService.error('Nieprawidłowe dane logowania.');
      } else if (loginResult.errorMessage === 'account_not_found') {
        this.toastrService.error('Użytkownik o podanym adresie e-mail nie istnieje.');
      } else {
        this.toastrService.error('Błąd logowania.');
      }

      this.loginLoading = false;
      return;
    }

    let tokens: CurrentAccountToken = {
      accessToken: loginResult.accessToken!,
      refreshToken: loginResult.refreshToken!,
    };
    this.authService.saveTokensInLocalStorage(tokens);

    var account = await this.meService.getAccount();

    if (account == undefined) {
      throw new Error('Account is undefined');
    }

    this.authService.saveAccountInLocalStorage(account);

    this.loginLoading = false;
    this.router.navigate(['/']);

    //this.authService.login(this.email.value, this.password.value)
    //  .subscribe(() => {
    //    // this.router.navigate(['/users/list']);
    //  },
    //    e => {
    //      this.loginLoading = false;

    //      if (e.error && e.error === 'Invalid credentials') {
    //        this.toastrService.error('Nieprawidłowe dane logowania.');
    //      } else if (e.error && e.error.code === 'account_not_found') {
    //        this.toastrService.error('Użytkownik o podanym adresie e-mail nie istnieje.');
    //      } else {
    //        throw (e);
    //      }
    //    }
    //  );
  }
}
