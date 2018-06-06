import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { DefaultLayoutComponent } from './layouts/default/default-layout.component';
import { UserLayoutComponent } from './layouts/user/user-layout.component';
import { ExpertLayoutComponent } from './layouts/expert/expert-layout.component';

export const AppRoutes: Routes = [
  
  {
  path: '',
  component: DefaultLayoutComponent,
  children: [{
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  }, {
    path: 'docs',
    loadChildren: './docs/docs.module#DocsModule'}
    
   ]
},{
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: 'admin',
      loadChildren: './admin/admin.module#AdminModule'
    }]
  }, {
  path: '', 
  component: AuthLayoutComponent,
  children: [{
    path: 'authentication',
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  }, {
    path: 'error',
    loadChildren: './error/error.module#ErrorModule'
  }]
},
{
  path: '',
  component: UserLayoutComponent,
  children: [
] 
},
{
  path: '',
  component: ExpertLayoutComponent,
  children: [
]
}, 

 {
  path: '**',
  redirectTo: 'error/404'
}];
