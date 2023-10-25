import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service';
import { MODAL_CONFIG } from '../../../core/tokens/ngb-modal-config.token';
import { MeService } from '../../../core/services/me.service';

@Component({
  selector: 'dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent {

  constructor(
    private toastrService: ToastrService,
    private authService: AuthService,
    private meService: MeService,
    private router: Router,
    @Inject(MODAL_CONFIG) private modalConfig: NgbModalOptions,
    private modalService: NgbModal
  ) { }
}
