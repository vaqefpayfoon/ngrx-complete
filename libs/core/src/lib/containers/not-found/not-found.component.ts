import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Location } from '@angular/common';

@Component({
  selector: 'neural-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

  constructor(private location: Location) { }

  back(){
    this.location.back();
  }
}
