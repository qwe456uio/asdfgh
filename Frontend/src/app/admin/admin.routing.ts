import { Routes } from '@angular/router';
import { AdminProfileComponent } from './adminprofile/adminprofile.component';
import { AddAdminComponent } from './addadmin/addadmin.component';
import {FilterRequestsComponent} from './filter-requests/filter-requests.component';
import { RespondExpertRequests } from './respond-expert-requests/respond-expert-requests';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'profile',
      component: AdminProfileComponent
    },
    {
      path: 'addadmin',
      component: AddAdminComponent
    },
    {
      path: 'filtersessionrequests',
      component: FilterRequestsComponent
    },
  {
    path: 'expertRequests',
    component: RespondExpertRequests
  }  
  ]
  }
];
