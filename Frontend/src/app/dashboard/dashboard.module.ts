import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';


import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(DashboardRoutes),NgbTabsetModule],
  declarations: [DashboardComponent]
})

export class DashboardModule {}
