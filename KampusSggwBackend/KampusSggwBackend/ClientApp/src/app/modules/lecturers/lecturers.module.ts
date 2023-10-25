import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LecturersListComponent } from './lecturers-list/lecturers-list.component';
import { LecturersRoutingModule } from './lecturers-routing.module';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbdSortableHeader } from '../../core/directives/sortable-lecturers.directive';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrUpdateLecturerComponent } from './create-or-update-lecturer/create-or-update-lecturer.component';

@NgModule({
  declarations: [
    LecturersListComponent,
    CreateOrUpdateLecturerComponent
  ],
  imports: [
    NgFor,
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbTypeaheadModule,
    NgbdSortableHeader,
    NgbPaginationModule,
    NgIf,
    SharedModule,
    LecturersRoutingModule
  ],
})
export class LecturersModule {}
