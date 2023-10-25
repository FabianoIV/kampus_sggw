import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MODAL_CONFIG } from '../../../core/tokens/ngb-modal-config.token';
import { Lecturer } from '../../../shared/models/lecturer';
import { LecturerService } from '../../../core/services/lecturer.service';
import { NgbdSortableHeader, SortEvent } from '../../../core/directives/sortable-lecturers.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'lecturers-list',
  templateUrl: './lecturers-list.component.html',
  styleUrls: ['./lecturers-list.component.scss'],
})
export class LecturersListComponent implements OnInit {

  lecturers$: Observable<Lecturer[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    @Inject(MODAL_CONFIG) private modalConfig: NgbModalOptions,
    private modalService: NgbModal,
    public lecturerService: LecturerService
  ) {
    this.lecturers$ = lecturerService.lecturers$;
    this.total$ = lecturerService.total$;
  }

  public async ngOnInit(): Promise<void> {
    let lecturers = await this.lecturerService.getLecturers();
    this.lecturerService.rawLecturers = lecturers!;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.lecturerService.sortColumn = column;
    this.lecturerService.sortDirection = direction;
  }
}
