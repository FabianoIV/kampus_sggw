import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorsHandler implements ErrorHandler {

  constructor(
    private ngZone: NgZone,
    private injector: Injector
  ) { }

  public handleError(error: any): void {
    this.ngZone.run(() => {
      const toastr = this.injector.get(ToastrService);
      console.log(error);
      toastr.error('Spróbuj ponownie później', 'Wystąpił błąd');
    });
  }
}
