import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InjectionToken } from '@angular/core';

export const MODAL_CONFIG = new InjectionToken<NgbModalOptions>('Modal_config');
