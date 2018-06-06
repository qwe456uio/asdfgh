import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { AgmCoreModule } from '@agm/core';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { DefaultLayoutComponent } from './layouts/default/default-layout.component';
import { UserLayoutComponent } from './layouts/user/user-layout.component';
import { ExpertLayoutComponent } from './layouts/expert/expert-layout.component';
import { SharedModule } from './shared/shared.module';

import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AdminService } from './services/admin.service';
import { SearchService } from './services/search.service'
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { ExpertService } from './services/expert.service';
import {QuestionsService} from './services/questions.service';
import {SessionService} from  './services/session.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    UserLayoutComponent,
    ExpertLayoutComponent
    
        
  ],
  imports: [
    NgxDatatableModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    AgmCoreModule.forRoot({apiKey: 'YOURAPIKEY'})
  ],
  providers: [HttpService, UserService, CookieService, AdminService, SearchService, ExpertService, QuestionsService,SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }