import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './modules/home/home.component';
import { CounterComponent } from './modules/counter/counter.component';
import { FetchDataComponent } from './modules/fetch-data/fetch-data.component';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotLoggedInGuard } from './core/guards/not-logged-in.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { LecturerService } from './core/services/lecturer.service';
import { DecimalPipe, LowerCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    CoreModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      {
        path: '',
        canActivate: [NotLoggedInGuard],
        children: [
          {
            path: 'auth',
            loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
          }
        ]
      },
      {
        path: 'dashboard',
        canActivate: [LoggedInGuard],
        children: [
          {
            path: 'dashboard-main',
            loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
          }
        ]
      },
      {
        path: 'lecturers',
        canActivate: [LoggedInGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./modules/lecturers/lecturers.module').then(m => m.LecturersModule)
          }
        ]
      },
    ])
  ],
  providers: [LecturerService, DecimalPipe, LowerCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
