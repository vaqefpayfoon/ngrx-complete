import { Component } from '@angular/core';
import { NextServiceDirective } from '../../directives';
import { INextService } from '../../models';

@Component({
  selector: 'neural-next-services-card',
  templateUrl: './next-services-card.component.html',
  styleUrls: ['./next-services-card.component.scss']
})
export class NextServicesCardComponent  extends NextServiceDirective<INextService.IDocument> {
  constructor() {
    super();
  }
}
