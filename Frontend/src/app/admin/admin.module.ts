import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutes } from './admin.routing';
import { AdminProfileComponent } from './adminprofile/adminprofile.component';
import { AddAdminComponent } from './addadmin/addadmin.component';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {FilterRequestsComponent} from './filter-requests/filter-requests.component';
import { RespondExpertRequests } from './respond-expert-requests/respond-expert-requests';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule, NgbTabsetModule
  ],
  declarations: [AdminProfileComponent, AddAdminComponent, FilterRequestsComponent, RespondExpertRequests]
})

export class AdminModule {}