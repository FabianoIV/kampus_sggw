import {NgModule} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';

@NgModule({
  declarations: [
    DashboardMainComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
})
export class DashboardModule {}
