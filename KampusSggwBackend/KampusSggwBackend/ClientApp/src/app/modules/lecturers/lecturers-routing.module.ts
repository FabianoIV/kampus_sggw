import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { LecturersListComponent } from './lecturers-list/lecturers-list.component';
import { CreateOrUpdateLecturerComponent } from './create-or-update-lecturer/create-or-update-lecturer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'prefix'
  },
  {
    path: 'list',
    component: LecturersListComponent,
  },
  {
    path: 'create',
    component: CreateOrUpdateLecturerComponent,
  },
  {
    path: ':lecturerId/edit',
    component: CreateOrUpdateLecturerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LecturersRoutingModule {

}
