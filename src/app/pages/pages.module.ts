import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
//import { AppRoutingModule } from '../app-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [  

    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent],


  imports: [
    CommonModule,
    SharedModule,
    // AppRoutingModule
    RouterModule,]
})
export class PagesModule { }
