import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MODAL_CONFIG } from '../../../core/tokens/ngb-modal-config.token';
import { Lecturer } from '../../../shared/models/lecturer';
import { LecturerService } from '../../../core/services/lecturer.service';
import { Form, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'create-or-update-lecturer',
  templateUrl: './create-or-update-lecturer.component.html',
  styleUrls: ['./create-or-update-lecturer.component.scss'],
})
export class CreateOrUpdateLecturerComponent implements OnInit {
  public editMode: boolean = false;
  private lecturerId: string | null = null;

  public academicDegrees: string[] = [
    'prof. – profesor',
    'prof. SGGW - profesor SGGW',
    'dr hab. – doktor habilitowany',
    'dr – doktor',
    'mgr – magister',
    'inż. - inżynier',
    'Inny'
  ] 

  public form: FormGroup | null = null;

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(MODAL_CONFIG) private modalConfig: NgbModalOptions,
    private modalService: NgbModal,
    public lecturerService: LecturerService
  ) { }

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      if (params.lecturerId) {
        this.lecturerId = params.lecturerId;

        this.editMode = true;
      } else {
        this.buildForm();
        this.editMode = false;
      }
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      id: [''],
      firstName: [''],
      surname: [''],
      email: [''],
      academicDegree: [''],
    });
  }
}
