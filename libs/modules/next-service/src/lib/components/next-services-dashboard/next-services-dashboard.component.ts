import { Component, OnInit } from '@angular/core';
import { NextServiceDirective } from '../../directives';
import { INextService } from '../../models';

@Component({
  selector: 'neural-next-services-dashboard',
  templateUrl: './next-services-dashboard.component.html',
  styleUrls: ['./next-services-dashboard.component.scss']
})
export class NextServicesDashboardComponent extends NextServiceDirective<INextService.IDashboard> {

}
