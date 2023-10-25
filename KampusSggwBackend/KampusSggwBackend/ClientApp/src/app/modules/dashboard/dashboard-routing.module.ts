import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'prefix'
  },
  {
    path: 'dashboard',
    component: DashboardMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {

}
