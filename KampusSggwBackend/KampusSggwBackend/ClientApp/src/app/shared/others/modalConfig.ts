import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// 'backdrop: 'static' prevents modal from closing by clicking outside; 'keyboard': false prevents modal from closing by clicking ESC
export const modalConfig: NgbModalOptions = { centered: true, size: 'lg', backdrop: 'static', keyboard: false };
